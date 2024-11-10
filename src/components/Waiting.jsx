// src/GameStarting.jsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

function Waiting({content}) {
    
    return (
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 4,
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: 3,
                    width: '300px',
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
                    {content}
                </Typography>
                <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            </Box>
        </div>
    );
}

export default Waiting;
