import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement actual authentication logic here
    // For example purposes, we'll just set a token in local storage
    localStorage.setItem("authToken", "your-auth-token");
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
