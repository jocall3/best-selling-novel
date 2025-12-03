import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Assume AgentProfileCard component exists at this path
// It should accept an 'agent' prop and display its details.
import AgentProfileCard from '../components/AgentProfileCard';

// --- Dummy Data Generation ---
const generateDummyAgents = (count) => {
  const agents = [];
  const designations = ['Strategic Planner', 'Data Analyst', 'Creative Designer', 'Operations Manager', 'Customer Support', 'Security Specialist', 'Research Scientist', 'Logistics Coordinator', 'Financial Advisor', 'Marketing Strategist'];
  const personalityTraits = ['Analytical', 'Visionary', 'Calm', 'Empathetic', 'Innovative', 'Efficient', 'Protective', 'Curious', 'Adaptable', 'Decisive', 'Collaborative', 'Independent', 'Detail-Oriented', 'Problem-Solver'];
  const avatarColors = ['FF5733', '33FF57', '5733FF', 'FF33A1', '33A1FF', 'A1FF33', 'FF8C00', '00CED1', '8A2BE2', 'DC143C'];

  for (let i = 1; i <= count; i++) {
    const randomDesignation = designations[Math.floor(Math.random() * designations.length)];
    const numTraits = Math.floor(Math.random() * 3) + 1; // 1 to 3 traits
    const randomTraits = Array.from({ length: numTraits }, () =>
      personalityTraits[Math.floor(Math.random() * personalityTraits.length)]
    );
    const uniqueTraits = [...new Set(randomTraits)]; // Ensure unique traits
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const namePrefix = String.fromCharCode(64 + Math.ceil(i / 26)); // A, B, C...
    const nameSuffix = i % 26 === 0 ? 26 : i % 26;
    const name = `Agent ${namePrefix}${nameSuffix}`;

    agents.push({
      id: `agent-${i}`,
      name: name,
      designation: randomDesignation,
      personalityTraits: uniqueTraits,
      avatarUrl: `https://via.placeholder.com/150/${randomColor}/FFFFFF?text=${name.split(' ').map(n => n[0]).join('')}`,
      description: `Agent ${name} is a highly skilled ${randomDesignation} known for its ${uniqueTraits.join(', ').toLowerCase()} nature. It excels at various tasks, contributing significantly to team objectives and adapting to new challenges.`,
    });
  }
  return agents;
};

const ALL_AGENTS_DATA = generateDummyAgents(120); // Generate 120 agents

// Extract unique traits and designations for filter options
const uniqueTraits = [...new Set(ALL_AGENTS_DATA.flatMap(agent => agent.personalityTraits))].sort();
const uniqueDesignations = [...new Set(ALL_AGENTS_DATA.map(agent => agent.designation))].sort();

const AgentsListPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrait, setSelectedTrait] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'designation'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 12; // Display 12 agents per page

  useEffect(() => {
    // Simulate fetching data from an API
    setLoading(true);
    const timer = setTimeout(() => {
      setAgents(ALL_AGENTS_DATA);
      setLoading(false);
    }, 700); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents;

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          agent.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          agent.designation.toLowerCase().includes(lowerCaseSearchTerm) ||
          agent.personalityTraits.some(trait => trait.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // 2. Personality Trait Filter
    if (selectedTrait) {
      filtered = filtered.filter((agent) =>
        agent.personalityTraits.includes(selectedTrait)
      );
    }

    // 3. Designation Filter
    if (selectedDesignation) {
      filtered = filtered.filter((agent) =>
        agent.designation === selectedDesignation
      );
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'designation') {
        valA = a.designation.toLowerCase();
        valB = b.designation.toLowerCase();
      } else {
        // Default to name sort if sortBy is invalid
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [agents, searchTerm, selectedTrait, selectedDesignation, sortBy, sortOrder]);

  // Pagination Logic
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAndSortedAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPages = Math.ceil(filteredAndSortedAgents.length / agentsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of the page when pagination changes for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset current page to 1 whenever filters or sort order change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTrait, selectedDesignation, sortBy, sortOrder]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        AI Agent Gallery
      </Typography>
      <Typography variant="h6" component="p" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
        Explore our diverse collection of AI agents. Use the filters and search bar to find agents by personality, designation, or name.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        {/* Search Bar */}
        <TextField
          label="Search Agents"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200, flexGrow: 1 }}
        />

        {/* Personality Trait Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
          <InputLabel>Personality Trait</InputLabel>
          <Select
            value={selectedTrait}
            onChange={(e) => setSelectedTrait(e.target.value)}
            label="Personality Trait"
          >
            <MenuItem value="">
              <em>All Traits</em>
            </MenuItem>
            {uniqueTraits.map((trait) => (
              <MenuItem key={trait} value={trait}>
                {trait}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Designation Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
          <InputLabel>Designation</InputLabel>
          <Select
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.target.value)}
            label="Designation"
          >
            <MenuItem value="">
              <em>All Designations</em>
            </MenuItem>
            {uniqueDesignations.map((designation) => (
              <MenuItem key={designation} value={designation}>
                {designation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="designation">Designation</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Order Toggle */}
        <ToggleButtonGroup
          value={sortOrder}
          exclusive
          onChange={(event, newOrder) => {
            if (newOrder !== null) { // Prevent unselecting
              setSortOrder(newOrder);
            }
          }}
          aria-label="sort order"
          color="primary"
          sx={{ height: '56px' }} // Match height of other form controls
        >
          <ToggleButton value="asc" aria-label="sort ascending">
            <ArrowUpwardIcon sx={{ mr: 0.5 }} /> ASC
          </ToggleButton>
          <ToggleButton value="desc" aria-label="sort descending">
            <ArrowDownwardIcon sx={{ mr: 0.5 }} /> DESC
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {currentAgents.length === 0 ? (
            <Typography variant="h5" color="text.secondary" align="center" sx={{ mt: 8 }}>
              No agents found matching your criteria. Try adjusting your filters.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {currentAgents.map((agent) => (
                <Grid item key={agent.id} xs={12} sm={6} md={4} lg={3}>
                  <AgentProfileCard agent={agent} />
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default AgentsListPage;