import { List, ListItem, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const BuyAgent = () => {
    const [agents, setAgents] = useState([]); 
    const [purchasedAgents, setPurchasedAgents] = useState([]);
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const fetchAgents = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}agents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched Agents:', data.agents);
                setAgents(data.agents); 
            } else {
                console.error('Failed to fetch agents:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const fetchPurchasedAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${VITE_API_URL}myagents`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Purchased Agents:', data.agents); 
                setPurchasedAgents(data.agents); 
            } else {
                console.error('Failed to fetch purchased agents:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching purchased agents:', error);
        }
    };

    const availableAgents = agents.filter(agent => 
        !purchasedAgents.some(purchasedAgent => purchasedAgent.id === agent.id)
    );
    useEffect(() => {
        fetchAgents(); 
        fetchPurchasedAgents(); 
    }, []);

    useEffect(() => {
        
        console.log("Purchased Agents:", purchasedAgents);
        console.log("Available Agents:", availableAgents);

    }, [agents, purchasedAgents]); 

    const configureAgent = (id, selectedBrands) => {
        console.log(`Configuring agent ${id} with brands:`, selectedBrands);
    };


    return (
        <List>
            <h3>Available Agents:</h3>
            {availableAgents.length === 0 ? (
                <ListItem>
                    <ListItemText primary="No agents available to purchase." />
                </ListItem>
            ) : (
                availableAgents.map((agent) => (
                    <ListItem
                        key={agent.id}
                        sx={{ backgroundColor: 'rgba(36, 196, 196, 0.1)', borderRadius: '4px', marginBottom: 1 }}
                    >
                        <ListItemText primary={`${agent.agentName}`} />
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'rgb(36, 196, 196)', color: 'white' }}
                            onClick={() => configureAgent(agent.id, ['Brand 1', 'Brand 2'])}
                        >
                            Purchase
                        </Button>
                    </ListItem>
                ))
            )}
        </List>
    );
};

export default BuyAgent;
