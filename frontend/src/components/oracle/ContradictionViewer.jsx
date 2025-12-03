import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Shuffle as ShuffleIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// --- Mock Data Structure ---
// In a real application, this data would come from a store or API.
const generateMockContradictions = (count = 100) => {
  const baseStatements = [
    "The primary cause was economic instability.",
    "The event was triggered by a single, unforeseen technical failure.",
    "Human error was the decisive factor.",
    "The system was inherently robust but poorly maintained.",
    "The solution requires decentralized governance.",
    "Centralized control is the only viable path forward.",
    "The timeline suggests a long-term buildup.",
    "It happened suddenly, without warning.",
  ];

  const mockData = [];
  for (let i = 1; i <= count; i++) {
    const statementIndex = i % baseStatements.length;
    const contradictionIndex = (i + 1) % baseStatements.length;
    
    mockData.push({
      id: `C-${i}`,
      statement: baseStatements[statementIndex],
      contradictoryStatement: baseStatements[contradictionIndex],
      sourceAI: `AI_Model_${Math.floor(Math.random() * 5) + 1}`,
      confidenceScore: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)), // Score between 0.6 and 1.0
      relevance: Math.floor(Math.random() * 100) + 1,
    });
  }
  return mockData;
};

const MOCK_CONTRADICTIONS = generateMockContradictions(100);

// --- Utility Components ---

/**
 * Represents a single node in the constellation/flowchart view.
 */
const ContradictionNode = React.memo(({ contradiction, onClick, isSelected }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { statement, sourceAI, confidenceScore } = contradiction;

  const handleClick = useCallback(() => {
    onClick(contradiction);
  }, [onClick, contradiction]);

  return (
    <Paper
      elevation={isSelected ? 6 : 2}
      sx={{
        p: 1.5,
        m: 0.5,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0,0,0,0.1)',
        backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.background.paper,
        boxShadow: isSelected ? `0 0 15px ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 4,
        },
        minHeight: isMobile ? '60px' : '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onClick={handleClick}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 0.5 }}>
        {sourceAI}
      </Typography>
      <Typography variant="body2" sx={{ 
        fontSize: isMobile ? '0.75rem' : '0.8rem', 
        lineHeight: 1.3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {statement}
      </Typography>
      <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip 
          label={`Conf: ${(confidenceScore * 100).toFixed(0)}%`} 
          size="small" 
          color={confidenceScore > 0.8 ? 'success' : confidenceScore > 0.7 ? 'warning' : 'error'}
        />
      </Box>
    </Paper>
  );
});

/**
 * Detailed view for the selected contradiction pair.
 */
const DetailPanel = ({ selected, onClose }) => {
  const theme = useTheme();

  if (!selected) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <LightbulbIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select a Node to View Details
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Click on any colored node in the visualization to explore the conflicting statements and their metadata.
        </Typography>
      </Paper>
    );
  }

  const { statement, contradictoryStatement, sourceAI, confidenceScore, relevance } = selected;

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', position: 'relative', backgroundColor: theme.palette.common.white }}>
      <IconButton 
        onClick={onClose} 
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
        size="small"
      >
        <CloseIcon />
      </IconButton>
      
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.dark }}>
        Contradiction Pair #{selected.id.split('-')[1]}
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">Source AI:</Typography>
          <Typography variant="h6">{sourceAI}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: `4px solid ${theme.palette.error.main}`, pl: 2, py: 1, mb: 2 }}>
            <Typography variant="subtitle1" color="error.main">Statement A (The Selected Node)</Typography>
            <Typography variant="body1">{statement}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: `4px solid ${theme.palette.warning.main}`, pl: 2, py: 1, mb: 2 }}>
            <Typography variant="subtitle1" color="warning.main">Statement B (The Contradiction)</Typography>
            <Typography variant="body1">{contradictoryStatement}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: theme.palette.success.lightest }}>
            <Typography variant="caption" color="text.secondary">Confidence</Typography>
            <Typography variant="h5" color="success.dark">{(confidenceScore * 100).toFixed(1)}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: theme.palette.info.lightest }}>
            <Typography variant="caption" color="text.secondary">Relevance Score</Typography>
            <Typography variant="h5" color="info.dark">{relevance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: theme.palette.grey[100] }}>
            <Typography variant="caption" color="text.secondary">ID</Typography>
            <Typography variant="h6" color="text.primary">{selected.id}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Analysis Context</Typography>
        <Typography variant="body2" color="text.secondary">
          This view highlights the core conflict identified by the Oracle system. The visualization attempts to map these conflicts based on semantic similarity (not shown here), grouping related disagreements.
        </Typography>
      </Box>
    </Paper>
  );
};


// --- Main Component ---

const ContradictionViewer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [data, setData] = useState(MOCK_CONTRADICTIONS);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('constellation'); // 'constellation' or 'flowchart'
  const [sortKey, setSortKey] = useState('relevance');

  const handleNodeClick = useCallback((node) => {
    // If the same node is clicked, deselect it (useful for closing detail panel)
    if (selectedNode && selectedNode.id === node.id) {
        setSelectedNode(null);
    } else {
        setSelectedNode(node);
    }
  }, [selectedNode]);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleShuffle = useCallback(() => {
    setData(prevData => [...prevData].sort(() => 0.5 - Math.random()));
    setSelectedNode(null);
  }, []);

  // Sorting logic
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortKey === 'relevance') {
        return b.relevance - a.relevance;
      }
      if (sortKey === 'confidence') {
        return b.confidenceScore - a.confidenceScore;
      }
      return 0;
    });
  }, [data, sortKey]);

  // --- Visualization Rendering Logic ---

  const renderConstellation = () => {
    const nodesPerRow = isMobile ? 3 : 5;
    
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {sortedData.map((item, index) => (
            <Grid item xs={12 / nodesPerRow} key={item.id}>
              <ContradictionNode
                contradiction={item}
                onClick={handleNodeClick}
                isSelected={selectedNode && selectedNode.id === item.id}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderFlowchart = () => {
    // For simplicity in this mock, we'll render a simplified vertical list/flow
    // A true flowchart would require a library like React Flow or D3.
    return (
      <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Flow Visualization (Simplified)</Typography>
        {sortedData.slice(0, 20).map((item, index) => (
          <Box key={item.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContradictionNode
                contradiction={item}
                onClick={handleNodeClick}
                isSelected={selectedNode && selectedNode.id === item.id}
              />
              {index < 19 && (
                <Box sx={{ 
                  width: 2, 
                  height: 40, 
                  backgroundColor: theme.palette.divider, 
                  mx: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center'
                }}>
                    <LightbulbIcon sx={{ fontSize: 16, color: theme.palette.grey[500] }} />
                </Box>
              )}
            </Box>
            {index < 19 && (
                <Box sx={{ ml: 4, borderLeft: `1px dashed ${theme.palette.divider}`, pl: 2 }}>
                    <Typography variant="caption" color="text.secondary">Leads to next potential conflict cluster...</Typography>
                </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderVisualization = () => {
    switch (viewMode) {
      case 'flowchart':
        return renderFlowchart();
      case 'constellation':
      default:
        return renderConstellation();
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: theme.palette.grey[50] }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Oracle Contradiction Viewer ({data.length} Conflicts)
      </Typography>

      {/* Controls Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        
        <Tooltip title="Randomize Node Layout">
          <IconButton onClick={handleShuffle} color="primary" variant="outlined">
            <ShuffleIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="body2" color="text.secondary">Sort By:</Typography>
        {['relevance', 'confidence'].map(key => (
          <Chip
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            color={sortKey === key ? 'primary' : 'default'}
            onClick={() => setSortKey(key)}
            clickable
            size="small"
          />
        ))}

        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>View Mode:</Typography>
        {['constellation', 'flowchart'].map(mode => (
          <Chip
            key={mode}
            label={mode.charAt(0).toUpperCase() + mode.slice(1)}
            color={viewMode === mode ? 'secondary' : 'default'}
            onClick={() => setViewMode(mode)}
            clickable
            size="small"
          />
        ))}

        <Tooltip title="Information about the visualization">
            <IconButton color="info" size="small">
                <InfoIcon />
            </IconButton>
        </Tooltip>
      </Paper>

      {/* Main Layout: Visualization Area and Detail Panel */}
      <Grid container spacing={3}>
        
        {/* Visualization Area */}
        <Grid item xs={12} md={selectedNode ? 8 : 12}>
          <Paper 
            elevation={2} 
            sx={{ 
              minHeight: isMobile ? '400px' : '600px', 
              p: 1, 
              backgroundColor: theme.palette.background.paper,
              overflow: 'auto',
            }}
          >
            {renderVisualization()}
          </Paper>
        </Grid>

        {/* Detail Panel */}
        {selectedNode && (
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: theme.spacing(3) }}>
              <DetailPanel 
                selected={selectedNode} 
                onClose={handleCloseDetails} 
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ContradictionViewer;