import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const SignIn = () => {
  const [isVisible, setVisibility] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", name: "", password: "" });

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    const userData = { email, name, password };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        setErrors({
          email: result.errors?.email || "",
          name: result.errors?.name || "",
          password: result.errors?.password || "",
        });
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register">
      <h1>Register</h1>
      <div className="form">
        <div className="inputs">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              border: errors.email ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.email && (
            <span className="error" style={{ color: "red" }}>
              {errors.email}
            </span>
          )}
        </div>
        <div className="inputs">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name here"
            style={{ border: errors.name ? "1px solid red" : "1px solid #ccc" }}
          />
          {errors.name && (
            <span className="error" style={{ color: "red" }}>
              {errors.name}
            </span>
          )}
        </div>
        <div className="inputs">
          <label htmlFor="password">Password</label>
          <div className="passwordField">
            <input
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ border: errors.password && "1px solid red" }}
            />
            {isVisible ? (
              <VisibilityIcon
                className="icon"
                onClick={() => setVisibility(false)}
              />
            ) : (
              <VisibilityOffIcon
                className="icon"
                onClick={() => setVisibility(true)}
              />
            )}
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        {isLoading ? (
          <div className="cp">
            <CircularProgress size="30px" />
          </div>
        ) : (
          <input type="button" value="Sign In" onClick={handleSignIn} />
        )}
      </div>
      <span>
        Already a user? <Link to="/login">Log in</Link>
      </span>
    </div>
  );
};

export default SignIn;
