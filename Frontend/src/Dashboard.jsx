import React, { useState } from 'react';
import { Box, Button, Typography} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMyAgentsActive = location.pathname === "/dashboard";
    const isBuyAgentsActive = location.pathname === "/dashboard/buy-agent";

    return (
        <Box sx={{ padding: 2, backgroundColor: 'white' }}>
            <Typography variant="h4" component="h1" sx={{ color: 'rgb(36, 196, 196)', marginTop: 7 }}>
                Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                <Button
                    sx={{
                        backgroundColor: isMyAgentsActive ? "#25C4C4" : "none",
                        color: isMyAgentsActive ? "white" : "rgb(36, 196, 196)",
                        textAlign: "center",
                        borderRadius: 0.3,
                        border: "1px solid lightgray",
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    <Typography sx={{ fontSize: "15px", textTransform: "none", textAlign: "center" }}>
                        My Agents
                    </Typography>
                </Button>
                <Button
                    sx={{
                        backgroundColor: isBuyAgentsActive ? "#25C4C4" : "none",
                        color: isBuyAgentsActive ? "white" : "rgb(36, 196, 196)",
                        textAlign: "center",
                        borderRadius: 0.3,
                        border: "1px solid lightgray",
                    }}
                    onClick={() => navigate('/dashboard/buy-agent')}
                >
                    <Typography sx={{ fontSize: "15px", textTransform: "none", textAlign: "center" }}>
                        Buy Agents
                    </Typography>
                </Button>
            </Box>
            <Outlet/>
        </Box>
    );
};

export default Dashboard;
