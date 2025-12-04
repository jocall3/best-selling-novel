import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, Divider, CircularProgress, Chip, Avatar, Grid } from '@mui/material';

const API_BASE_URL = '/api'; // Assuming relative path for API calls

const DebateChamberPage = () => {
    const { debateId } = useParams();
    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDebate = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/debates/${debateId}`);
                setDebate(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching debate:", err);
                setError("Failed to load debate details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDebate();
    }, [debateId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading Debate Chamber...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, color: 'error.main' }}>
                <Typography variant="h5">Error</Typography>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    if (!debate) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5">Debate Not Found</Typography>
            </Box>
        );
    }

    // Helper component for individual debate turns/messages
    const DebateTurn = ({ turn, index }) => {
        const isPro = turn.speaker === 'AI_Proponent';
        const speakerName = isPro ? 'AI Proponent' : 'AI Opponent';
        const avatarColor = isPro ? 'primary.main' : 'secondary.main';
        const alignment = isPro ? 'flex-start' : 'flex-end';

        return (
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: alignment }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    {!isPro && (
                        <Avatar sx={{ bgcolor: avatarColor, width: 24, height: 24, mr: 1, fontSize: '0.875rem' }}>
                            {speakerName[0]}
                        </Avatar>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {speakerName}
                    </Typography>
                    {isPro && (
                        <Avatar sx={{ bgcolor: avatarColor, width: 24, height: 24, ml: 1, fontSize: '0.875rem' }}>
                            {speakerName[0]}
                        </Avatar>
                    )}
                </Box>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: isPro ? 'grey.50' : 'lightblue',
                        borderRadius: isPro ? '0 15px 15px 15px' : '15px 0 15px 15px',
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="body1">{turn.content}</Typography>
                    {turn.reasoning && (
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ccc' }}>
                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                Reasoning: {turn.reasoning}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
            <Typography variant="h3" gutterBottom>
                Debate Chamber: {debate.topic}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" color="text.secondary">Topic</Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>{debate.topic}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" color="text.secondary">Resolution</Typography>
                        <Typography variant="h5" sx={{ mt: 0.5 }}>
                            {debate.resolution_affirmed ? 'Affirmed' : 'Negated'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" color="text.secondary">Status</Typography>
                        <Chip
                            label={debate.status}
                            color={debate.status === 'Completed' ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{ mt: 0.5, fontSize: '1rem' }}
                        />
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h4" gutterBottom>Debate Transcript</Typography>

            <Paper elevation={2} sx={{ p: 3, minHeight: 500, border: '1px solid #ddd' }}>
                {debate.transcript && debate.transcript.length > 0 ? (
                    debate.transcript.map((turn, index) => (
                        <DebateTurn key={index} turn={turn} index={index} />
                    ))
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 5 }}>
                        No dialogue recorded for this debate yet.
                    </Typography>
                )}
            </Paper>

            {debate.status === 'Completed' && debate.summary && (
                <Box sx={{ mt: 4, p: 3, bgcolor: 'background.neutral', borderRadius: 2, borderLeft: '5px solid #4CAF50' }}>
                    <Typography variant="h5" gutterBottom color="green">Debate Summary & Conclusion</Typography>
                    <Typography variant="body1">{debate.summary}</Typography>
                </Box>
            )}

        </Box>
    );
};

export default DebateChamberPage;