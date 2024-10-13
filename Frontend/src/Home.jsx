import { useEffect, useState } from "react";
import AgentCard from "./AgentCard";
import { Backdrop, CircularProgress, Button } from "@mui/material";

const Home = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchAgent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}agents`);
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
      } else {
        console.error("Failed to fetch agents:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  
  useEffect(() => {
    setLoading(true)
    fetchAgent();
    setLoading(false)
  }, []);

  return (
    <div
      className="home"
      style={{
        display: "flex",
        gap: 20,
        flexDirection: "column",
        marginTop: "90px",
      }}
    >
      {isLoading ? (
          <Backdrop
            sx={{ color: "rgb(36, 196, 196)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
      ) : agents == null ? (
        <span>No agents</span>
      ) : (
        agents.map((agent) => (
          <AgentCard
            key={agent._id}
            agentId={agent._id}
            agentName={agent.agentName}
            agentDescription={agent.agentDescription}
          />
        ))
      )}
    </div>
  );
};

export default Home;
