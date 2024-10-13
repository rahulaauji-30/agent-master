// sendAgents.js

const sampleSoftwareAgents = [
  {
    name: "Agent Lambda",
    description: "Agent Lambda specializes in automating workflows and task management.",
    brandsSupported: "Brand U, Brand V"
  },
  {
    name: "Agent Mu",
    description: "Agent Mu excels in data visualization and reporting solutions.",
    brandsSupported: "Brand W, Brand X, Brand Y"
  },
  {
    name: "Agent Nu",
    description: "Agent Nu focuses on cloud infrastructure management.",
    brandsSupported: "Brand Z"
  },
  {
    name: "Agent Xi",
    description: "Agent Xi provides solutions for API integration and microservices.",
    brandsSupported: "Brand AA, Brand BB, Brand CC"
  },
  {
    name: "Agent Omicron",
    description: "Agent Omicron specializes in DevOps and continuous delivery.",
    brandsSupported: "Brand DD, Brand EE"
  },
  {
    name: "Agent Pi",
    description: "Agent Pi is a leader in natural language processing and chatbot development.",
    brandsSupported: "Brand FF, Brand GG"
  },
  {
    name: "Agent Rho",
    description: "Agent Rho provides real-time analytics and monitoring services.",
    brandsSupported: "Brand HH"
  },
  {
    name: "Agent Sigma",
    description: "Agent Sigma focuses on database optimization and management.",
    brandsSupported: "Brand II, Brand JJ"
  },
  {
    name: "Agent Tau",
    description: "Agent Tau specializes in front-end and user interface development.",
    brandsSupported: "Brand KK, Brand LL"
  },
  {
    name: "Agent Upsilon",
    description: "Agent Upsilon excels in mobile app development and user experience design.",
    brandsSupported: "Brand MM"
  }
];

  
  // Function to send agent data to the API
  async function sendAgentData(agent) {
    try {
      const response = await fetch("http://localhost:3000/api/new-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agent),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Agent created successfully:", data);
      } else {
        console.error("Error creating agent:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  
  // Send each sample agent data
  async function run() {
    for (const agent of sampleSoftwareAgents) {
      await sendAgentData(agent);
    }
  }
  
  // Execute the run function
  run();
  