import React from 'react';
import {
  Box, Container, Typography, Link, Divider, IconButton
} from '@mui/material';
import {
  Bloodtype, Phone, Email, LocationOn, Facebook, Twitter, Instagram, LinkedIn
} from '@mui/icons-material';

export default function Footer() {
  return (
    <Box sx={{ 
      bgcolor: '#1e293b', 
      color: 'white', 
      mt: 'auto',
      pt: 4,
      pb: 2
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Brand Section */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50% 50% 50% 0',
                bgcolor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                transform: 'rotate(-45deg)'
              }}>
                <Bloodtype sx={{ color: 'white', transform: 'rotate(45deg)', fontSize: 16 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                BloodConnect
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
              Connecting lives through blood donation. Our platform bridges the gap between donors and recipients, 
              making blood donation more accessible and efficient.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#3b82f6' } }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#06b6d4' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#ec4899' } }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#0ea5e9' } }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                About Us
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                How It Works
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                Blood Banks
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                Success Stories
              </Link>
            </Box>
          </Box>

          {/* Support */}
          <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                Help Center
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                FAQs
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                Contact Us
              </Link>
              <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Emergency: +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 16, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  support@bloodconnect.org
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  123 Healthcare Ave, Medical District
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: '#334155', 
              borderRadius: 2,
              border: '1px solid #475569'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f59e0b', mb: 1 }}>
                24/7 Emergency Support
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                For urgent blood requirements, call our emergency hotline available round the clock.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#475569' }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © 2024 BloodConnect. All rights reserved. | Saving lives, one donation at a time.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}