import {
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  Collapse,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const MyAgents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState({});
  const [openDetails, setOpenDetails] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const fetchPurchasedAgents = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}myagents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents);
        const defaultConfigurations = {};
        data.agents.forEach((agent) => {
          if (
            Array.isArray(agent.brandsSupported) &&
            agent.brandsSupported.length > 0
          ) {
            defaultConfigurations[agent._id] = agent.brandsSupported.map(
              (brand) => ({
                brandName: brand.brandName,
                selected: brand.selected,
              })
            );
          } else {
            defaultConfigurations[agent._id] = "No Brands Available";
          }
        });
        setSelectedConfigurations(defaultConfigurations);
      } else {
        console.error("Failed to fetch purchased agents:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching purchased agents:", error);
    }
  };

  useEffect(() => {
    fetchPurchasedAgents();
    const intervalId = setInterval(fetchPurchasedAgents, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleConfigurationChange = async (id, brandName) => {
    setSelectedConfigurations((prev) => {
      const updatedBrands = prev[id].map((brand) =>
        brand.brandName === brandName
          ? { ...brand, selected: true }
          : { ...brand, selected: false }
      );
      return { ...prev, [id]: updatedBrands };
    });

    try {
      const response = await fetch(`${VITE_API_URL}configure`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: id,
          brandsSupported: selectedConfigurations[id].map((brand) => ({
            brandName: brand.brandName,
            selected: brand.brandName === brandName,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update agent configuration");
      }

      fetchPurchasedAgents();
    } catch (error) {
      console.error("Error updating agent configuration:", error);
    }
  };

  const handleToggleDetails = (agentId) => {
    setOpenDetails((prev) => (prev === agentId ? null : agentId));
  };

  const handleViewDetails = (agentId) => {
    navigate(`/agent/${agentId}`);
  };

  return (
    <List>
      {agents.length > 0 ? (
        agents.map((agent) => {
          const noBrandsAvailable =
            !Array.isArray(agent.brandsSupported) ||
            agent.brandsSupported.length === 0;

          return (
            <Box key={agent._id}>
              <ListItem
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  marginBottom: 0.5,
                  border: "1px solid rgb(36, 196, 196)",
                  cursor: "pointer",
                }}
                onClick={() => handleToggleDetails(agent._id)}
              >
                <ListItemText primary={`${agent.agentName}`} />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      agent.status === "Online" ? "green" : "red",
                    color: "white",
                    marginLeft: 0,
                    marginRight: 3,
                  }}
                >
                  {agent.status}
                </Button>
                <FormControl sx={{ minWidth: 200, marginRight: 2, padding: 0 }}>
                  <Select
                    labelId={`configuration-label-${agent._id}`}
                    value={
                      selectedConfigurations[agent._id]
                        ? selectedConfigurations[agent._id].find(
                            (brand) => brand.selected
                          )?.brandName
                        : ""
                    }
                    onChange={(e) =>
                      handleConfigurationChange(agent._id, e.target.value)
                    } // Update selected brand
                    sx={{ height: "36px", padding: 0 }}
                    disabled={noBrandsAvailable}
                  >
                    {noBrandsAvailable ? (
                      <MenuItem value="No Brands Available" disabled>
                        No Brands Available
                      </MenuItem>
                    ) : (
                      agent.brandsSupported.map((brand) => (
                        <MenuItem key={brand.brandName} value={brand.brandName}>
                          {brand.brandName}{" "}
                          {selectedConfigurations[agent._id] &&
                          selectedConfigurations[agent._id].find(
                            (b) => b.brandName === brand.brandName
                          )?.selected
                            ? "✓"
                            : ""}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </ListItem>

              <Collapse
                in={openDetails === agent._id}
                timeout="auto"
                unmountOnExit
              >
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "rgba(36, 196, 196, 0.1)",
                    borderRadius: "4px",
                    marginBottom: 1,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                >
                  <ListItemText
                    primary={`Agent Description: ${agent.agentDescription}`}
                    secondary={`Brands Supported: ${agent.brandsSupported.map((brand) => brand.brandName).join(", ")}`}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleViewDetails(agent._id)}
                    sx={{
                      marginTop: 1,
                      backgroundColor: "rgb(36, 196, 196)",
                      color: "white",
                    }}
                  >
                    View Detail
                  </Button>
                </Box>
              </Collapse>
            </Box>
          );
        })
      ) : (
        <ListItem>
          <ListItemText primary="No purchased agents found." />
        </ListItem>
      )}
    </List>
  );
};

export default MyAgents;
