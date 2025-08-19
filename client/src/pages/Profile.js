import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Description as DocumentIcon,
  Forum as ForumIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Profile = ({ user, setUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      location: {
        city: user?.location?.city || '',
        province: user?.location?.province || ''
      }
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword
  } = useForm();

  const newPassword = watchPassword('newPassword');

  // Handle profile update
  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword(data);
      setPasswordMode(false);
      resetPassword();
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location
    });
    setEditMode(false);
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const userStats = [
    { label: 'Documents Downloaded', value: '12', icon: <DownloadIcon /> },
    { label: 'Forum Posts', value: '5', icon: <ForumIcon /> },
    { label: 'Documents Uploaded', value: '2', icon: <DocumentIcon /> },
    { label: 'Reputation Points', value: '45', icon: <BadgeIcon /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '3rem'
          }}
          src={user?.avatar}
        >
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </Avatar>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          @{user?.username}
        </Typography>
        <Chip
          label={user?.role === 'admin' ? 'Administrator' : 'Member'}
          color={user?.role === 'admin' ? 'secondary' : 'primary'}
          variant="outlined"
        />
      </Box>

      {/* User Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {userStats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 1 }}>
                {stat.icon}
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          variant="fullWidth"
        >
          <Tab label="Profile Information" />
          <Tab label="Security Settings" />
          <Tab label="Activity History" />
        </Tabs>
      </Paper>

      {/* Profile Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Personal Information
              </Typography>
              {!editMode ? (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  variant="outlined"
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={handleSubmit(onProfileSubmit)}
                    disabled={loading}
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <form onSubmit={handleSubmit(onProfileSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    disabled={!editMode}
                    {...register('firstName', {
                      required: 'First name is required'
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    disabled={!editMode}
                    {...register('lastName', {
                      required: 'Last name is required'
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    InputProps={{
                      startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    disabled={!editMode}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    disabled={!editMode}
                    {...register('location.city')}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Province"
                    disabled={!editMode}
                    {...register('location.province')}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" color="text.secondary">
              Member since: {new Date(user?.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Last login: {new Date(user?.lastLogin).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Settings Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Security Settings
            </Typography>

            {!passwordMode ? (
              <Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Keep your account secure by regularly updating your password.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setPasswordMode(true)}
                  startIcon={<EditIcon />}
                >
                  Change Password
                </Button>
              </Box>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required'
                      })}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: value => value === newPassword || 'Passwords do not match'
                      })}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        Update Password
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setPasswordMode(false);
                          resetPassword();
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Activity History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Downloads
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Birth Certificate Application Form"
                      secondary="Downloaded 2 days ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business Permit Application"
                      secondary="Downloaded 1 week ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tax Declaration Form"
                      secondary="Downloaded 2 weeks ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Forum Activity
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="How to apply for passport renewal?"
                      secondary="Posted 3 days ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business registration requirements"
                      secondary="Replied 1 week ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tax filing deadline reminder"
                      secondary="Posted 2 weeks ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default Profile;