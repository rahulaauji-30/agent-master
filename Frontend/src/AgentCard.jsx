import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Tooltip, Modal, Box, TextField, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import LogIn from "./LogInPop";
const AgentCard = (props) => {
    const navigate = useNavigate(); 
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [password, setPassword] = useState(""); 
    const [passwordError, setPasswordError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const [successOpen, setSuccessOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);  
    const [timerActive, setTimerActive] = useState(false);  
    const [isOpen,setIsOpen] = useState(false)
  const [isLogInOpen, setLogInOpen] = useState(false); 

    const fetchUserAgent = async ()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}myagents`,{
              method:"GET",
              headers:{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            });
            if (response.ok) {
              const data = await response.json()
              return data.agents
            }else{
              console.log("this is the respnse\n"+response)
              return []
            }
        }catch(error) {
          console.error("Error fetching purchased agents:", error);
          return []
        }
    }
    const isAlreadyExists = async (userAgents, agent) => {
        for (const userAgent of userAgents) {
            if (userAgent._id === agent) {
              return true;
            }
        }
        return false;
      };
      
    

      const handleCloseLogIn = () => {
        setLogInOpen(false);
      };

    const handlePurchaseClick = async ()=>{
        if (localStorage.getItem('token') != null) {

            const userAgents = await fetchUserAgent()
            let doesExists = await isAlreadyExists(userAgents,props.agentId)
            if (!doesExists) {
                setConfirmOpen(true); 
            }else{
                setIsOpen(true)
            }
        } else {
            setLogInOpen(true); 
        }
    };

    const handleClose = () => {
        setOpen(false);
        setConfirmOpen(false);
        setIsOpen(false)
        setPasswordError(false);
        setErrorMessage("");
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(false);  
        setErrorMessage(""); 
    };

    const handleConfirmPayment = async () => {
        const token = localStorage.getItem('token');
        if (password) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}verify-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ password }) 
                });
    
                const data = await response.json();

                if (response.ok) {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}purchase`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({ _id:props.agentId,}) 
                    });
                    setConfirmOpen(false);
                    setSuccessOpen(true);
                    setTimerActive(true);  
                    setCountdown(5);
                } else {
                    setPasswordError(true); 
                    setErrorMessage(data.message || 'Password verification failed');
                }
            } catch (error) {
                console.error('Error verifying password:', error);
                setPasswordError(true);  
                setErrorMessage('An error occurred while verifying the password');}  
        } else {
            setPasswordError(true); 
            setErrorMessage('Please enter your password'); 
        }
    };
    
    useEffect(() => {
        if(isOpen){
            const timer = setTimeout(() => {
                handleClose();
              }, 5000);
              return () => clearTimeout(timer);
        }else{
            let timer;
        if (timerActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setTimerActive(false);
            navigate(`/agent/${props.agentId}`);  
        }
        return () => clearInterval(timer); 
        }
    }, [timerActive, countdown, navigate,isOpen]);

    return (
        <>
            <Tooltip title="More Info" arrow>
                <Card
                    sx={{
                        cursor: "pointer",
                        transition: "0.3s",
                        border: "1px solid rgb(36, 196, 196)",
                        "&:hover": {
                            boxShadow: 3, 
                        },
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div" style={{ color: "rgb(36, 196, 196)" }}>
                            {props.agentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.agentDescription}
                        </Typography>
                        <Button
                            onClick={handlePurchaseClick}
                            variant="contained"
                            style={{ backgroundColor: "rgb(36, 196, 196)", color: "white", marginTop: "10px" }}
                        >
                            Purchase
                        </Button>
                    </CardContent>
                </Card>
            </Tooltip>
            
            {/* Modal for Payment Confirmation */}
            <Modal
                open={confirmOpen}
                onClose={handleClose}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" component="div" style={{ marginBottom: "10px", color: "rgb(36, 196, 196)" }}>
                        Confirm Payment
                    </Typography>
                    <Typography variant="body1" component="div">
                        Agent Name: {props.agentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: "10px" }}>
                        {props.agentDescription}
                    </Typography>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        error={passwordError} 
                        helperText={passwordError && errorMessage}  
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        onClick={handleConfirmPayment}
                        variant="contained"
                        fullWidth
                        style={{ backgroundColor: "rgb(36, 196, 196)", color: "white" }}
                    >
                        Confirm Payment
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={successOpen}
                closeAfterTransition
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Fade in={successOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" component="div" style={{ color: "green", marginBottom: "10px" }}>
                            Agent Purchased Successfully!
                        </Typography>
                        <Typography variant="body1" component="div">
                            Thank you for your purchase.
                        </Typography>
                        <Typography variant="body2" component="div" style={{ marginTop: "10px" }}>
                            Redirecting in {countdown} seconds...
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="agent-exists-modal-title"
      aria-describedby="agent-exists-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="agent-exists-modal-title"
          variant="h6"
          component="div"
          style={{ marginBottom: "10px", color: "rgb(36, 196, 196)" }}
        >
          Agent Already Purchased
        </Typography>
        <Typography
          id="agent-exists-modal-description"
          variant="body1"
          component="div"
        >
          You have already purchased this agent. Please choose another agent.
        </Typography>
      </Box>
    </Modal>

    <LogIn open={isLogInOpen} handleClose={handleCloseLogIn} />
    
        </>
    );
};

export default AgentCard;
