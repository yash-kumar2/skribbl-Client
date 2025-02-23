// src/WordSelection.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

function WordSelection({ words, ms, onWordChosen }) {
    const [timeLeft, setTimeLeft] = useState(ms / 1000);

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        //onWordChosen(words[0])

        return () => clearInterval(timer);
    }, [ms]);

    const handleWordClick = (word) => {
        onWordChosen(word);
    };

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
                    width: '350px',
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
                    Choose the word to draw
                </Typography>
                
                {/* Display words as selectable buttons */}
                <Box display="flex" flexDirection="column" gap={1} sx={{ mb: 3 }}>
                    {words.map((word, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            onClick={() => handleWordClick(word)}
                            sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                        >
                            {word}
                        </Button>
                    ))}
                </Box>
                
                {/* Countdown timer */}
                <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress
                        size={60}
                        variant="determinate"
                        value={(timeLeft / (ms / 1000)) * 100}
                        sx={{ color: 'primary.main' }}
                    />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        {timeLeft}s
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default WordSelection;
