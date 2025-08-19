import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DocumentIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  PushPin as PinIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, documentsRes, postsRes] = await Promise.all([
        apiService.admin.getDashboard(),
        apiService.admin.getPendingDocuments({ limit: 5 }),
        apiService.admin.getForumPosts({ limit: 5 })
      ]);

      setDashboardData(dashboardRes.data);
      setPendingDocuments(documentsRes.data.documents);
      setRecentPosts(postsRes.data.posts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle document approval
  const handleDocumentApproval = async (documentId, status, reason = '') => {
    try {
      await apiService.admin.approveDocument(documentId, {
        approvalStatus: status,
        rejectionReason: reason
      });
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again.
        </Alert>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers,
      icon: <PeopleIcon />,
      color: '#1976d2'
    },
    {
      title: 'Documents',
      value: dashboardData.stats.totalDocuments,
      icon: <DocumentIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Pending Approval',
      value: dashboardData.stats.pendingDocuments,
      icon: <TrendingIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Forum Posts',
      value: dashboardData.stats.totalPosts,
      icon: <ForumIcon />,
      color: '#9c27b0'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          🛡️ Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage Kiur Hub platform and monitor system activity
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}88 100%)`,
                color: 'white',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body1">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Pending Documents" />
          <Tab label="Recent Posts" />
          <Tab label="User Management" />
          <Tab label="System Stats" />
        </Tabs>
      </Paper>

      {/* Pending Documents Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Documents Pending Approval
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/documents')}
              >
                View All
              </Button>
            </Box>

            {pendingDocuments.length === 0 ? (
              <Alert severity="info">
                No documents pending approval
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Uploaded By</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingDocuments.map((doc) => (
                      <TableRow key={doc._id}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {doc.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doc.description.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={doc.category} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<ViewIcon />}
                              onClick={() => navigate(`/documents/${doc._id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              color="success"
                              startIcon={<ApproveIcon />}
                              onClick={() => handleDocumentApproval(doc._id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<RejectIcon />}
                              onClick={() => handleDocumentApproval(doc._id, 'rejected', 'Quality issues')}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Recent Posts Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Forum Posts
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/forum')}
              >
                Manage Forum
              </Button>
            </Box>

            <List>
              {recentPosts.map((post) => (
                <ListItem
                  key={post._id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    <Avatar>
                      {post.author.firstName?.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {post.isPinned && <PinIcon color="warning" fontSize="small" />}
                        {post.isLocked && <LockIcon color="action" fontSize="small" />}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.title}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          by {post.author.firstName} {post.author.lastName} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={post.category} size="small" />
                          <Chip label={`${post.replies.length} replies`} size="small" variant="outlined" />
                          <Chip label={`${post.likes.length} likes`} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/forum/posts/${post._id}`)}
                    >
                      View
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* User Management Tab */}
      <TabPanel value={tabValue} index={2}>
        <Alert severity="info" sx={{ mb: 2 }}>
          User management features will be available in the full admin panel.
        </Alert>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              User Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {dashboardData.stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {dashboardData.stats.recentUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New This Week
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    85%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admins
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* System Stats Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Document Categories
                </Typography>
                {dashboardData.topCategories.map((category, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {category._id}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {category.count} docs ({category.downloads} downloads)
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Monthly Statistics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    Total Downloads This Month:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboardData.stats.monthlyDownloads}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    New Users This Month:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboardData.stats.recentUsers}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    Forum Posts This Month:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboardData.stats.totalPosts}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    Chat Messages:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboardData.stats.totalMessages}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default AdminDashboard;