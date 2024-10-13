import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AgentDetails = () => {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);

  const fetchAgent = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}get-license/${agentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAgent(data.license);
      } else {
        console.error("Failed to fetch agent details");
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  const handleDownloadScript = (agentName,fileName) => {
    let script;
    const endpoint =  `${import.meta.env.VITE_API_URL}`
    const python = `import requests
import time

def send_heartbeat(license_code):
    
    url = f"${endpoint}agent/by-license/{license_code}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data  = response.json()
            print("Heartbeat sent successfully")
            print(f"Agent {data.get("agentName")} is active now")
            brands_supported = data.get("brandsSupported", [])
            selected_brands = [brand["brandName"] for brand in brands_supported if brand.get("selected")]
            
            if selected_brands:
                print(f"Configured Brand : {selected_brands}")
        else:
            print("Failed to send heartbeat:", response.status_code, response.json())
    except requests.exceptions.RequestException as e:
        print("Error sending heartbeat:", e)

def main():
    license_code = input("Please enter your license code: ")

    while True:
        send_heartbeat(license_code)
        time.sleep(60)

if __name__ == "__main__":
    main()
`

    const bash = `#!/bin/bash
  echo 'Starting to execute'
  currentDirectory=\$(pwd)
  destinationDirectory="agent-script" && mkdir -p "\$destinationDirectory"
  cp "\$currentDirectory/${agentName}.py" "\$destinationDirectory"
  cd "\$destinationDirectory"
  python3 -m venv .venv
  source .venv/bin/activate
  pip install requests
  python3 ${agentName}.py
  `
  let download;
  switch(fileName){
    case "Bash":script = bash;download="setup.sh"
      break;
    case "Script":script = python;download=`${agentName}.py`
    break;
  }
    const blob = new Blob([script], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = download;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  

  useEffect(() => {
    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  // useEffect(() => {
  //   console.log(agent);
  // }, [agent]);
  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        marginTop: 10,
        color: "red",
      }}
    >
      <Card
        sx={{
          width: 700,
          boxShadow: 3,
          border: "1px solid rgb(36, 196, 196)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            style={{ color: "rgb(36, 196, 196)", textAlign: "center" }}
          >
            Agent Details
          </Typography>
          {agent ? (
            <>
              <Typography
                variant="body1"
                component="div"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                <strong>Agent Name:</strong> {agent.agentId.agentName}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                <strong>Status:</strong> <Button
                  variant="contained"
                  sx={{
                    backgroundColor: agent.agentId.status === "Online" ? "green" : "red",
                    color: "white",
                    marginLeft: 0,
                    marginRight:3
                  }}
                  
                >
                  {agent.agentId.status}
                </Button>
              </Typography>
              <Typography
                variant="body2"
                component="div"
                style={{ marginBottom: "10px" }}
              >
                <strong>License Code:</strong> {agent.licenseKey}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                style={{ marginBottom: "20px" }}
              >
                <strong>Installation Instructions:</strong>
                <ol>
                  <li>Download the script from the options below.</li>
                  <li>Run the following command in your terminal:</li>
                  <pre>chmod +x setup.sh</pre>
                  <pre>
                    ./setup.sh
                  </pre>
                  <li>Follow the setup prompts to activate agent.</li>
                </ol>
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Loading agent details...
            </Typography>
          )}
          <Typography
            variant="body2"
            component="div"
            style={{ marginBottom: "10px" }}
          >
            <strong>Download Scripts:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 2,
            }}
          >
            <Tooltip title="setup.sh" arrow>
              <Button
                variant="contained"
                onClick={() => handleDownloadScript(agent.agentId.agentName.toLowerCase().replace(" ", "-"),"Bash")} // Pass agent name to the function
                style={{ backgroundColor: "rgb(36, 196, 196)", color: "white" }}
              >
                setup Script
              </Button>
              </Tooltip>
              <Tooltip title="Python Script" arrow>
              <Button
                variant="contained"
                onClick={() => handleDownloadScript(agent.agentId.agentName.toLowerCase().replace(" ", "-"),"Script")} // Pass agent name to the function
                style={{ backgroundColor: "rgb(36, 196, 196)", color: "white" }}
              >
                Download Script
              </Button>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgentDetails;
