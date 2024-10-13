import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const LogIn = () => {
  const [isVisible, setVisibility] = useState(false); 
  const [isLoading, setLoading] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errors, setErrors] = useState({ email: "", password: "" }); 

  const navigate = useNavigate(); 

  const handleLogIn = async () => {
    setLoading(true); 

    const userData = { email, password };

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json(); 

      if (response.ok) {
        console.log("Login Successful!", result);
        localStorage.setItem('token', result.token); 
        navigate('/dashboard'); 
        handleClose(); 
      } else {
        setErrors({
          email: result.errors?.email || "",
          password: result.errors?.password || "",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open aria-labelledby="login-dialog-title">
      <DialogTitle style={{ backgroundColor: 'rgb(36, 196, 196)', color: '#fff' }} id="login-dialog-title">Log In</DialogTitle>
      <DialogContent>
        <div className="form" style={{ width: "350px" }}>
          <div className="inputs">
            <TextField
              required
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
              style={{ marginBottom: '16px' }}
            />
          </div>
          <div className="inputs">
            <TextField
              required
              label="Password"
              type={isVisible ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password}
              style={{ marginBottom: '16px' }}
              InputProps={{
                endAdornment: (
                  <span onClick={() => setVisibility(!isVisible)} style={{ cursor: 'pointer', color: "rgb(36, 196, 196)" }}>
                    {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                ),
              }}
            />
          </div>
          {isLoading ? (
            <div className="cp" style={{ textAlign: 'center' }}>
              <CircularProgress size="30px" />
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogIn}
              style={{ backgroundColor: 'rgb(36, 196, 196)', color: '#fff' }}
            >
              Log In
            </Button>
          )}
        </div>
        <span>
          Don't have an account? <Link to="/signin">Register</Link>
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default LogIn;
