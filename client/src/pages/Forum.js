import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Forum as ForumIcon,
  Add as AddIcon,
  Reply as ReplyIcon,
  ThumbUp as LikeIcon,
  Visibility as ViewIcon,
  PushPin as PinIcon,
  Lock as LockIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import authService from '../services/authService';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'lastActivity',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isLoggedIn()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  // Fetch forum posts
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...filters
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiService.forum.getPosts(params);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiService.forum.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(pagination.page);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle post click
  const handlePostClick = (postId) => {
    navigate(`/forum/posts/${postId}`);
  };

  // Handle create post
  const handleCreatePost = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/forum/create');
  };

  const sortOptions = [
    { value: 'lastActivity', label: 'Latest Activity' },
    { value: 'newest', label: 'Newest Posts' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'replies', label: 'Most Replies' }
  ];

  if (loading && posts.length === 0) {
    return <LoadingSpinner message="Loading forum posts..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          💬 Community Forum
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Connect, discuss, and share knowledge with fellow Filipinos
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreatePost}
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            fontWeight: 'bold',
            px: 4,
            py: 1.5
          }}
        >
          Create New Post
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search discussions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category._id} ({category.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort}
                label="Sort By"
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {pagination.total} posts found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Forum Posts */}
      {posts.length === 0 ? (
        <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No posts found
          </Typography>
          <Typography variant="body2">
            Be the first to start a discussion in this category!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{ mt: 2 }}
          >
            Create First Post
          </Button>
        </Alert>
      ) : (
        <Box>
          {posts.map((post) => (
            <Card
              key={post._id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: post.isPinned ? '4px solid #ffc107' : '4px solid transparent',
                opacity: post.isLocked ? 0.7 : 1,
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                }
              }}
              onClick={() => handlePostClick(post._id)}
              className="forum-post"
            >
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {/* Author Avatar */}
                  <Grid item xs="auto">
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48
                      }}
                    >
                      {post.author.firstName?.charAt(0)}{post.author.lastName?.charAt(0)}
                    </Avatar>
                  </Grid>

                  {/* Post Content */}
                  <Grid item xs>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {post.isPinned && (
                        <Tooltip title="Pinned Post">
                          <PinIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                      {post.isLocked && (
                        <Tooltip title="Locked Post">
                          <LockIcon color="action" fontSize="small" />
                        </Tooltip>
                      )}
                      <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                        {post.title}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.content.substring(0, 200)}
                      {post.content.length > 200 && '...'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip label={post.category} size="small" color="primary" />
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          by <strong>{post.author.firstName} {post.author.lastName}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ReplyIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.replies.length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LikeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.likes.length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.views}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Forum Guidelines */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Forum Guidelines
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              • Be respectful and courteous to all members
            </Typography>
            <Typography variant="body2" paragraph>
              • Use clear, descriptive titles for your posts
            </Typography>
            <Typography variant="body2" paragraph>
              • Search existing posts before creating new ones
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              • Stay on topic and provide helpful information
            </Typography>
            <Typography variant="body2" paragraph>
              • No spam, advertising, or inappropriate content
            </Typography>
            <Typography variant="body2" paragraph>
              • Help maintain a positive community environment
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Forum;