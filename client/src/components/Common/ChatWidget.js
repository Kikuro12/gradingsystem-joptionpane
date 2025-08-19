import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Fab,
  Collapse,
  List,
  ListItem,
  Badge,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Support as SupportIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import authService from '../../services/authService';
import apiService from '../../services/apiService';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket connection and user
  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (authService.isLoggedIn()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);

          // Initialize socket connection
          const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
            auth: {
              token: authService.getToken()
            }
          });

          newSocket.on('connect', () => {
            console.log('Connected to chat server');
            newSocket.emit('join-chat', userData._id);
          });

          newSocket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
            if (!open && message.sender !== userData._id) {
              setUnreadCount(prev => prev + 1);
            }
          });

          newSocket.on('disconnect', () => {
            console.log('Disconnected from chat server');
          });

          setSocket(newSocket);

          // Load recent messages
          loadMessages();
        }
      } catch (error) {
        console.error('Chat initialization error:', error);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Load chat messages
  const loadMessages = async () => {
    try {
      const response = await apiService.chat.getMessages({ limit: 50 });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear unread count when chat is opened
  useEffect(() => {
    if (open) {
      setUnreadCount(0);
    }
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || loading) return;

    setLoading(true);
    try {
      await apiService.chat.sendMessage({ message: newMessage.trim() });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (message) => {
    if (message.sender === user?._id) {
      return {
        backgroundColor: '#1976d2',
        color: 'white',
        marginLeft: 'auto',
        borderRadius: '18px 18px 4px 18px'
      };
    } else if (message.type === 'admin') {
      return {
        backgroundColor: '#dc004e',
        color: 'white',
        marginRight: 'auto',
        borderRadius: '18px 18px 18px 4px'
      };
    } else {
      return {
        backgroundColor: '#f5f5f5',
        color: '#333',
        marginRight: 'auto',
        borderRadius: '18px 18px 18px 4px'
      };
    }
  };

  if (!user) {
    return null; // Don't show chat widget for non-authenticated users
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300
      }}
    >
      {/* Chat Window */}
      <Collapse in={open}>
        <Paper
          elevation={8}
          sx={{
            width: 350,
            height: 500,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupportIcon />
              <Typography variant="h6" fontWeight="bold">
                Live Support
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 1,
              backgroundColor: '#fafafa'
            }}
          >
            <List dense>
              {messages.length === 0 ? (
                <ListItem>
                  <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                    <SupportIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Welcome to Kiur Hub support! How can we help you today?
                    </Typography>
                  </Box>
                </ListItem>
              ) : (
                messages.map((message, index) => (
                  <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'stretch', py: 0.5 }}>
                    <Box
                      sx={{
                        ...getMessageStyle(message),
                        p: 1.5,
                        maxWidth: '80%',
                        wordBreak: 'break-word'
                      }}
                    >
                      {message.sender !== user._id && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Avatar sx={{ width: 20, height: 20, fontSize: '0.75rem' }}>
                            {message.type === 'admin' ? 'A' : 'U'}
                          </Avatar>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {message.senderName || 'Support'}
                          </Typography>
                          {message.type === 'admin' && (
                            <Chip
                              label="Admin"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.6rem',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'inherit'
                              }}
                            />
                          )}
                        </Box>
                      )}
                      <Typography variant="body2">
                        {message.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          opacity: 0.7,
                          mt: 0.5
                        }}
                      >
                        {formatTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Message Input */}
          <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                size="small"
                multiline
                maxRows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || loading}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabled'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Press Enter to send, Shift+Enter for new line
            </Typography>
          </Box>
        </Paper>
      </Collapse>

      {/* Chat Toggle Button */}
      <Badge badgeContent={unreadCount} color="error" max={99}>
        <Fab
          color="primary"
          onClick={() => setOpen(!open)}
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)'
            }
          }}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Badge>
    </Box>
  );
};

export default ChatWidget;