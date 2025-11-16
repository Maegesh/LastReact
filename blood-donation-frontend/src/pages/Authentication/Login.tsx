import { useState, type FormEvent } from "react";
import { getToken } from "../../api/auth.api";
import { tokenstore } from "../../auth/tokenstore";
import { toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Alert, Card, CardContent
} from '@mui/material';
import {
  Bloodtype, Security, People, LocalHospital, 
  Favorite, VolunteerActivism, Login as LoginIcon
} from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const nav = useNavigate();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    setLoading(true);

    try {
      const { token, user } = await getToken({ email, password });
      tokenstore.set(token);
      tokenstore.setRole(user?.role?.toString() ?? null);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome back, ${user.firstName || 'User'}!`);

      
      if (user.role === 0) {
        nav("/admin", { replace: true });
      } else if (user?.role === 1) {
        nav("/donor", { replace: true });
      } else {
        nav("/recipient", { replace: true });
      }
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Bloodtype />, title: "Save Lives", desc: "Your donation can save up to 3 lives" },
    { icon: <Security />, title: "Secure Platform", desc: "Your data is protected with advanced security" },
    { icon: <People />, title: "Community", desc: "Join thousands of life-saving heroes" },
    { icon: <LocalHospital />, title: "Medical Support", desc: "Professional medical guidance available" }
  ];

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at center, #ff6b6b 0%, #d32f2f 50%, #8b0000 100%)",
      display: "flex",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Blood Drop Animation Background */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 2px, transparent 2px),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 3px, transparent 3px)
        `,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* Left Side - Hero Content */}
      <Box sx={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        p: 4,
        color: 'white',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: '50% 50% 50% 0',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            transform: 'rotate(-45deg)'
          }}>
            <Favorite sx={{ fontSize: 32, color: '#d32f2f', transform: 'rotate(45deg)' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            BloodConnect
          </Typography>
        </Box>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Every Drop Counts, Every Life Matters
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 500 }}>
          Join our mission to save lives through blood donation. Connect donors with recipients in a secure, efficient platform.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
          {features.map((feature, index) => (
            <Card key={index} sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', color: 'white', py: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box sx={{ 
        width: 450, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        p: 4,
        zIndex: 1
      }}>
        <Card sx={{ 
          width: '100%',
          maxWidth: 400,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50% 50% 50% 0',
                bgcolor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transform: 'rotate(-45deg)'
              }}>
                <LoginIcon sx={{ fontSize: 32, color: 'white', transform: 'rotate(45deg)' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue your life-saving journey
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                variant="outlined"
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#d32f2f',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 2,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  New to BloodConnect?
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/signup"
                fullWidth
                variant="outlined"
                startIcon={<VolunteerActivism />}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#b71c1c',
                    bgcolor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Join as Donor or Recipient
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>


    </Box>
  );
}