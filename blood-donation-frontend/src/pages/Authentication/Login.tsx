import { useState, type FormEvent } from "react";
import { getToken } from "../../api/auth.api";
import { tokenstore } from "../../auth/tokenstore";
import { toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Alert, Card, Container, Avatar
} from '@mui/material';
import {
  Bloodtype, Security, Favorite, VolunteerActivism, 
  Login as LoginIcon, Phone, Email, Schedule, 
  CheckCircle, Star
} from '@mui/icons-material';
import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.webp';
import image3 from '../../assets/image3.jpg';
import image4 from '../../assets/image4.avif';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const nav = useNavigate();

  const getFieldError = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
    }
    return '';
  };

  const validateField = (field: string, value: string) => {
    const error = getFieldError(field, value);
    
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: removed, ...rest } = prev;
        return rest;
      }
    });
  };

  const validateForm = () => {
    const fields = ['email', 'password'];
    const errors: {[key: string]: string} = {};
    
    fields.forEach(field => {
      const value = field === 'email' ? email : password;
      const error = getFieldError(field, value);
      if (error) errors[field] = error;
    });
    
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
      const response = await getToken({ email, password });
      
      if (response.success && response.token && response.user) {
        tokenstore.set(response.token);
        tokenstore.setRole(response.user?.role?.toString() ?? null);
        localStorage.setItem('user', JSON.stringify(response.user));

        toast.success(`Welcome back, ${response.user.firstName || 'User'}!`);

        if (response.user.role === 0) {
          nav("/admin", { replace: true });
        } else if (response.user?.role === 1) {
          nav("/donor", { replace: true });
        } else {
          nav("/recipient", { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password. Please try again.");
      setError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { number: "50,000+", label: "Lives Saved" },
    { number: "25,000+", label: "Active Donors" },
    { number: "500+", label: "Blood Banks" },
    { number: "100+", label: "Cities Covered" }
  ];

  const features = [
    { icon: <Schedule />, title: "24/7 Emergency Support", desc: "Round-the-clock blood availability for critical cases" },
    { icon: <Security />, title: "Safe & Secure", desc: "All donors are screened and blood is tested for safety" },
    { icon: <Phone />, title: "Instant Connect", desc: "Connect with nearby donors within minutes" },
    { icon: <CheckCircle />, title: "Verified Network", desc: "All blood banks and hospitals are verified partners" }
  ];

  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Chief Medical Officer", text: "BloodConnect has revolutionized how we manage blood requests. It's saved countless lives.", rating: 5 },
    { name: "Rajesh Kumar", role: "Regular Donor", text: "Being able to help someone in need instantly through this platform gives me immense satisfaction.", rating: 5 },
    { name: "Anita Patel", role: "Recipient's Mother", text: "When my son needed blood urgently, BloodConnect helped us find donors within 30 minutes.", rating: 5 }
  ];

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw" }}>


      {/* Main Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '3px solid #d32f2f', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ width: 80, height: 80, bgcolor: '#d32f2f', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bloodtype sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 0.5 }}>
                BloodConnect
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', fontWeight: 500 }}>
                Blood Donation Management System
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
                Connecting Donors with Recipients - Save Lives
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Emergency</Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>Blood Request</Typography>
            </Box>
          </Box>
        </Container>
      </Box>



      {/* Hero Section */}
      <Box sx={{
        minHeight: "70vh",
        background: "linear-gradient(135deg, #000000ff 0%, #ad0f0fff 100%)",
        color: 'white',
        display: "flex",
        alignItems: "center",
        position: "relative"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              </Box>
              
              <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold', lineHeight: 1.2 }}>
                Save Lives.<br />Donate Blood.<br />Be a Hero.
              </Typography>
              
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.4 }}>
                India's largest blood donation platform connecting donors with those in need. 
                Join our mission to ensure no one dies due to blood shortage.
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={scrollToLogin}
                  sx={{ 
                    bgcolor: '#ffeb3b', 
                    color: '#d32f2f', 
                    fontWeight: 'bold',
                    px: 4, py: 2,
                    '&:hover': { bgcolor: '#ffc107' }
                  }}
                >
                  Donate Blood Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={scrollToLogin}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white', 
                    fontWeight: 'bold',
                    px: 4, py: 2,
                    '&:hover': { borderColor: '#ffeb3b', color: '#ffeb3b' }
                  }}
                >
                  Find Blood
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {stats.map((stat, index) => (
                  <Box key={index} sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffeb3b' }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body1">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{
                height: 400,
                borderRadius: 4,
                backgroundImage: `url(${image1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.2)',
                position: 'relative'
              }}>
                <Box sx={{ 
                  textAlign: 'center',
                  bgcolor: 'rgba(211, 47, 47, 0.85)',
                  p: 3,
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                    Every 2 seconds someone needs blood
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, color: 'white' }}>
                    Your donation can save up to 3 lives
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Donation Process Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{
                width: '100%',
                height: 350,
                backgroundImage: `url(${image2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 3,
                boxShadow: 3
              }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#d32f2f' }}>
                Simple Donation Process
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                Our streamlined process makes blood donation quick, safe, and comfortable for every donor.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 'bold' }}>1</Box>
                  <Typography variant="body1">Registration & Health Screening</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 'bold' }}>2</Box>
                  <Typography variant="body1">Quick Medical Check-up</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 'bold' }}>3</Box>
                  <Typography variant="body1">Safe Blood Donation (10-15 mins)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 'bold' }}>4</Box>
                  <Typography variant="body1">Rest & Refreshments</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#d32f2f' }}>
              Why Choose BloodConnect?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              We're committed to making blood donation simple, safe, and accessible for everyone
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' }, minWidth: 250 }}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                  transition: 'all 0.3s ease'
                }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'white'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Impact Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#d32f2f' }}>
                Your Impact Matters
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                Every donation creates a ripple effect of hope and healing in our community.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>3</Typography>
                  <Typography variant="body1">Lives Saved</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>450ml</Typography>
                  <Typography variant="body1">Per Donation</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>56</Typography>
                  <Typography variant="body1">Days to Recover</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{
                width: '100%',
                height: 350,
                backgroundImage: `url(${image3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 3,
                boxShadow: 3
              }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#d32f2f' }}>
              What People Say About Us
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Real stories from our community of heroes
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 300 }}>
                <Card sx={{ p: 3, height: '100%', boxShadow: 2 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#d32f2f', mr: 2 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Login Section */}
      <Box id="login-section" sx={{ 
        py: 8, 
        backgroundImage: `url(${image4})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.4)',
          zIndex: 1
        }} />
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Card sx={{ p: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LoginIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Sign in to continue saving lives
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField('email', e.target.value);
                }}
                required
                sx={{ mb: 3 }}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField('password', e.target.value);
                }}
                required
                sx={{ mb: 3 }}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{
                  bgcolor: '#d32f2f',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 3,
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In to Save Lives'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  New to our life-saving community?
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/signup"
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<VolunteerActivism />}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  py: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    bgcolor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Join as Donor or Recipient
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#d32f2f', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Favorite sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  BloodConnect
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Connecting hearts, saving lives through blood donation.
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">+91 1800-123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">help@bloodconnect.org</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Emergency Helpline
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffeb3b' }}>
                108
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                24/7 Blood Emergency Support
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}