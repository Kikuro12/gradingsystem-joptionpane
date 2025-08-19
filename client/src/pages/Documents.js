import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  InputAdornment,
  Pagination,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Description as DocumentIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    featured: searchParams.get('featured') === 'true'
  });
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch documents
  const fetchDocuments = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...filters
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === false) {
          delete params[key];
        }
      });

      const response = await apiService.documents.getAll(params);
      setDocuments(response.data.documents);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiService.documents.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments(pagination.page);
  }, [filters]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });

    if (pagination.page > 1) {
      params.set('page', pagination.page.toString());
    }

    setSearchParams(params);
  }, [filters, pagination.page, setSearchParams]);

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
    fetchDocuments(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle document download
  const handleDownload = async (document) => {
    try {
      const response = await apiService.documents.download(document._id);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.title}.${document.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Document downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  // Handle document preview
  const handlePreview = (document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: 'newest',
      featured: false
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'title', label: 'Alphabetical' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          📄 Document Center
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Free access to government forms, legal documents, and essential paperwork
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search documents..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleFilterChange('search', '')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Category Filter */}
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

          {/* Sort */}
          <Grid item xs={12} sm={6} md={2}>
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

          {/* Actions */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={filters.featured ? 'contained' : 'outlined'}
                startIcon={<StarIcon />}
                onClick={() => handleFilterChange('featured', !filters.featured)}
                size="small"
              >
                Featured
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {loading ? 'Loading...' : `${pagination.total} documents found`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page {pagination.page} of {pagination.totalPages}
        </Typography>
      </Box>

      {/* Documents Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : documents.length === 0 ? (
        <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search terms or filters
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={document._id}>
              <Card
                className="document-card hover-card"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Chip
                      label={document.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {document.isFeatured && (
                      <StarIcon color="warning" fontSize="small" />
                    )}
                  </Box>

                  {/* Title */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {document.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {document.description.substring(0, 100)}
                    {document.description.length > 100 && '...'}
                  </Typography>

                  {/* Tags */}
                  {document.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {document.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DownloadIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {document.downloadCount}
                      </Typography>
                    </Box>
                    <Chip
                      label={document.fileType.toUpperCase()}
                      size="small"
                      color="secondary"
                      variant="filled"
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handlePreview(document)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(document)}
                    variant="contained"
                    sx={{ ml: 'auto' }}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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

      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DocumentIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {selectedDocument.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedDocument.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Category:
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    File Type:
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.fileType.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Downloads:
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.downloadCount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Uploaded by:
                  </Typography>
                  <Typography variant="body2">
                    {selectedDocument.uploadedBy?.firstName} {selectedDocument.uploadedBy?.lastName}
                  </Typography>
                </Grid>
              </Grid>

              {selectedDocument.tags.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedDocument.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  handleDownload(selectedDocument);
                  setPreviewOpen(false);
                }}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Documents;