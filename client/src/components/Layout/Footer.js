import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: 'white',
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🇵🇭 Kiur Hub
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Your trusted source for free downloadable and printable government and personal documents. 
              Serving the Filipino community with easy access to essential forms and documents.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Home
              </Link>
              <Link href="/documents" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Documents
              </Link>
              <Link href="/weather" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Weather
              </Link>
              <Link href="/maps" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Maps
              </Link>
              <Link href="/forum" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Forum
              </Link>
            </Box>
          </Grid>

          {/* Document Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Popular Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/documents?category=Government Forms" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Government Forms
              </Link>
              <Link href="/documents?category=Legal Documents" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Legal Documents
              </Link>
              <Link href="/documents?category=Business Forms" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Business Forms
              </Link>
              <Link href="/documents?category=Educational Documents" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Educational Documents
              </Link>
              <Link href="/documents?category=Health Forms" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Health Forms
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  support@kiurhub.ph
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  +63 (02) 1234-5678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  Metro Manila, Philippines
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {currentYear} Kiur Hub. All rights reserved. Created by{' '}
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ fontWeight: 'bold' }}
            >
              Marwen Deiparine
            </Link>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.9 }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.9 }}>
              Terms of Service
            </Link>
            <Link href="/help" color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.9 }}>
              Help
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;