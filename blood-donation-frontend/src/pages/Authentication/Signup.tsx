import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, Alert, Tabs, Tab,
  Card, CardContent, Stepper, Step, StepLabel, Chip
} from '@mui/material';
import { 
  PersonAdd, Bloodtype, Favorite, VolunteerActivism, 
  LocalHospital, CheckCircle, ArrowBack
} from '@mui/icons-material';
import { authAPI } from '../../api/auth.api';
import { toast } from 'react-toastify';
9
interface DonorSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  bloodGroup: string;
  age: number;
  gender: string;
  lastDonationDate: string;
}

interface RecipientSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hospitalName: string;
  requiredBloodGroup: string;
  contactNumber: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const [donorData, setDonorData] = useState<DonorSignupData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    bloodGroup: '',
    age: 18,
    gender: '',
    lastDonationDate: ''
  });

  const [recipientData, setRecipientData] = useState<RecipientSignupData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    hospitalName: '',
    requiredBloodGroup: '',
    contactNumber: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const validateField = (field: string, value: any) => {
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

  const validateDonorForm = () => {
    const fields = ['firstName', 'lastName', 'email', 'password', 'contactNumber', 'bloodGroup', 'age', 'gender', 'lastDonationDate'];
    const errors: {[key: string]: string} = {};
    
    fields.forEach(field => {
      const value = donorData[field as keyof DonorSignupData];
      const error = getFieldError(field, value);
      if (error) errors[field] = error;
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRecipientForm = () => {
    const fields = ['firstName', 'lastName', 'email', 'password', 'hospitalName', 'requiredBloodGroup', 'contactNumber'];
    const errors: {[key: string]: string} = {};
    
    fields.forEach(field => {
      const value = recipientData[field as keyof RecipientSignupData];
      const error = getFieldError(field, value);
      if (error) errors[field] = error;
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (field: string, value: any): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value?.trim()) return `${field === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        break;
      case 'email':
        if (!value?.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain uppercase, lowercase, and number';
        break;
      case 'contactNumber':
        if (!value?.trim()) return 'Contact number is required';
        if (!/^\d{10,15}$/.test(value)) return 'Contact number must be 10-15 digits';
        break;
      case 'bloodGroup':
      case 'requiredBloodGroup':
        if (!value) return 'Blood group is required';
        break;
      case 'age':
        if (!value || value < 18 || value > 65) return 'Age must be between 18 and 65';
        break;
      case 'gender':
        if (!value) return 'Gender is required';
        break;
      case 'hospitalName':
        if (!value?.trim()) return 'Hospital name is required';
        if (value.length < 3) return 'Hospital name must be at least 3 characters';
        break;
      case 'lastDonationDate':
        if (value && new Date(value) > new Date()) return 'Last donation date cannot be in the future';
        break;
    }
    return '';
  };

  const handleDonorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateDonorForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    try {
      await authAPI.signupDonor(donorData);
      toast.success('Registration successful! Redirecting to login...');
      setSuccess('Donor registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateRecipientForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    try {
      await authAPI.signupRecipient(recipientData);
      toast.success('Registration successful! Redirecting to login...');
      setSuccess('Recipient registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { title: "Save Lives", desc: "Each donation can save up to 3 lives", icon: <Favorite /> },
    { title: "Health Benefits", desc: "Regular donation improves your health", icon: <CheckCircle /> },
    { title: "Community Impact", desc: "Be a hero in your community", icon: <VolunteerActivism /> },
    { title: "Medical Checkup", desc: "Free health screening with each donation", icon: <LocalHospital /> }
  ];

  const steps = ['Choose Role', 'Personal Info', 'Medical Details', 'Complete'];

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at center, #e93535ff 0%, #d32f2f 50%, #620202ff 100%)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Blood Drop Animation Background */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
          radial-gradient(circle at 85% 75%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 45% 85%, rgba(255,255,255,0.05) 3px, transparent 3px),
          radial-gradient(circle at 75% 15%, rgba(255,255,255,0.08) 2px, transparent 2px)
        `,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        animation: 'float 8s ease-in-out infinite'
      }} />

      {/* Left Side - Hero Section */}
      <Box sx={{ 
        width: 400, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
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
          Join the Life-Saving Community
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Whether you're a donor ready to save lives or someone in need of blood, 
          our platform connects you with the right people at the right time.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Why Join Us?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {benefits.map((benefit, index) => (
              <Card key={index} sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', color: 'white', py: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {benefit.desc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body1" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
            "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Registration Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        zIndex: 1
      }}>
        <Card sx={{ 
          width: '100%',
          maxWidth: 700,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join thousands of heroes making a difference
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBack />}
                sx={{ color: '#d32f2f' }}
              >
                Back to Login
              </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Stepper activeStep={1} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              sx={{ mb: 4 }}
            >
              <Tab 
                icon={<Bloodtype />} 
                label="Become a Donor" 
                sx={{ 
                  minHeight: 80,
                  '&.Mui-selected': { color: '#d32f2f' }
                }}
              />
              <Tab 
                icon={<PersonAdd />} 
                label="Register as Recipient" 
                sx={{ 
                  minHeight: 80,
                  '&.Mui-selected': { color: '#d32f2f' }
                }}
              />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50% 50% 50% 0',
                    bgcolor: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    transform: 'rotate(-45deg)'
                  }}>
                    <Bloodtype sx={{ color: 'white', transform: 'rotate(45deg)' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Donor Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Help save lives by donating blood
                    </Typography>
                  </Box>
                </Box>

                <Box component="form" onSubmit={handleDonorSignup}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="First Name"
                      value={donorData.firstName}
                      onChange={(e) => {
                        setDonorData({...donorData, firstName: e.target.value});
                        validateField('firstName', e.target.value);
                      }}
                      required
                      fullWidth
                      error={!!validationErrors.firstName}
                      helperText={validationErrors.firstName}
                    />
                    <TextField
                      label="Last Name"
                      value={donorData.lastName}
                      onChange={(e) => {
                        setDonorData({...donorData, lastName: e.target.value});
                        validateField('lastName', e.target.value);
                      }}
                      required
                      fullWidth
                      error={!!validationErrors.lastName}
                      helperText={validationErrors.lastName}
                    />
                  </Box>
                  
                  <TextField
                    label="Email Address"
                    type="email"
                    value={donorData.email}
                    onChange={(e) => {
                      setDonorData({...donorData, email: e.target.value});
                      validateField('email', e.target.value);
                    }}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                  
                  <TextField
                    label="Password"
                    type="password"
                    value={donorData.password}
                    onChange={(e) => {
                      setDonorData({...donorData, password: e.target.value});
                      validateField('password', e.target.value);
                    }}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Contact Number"
                      value={donorData.contactNumber}
                      onChange={(e) => {
                        setDonorData({...donorData, contactNumber: e.target.value});
                        validateField('contactNumber', e.target.value);
                      }}
                      required
                      fullWidth
                      error={!!validationErrors.contactNumber}
                      helperText={validationErrors.contactNumber}
                    />
                    <FormControl required fullWidth error={!!validationErrors.bloodGroup}>
                      <InputLabel>Blood Group</InputLabel>
                      <Select
                        value={donorData.bloodGroup}
                        onChange={(e) => {
                          setDonorData({...donorData, bloodGroup: e.target.value});
                          validateField('bloodGroup', e.target.value);
                        }}
                        label="Blood Group"
                      >
                        {bloodGroups.map(group => (
                          <MenuItem key={group} value={group}>
                            <Chip label={group} sx={{ bgcolor: '#d32f2f', color: 'white' }} />
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.bloodGroup && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {validationErrors.bloodGroup}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Age"
                      type="number"
                      value={donorData.age}
                      onChange={(e) => {
                        const age = parseInt(e.target.value);
                        setDonorData({...donorData, age});
                        validateField('age', age);
                      }}
                      required
                      fullWidth
                      inputProps={{ min: 18, max: 65 }}
                      error={!!validationErrors.age}
                      helperText={validationErrors.age || 'Must be between 18-65 years'}
                    />
                    <FormControl required fullWidth error={!!validationErrors.gender}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={donorData.gender}
                        onChange={(e) => {
                          setDonorData({...donorData, gender: e.target.value});
                          validateField('gender', e.target.value);
                        }}
                        label="Gender"
                      >
                        {genders.map(gender => (
                          <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                        ))}
                      </Select>
                      {validationErrors.gender && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {validationErrors.gender}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                  
                  <TextField
                    label="Last Donation Date"
                    type="date"
                    value={donorData.lastDonationDate}
                    onChange={(e) => {
                      setDonorData({...donorData, lastDonationDate: e.target.value});
                      validateField('lastDonationDate', e.target.value);
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{ mb: 3 }}
                    error={!!validationErrors.lastDonationDate}
                    helperText={validationErrors.lastDonationDate}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      bgcolor: '#d32f2f', 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#b71c1c' }
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Register as Donor'}
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50% 50% 50% 0',
                    bgcolor: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    transform: 'rotate(-45deg)'
                  }}>
                    <LocalHospital sx={{ color: 'white', transform: 'rotate(45deg)' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Recipient Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get connected with blood donors
                    </Typography>
                  </Box>
                </Box>

                <Box component="form" onSubmit={handleRecipientSignup}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="First Name"
                      value={recipientData.firstName}
                      onChange={(e) => setRecipientData({...recipientData, firstName: e.target.value})}
                      required
                      fullWidth
                      error={!!validationErrors.firstName}
                      helperText={validationErrors.firstName}
                    />
                    <TextField
                      label="Last Name"
                      value={recipientData.lastName}
                      onChange={(e) => setRecipientData({...recipientData, lastName: e.target.value})}
                      required
                      fullWidth
                      error={!!validationErrors.lastName}
                      helperText={validationErrors.lastName}
                    />
                  </Box>
                  
                  <TextField
                    label="Email Address"
                    type="email"
                    value={recipientData.email}
                    onChange={(e) => setRecipientData({...recipientData, email: e.target.value})}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                  
                  <TextField
                    label="Password"
                    type="password"
                    value={recipientData.password}
                    onChange={(e) => setRecipientData({...recipientData, password: e.target.value})}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                  />
                  
                  <TextField
                    label="Hospital Name"
                    value={recipientData.hospitalName}
                    onChange={(e) => setRecipientData({...recipientData, hospitalName: e.target.value})}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!validationErrors.hospitalName}
                    helperText={validationErrors.hospitalName}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl required fullWidth error={!!validationErrors.requiredBloodGroup}>
                      <InputLabel>Required Blood Group</InputLabel>
                      <Select
                        value={recipientData.requiredBloodGroup}
                        onChange={(e) => setRecipientData({...recipientData, requiredBloodGroup: e.target.value})}
                        label="Required Blood Group"
                      >
                        {bloodGroups.map(group => (
                          <MenuItem key={group} value={group}>
                            <Chip label={group} sx={{ bgcolor: '#d32f2f', color: 'white' }} />
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.requiredBloodGroup && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {validationErrors.requiredBloodGroup}
                        </Typography>
                      )}
                    </FormControl>
                    <TextField
                      label="Contact Number"
                      value={recipientData.contactNumber}
                      onChange={(e) => setRecipientData({...recipientData, contactNumber: e.target.value})}
                      required
                      fullWidth
                      error={!!validationErrors.contactNumber}
                      helperText={validationErrors.contactNumber}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      bgcolor: '#d32f2f', 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#b71c1c' }
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Register as Recipient'}
                  </Button>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                By creating an account, you agree to our{' '}
                <Link to="#" style={{ color: '#d32f2f' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" style={{ color: '#d32f2f' }}>Privacy Policy</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}