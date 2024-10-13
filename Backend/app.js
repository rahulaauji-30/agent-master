import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import nodeCron  from "node-cron";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }], 
});

const User = mongoose.model("User", userSchema);

// Agent Schema & Model
const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  agentDescription: { type: String, required: true },
  status: { type: String, default: "Offline" },
  brandsSupported: { type: [{
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      brandName: { type: String, required: true },
      selected: { type: Boolean, default: false }
    }], default: [] },
  lastOnline: { type: Date, default: null }
});

const Agent = mongoose.model("Agent", agentSchema);

// License Schema & Model
const licenseSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  licenseKey: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const License = mongoose.model("License", licenseSchema);


// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Home Route
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API is up and running",
  });
});

// Register Route
app.post("/api/register", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errors: { email: "User already exists" }
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Registration successful", token });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: { email: "Invalid email or password" }
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        errors: { password: "Invalid email or password" }
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message
    });
  }
});

// Verify Password Route
app.post("/api/verify-password", authenticateUser, async (req, res) => {
  const { password } = req.body;

  try {
    // Find the user by ID from the token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying password",
      error: error.message
    });
  }
});

// Route to create a new agent 
app.post("/api/new-agent", async (req, res) => {
  const { name, description, brandsSupported } = req.body;

  try {

    const brandsArray = brandsSupported.split(",").map((brandName, index) => ({
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for each brand
      brandName: brandName.trim(), // Trim whitespace from brand name
      selected: index === 0, // Set the first brand as selected by default
    }));

    const agent = new Agent({
      agentName: name,
      agentDescription: description,
      brandsSupported: brandsArray, // Set the brandsSupported to the transformed array
    });

    // Save the agent to the database
    await agent.save();

    // Generate a license key
    const licenseKey = generateLicenseKey();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // License valid for 1 year

    // Create a new license instance
    const license = new License({
      agentId: agent._id,
      licenseKey,
      expiresAt,
    });

    // Save the license to the database
    await license.save();

    res.status(201).json({ message: "New agent created and license generated successfully", agent, licenseKey });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new agent or generating license",
      error: error.message,
    });
  }
});

// Function to generate a random license key
const generateLicenseKey = () => {
  return Math.random().toString(36).slice(2).toUpperCase() + '-' + Math.random().toString(36).slice(2).toUpperCase();
};

// Route to get all agents
app.get("/api/agents", async (req, res) => {
  try {
    // Retrieve all agents from the database
    const agents = await Agent.find();

    res.status(200).json({ agents });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving agents",
      error: error.message,
    });
  }
});


// Purchase Agent License Route
app.post("/api/purchase", authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const _id = req.body._id

    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { agents: _id } });
    if (!updatedUser) {
      // If no user was found with the given ID
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Agent license purchased successfully",
      agentId: _id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error purchasing agent license",
      error: error.message
    });
  }
});

app.get("/api/get-license/:agentId", authenticateUser, async (req, res) => {
  const { agentId } = req.params;

  try {
    // Find the license by the agent ID
    const license = await License.findOne({ agentId }).populate("agentId");

    if (!license) {
      return res.status(404).json({ message: "License not found for the provided agent ID" });
    }

    res.status(200).json({ license });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving license",
      error: error.message,
    });
  }
});



// Route to get all agents for the authenticated user
app.get("/api/myagents", authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    // Retrieve the user and populate the agents
    const user = await User.findById(userId).populate("agents");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ agents: user.agents });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving agents",
      error: error.message,
    });
  }
});

// Endpoint to find an agent by license key
app.get("/api/agent/by-license/:licenseKey", async (req, res) => {
  const { licenseKey } = req.params;

  try {
    // Find the license by license key
    const license = await License.findOne({ licenseKey });
    console.log(licenseKey)
    if (!license) {
      return res.status(404).json({ message: "License not found" });
    }

    // Find the agent by agentId from the license
    const agent = await Agent.findById(license.agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    agent.status = "Online"
    agent.lastOnline = Date.now()
    await agent.save()
    // Return the agent details
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving agent by license",
      error: error.message,
    });
  }
});

// Scheduled job to update agent statuses
nodeCron.schedule("* * * * *", async () => {
  try {
    const agents = await Agent.find();
    const currentTime = Date.now();
    const oneMinuteAgo = currentTime - 60 * 1000;
    for (const agent of agents) {
      if (agent.lastOnline < oneMinuteAgo) {
        agent.status = "Offline"; // Update to Offline
        await agent.save();
      }
    }
  } catch (error) {
    console.error("Error updating agent statuses:", error.message);
  }
});

app.patch("/api/configure", authenticateUser, async (req, res) => {
  const { agentId, brandsSupported } = req.body;

  try {
    // Find the agent by _id and verify the user owns the agent
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Deselect all brands first
    agent.brandsSupported.forEach((brand) => {
      brand.selected = false; // Set all brands to not selected
    });

    // Set only the selected brand to true based on the incoming request
    const selectedBrand = brandsSupported.find(brand => brand.selected);
    if (selectedBrand) {
      const existingBrand = agent.brandsSupported.find(brand => brand.brandName === selectedBrand.brandName);
      if (existingBrand) {
        existingBrand.selected = true; // Select the new brand
      }
    }

    // Save the updated agent configuration
    await agent.save();

    res.status(200).json({ message: "Agent configuration updated successfully", agent });
  } catch (error) {
    res.status(500).json({
      message: "Error configuring agent",
      error: error.message,
    });
  }
});



// Route to create a new agent with authentication
// app.post("/api/new-agent", authenticateUser, async (req, res) => {
//   let { name, description, brandsSupported } = req.body;
//   brandsSupported = brandsSupported.split(",");

//   try {
//     // Create a new agent instance
//     const agent = new Agent({
//       agentName: name,
//       agentDescription: description,
//       brandsSupported,
//     });

//     // Save the agent to the database
//     await agent.save();

//     res.status(201).json({ message: "New agent created successfully", agent });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating new agent",
//       error: error.message,
//     });
//   }
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
