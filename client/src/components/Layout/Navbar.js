import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Description as DocumentIcon,
  Cloud as WeatherIcon,
  Map as MapIcon,
  Forum as ForumIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleMenuClose();
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Documents', icon: <DocumentIcon />, path: '/documents' },
    { text: 'Weather', icon: <WeatherIcon />, path: '/weather' },
    { text: 'Maps', icon: <MapIcon />, path: '/maps' },
    { text: 'Forum', icon: <ForumIcon />, path: '/forum' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          color: 'white'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Kiur Hub
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '20',
                borderRight: `3px solid ${theme.palette.primary.main}`
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {user ? (
          <>
            <ListItem button onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            {user.role === 'admin' && (
              <ListItem button onClick={() => handleNavigation('/admin')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItem>
            )}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemIcon>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: isMobile ? 1 : 0,
              fontWeight: 'bold',
              cursor: 'pointer',
              mr: isMobile ? 0 : 4
            }}
            onClick={() => handleNavigation('/')}
          >
            🇵🇭 Kiur Hub
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    textDecoration: location.pathname === item.path ? 'underline' : 'none'
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}
                      src={user.avatar}
                    >
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => handleNavigation('/login')}>
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => handleNavigation('/register')}
                    sx={{ 
                      borderColor: 'white',
                      '&:hover': { 
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleNavigation('/profile')}>
          <PersonIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={() => handleNavigation('/admin')}>
            <DashboardIcon sx={{ mr: 1 }} />
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;