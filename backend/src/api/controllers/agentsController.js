const mockAgents = [
    {
        id: 'agent-1',
        name: 'Customer Support Bot',
        description: 'Handles common customer inquiries and redirects complex issues.',
        status: 'active',
        model: 'GPT-3.5-turbo',
        capabilities: ['text-generation', 'information-retrieval', 'sentiment-analysis'],
        createdAt: new Date('2023-01-15T10:00:00Z'),
        updatedAt: new Date('2023-10-20T14:30:00Z')
    },
    {
        id: 'agent-2',
        name: 'Data Analyst Assistant',
        description: 'Assists in data analysis, generates reports, and visualizes data.',
        status: 'inactive',
        model: 'GPT-4',
        capabilities: ['data-analysis', 'report-generation', 'visualization', 'statistical-modeling'],
        createdAt: new Date('2023-03-01T11:00:00Z'),
        updatedAt: new Date('2023-09-01T09:00:00Z')
    },
    {
        id: 'agent-3',
        name: 'Code Reviewer',
        description: 'Provides automated code reviews and suggests improvements across multiple languages.',
        status: 'active',
        model: 'CodeLlama-70b',
        capabilities: ['code-analysis', 'suggestion-generation', 'refactoring-advice'],
        createdAt: new Date('2023-06-10T15:00:00Z'),
        updatedAt: new Date('2023-11-05T11:00:00Z')
    },
    {
        id: 'agent-4',
        name: 'Content Creator',
        description: 'Generates creative content for marketing, blogs, and social media.',
        status: 'active',
        model: 'Claude-2',
        capabilities: ['creative-writing', 'seo-optimization', 'topic-research'],
        createdAt: new Date('2023-08-20T09:00:00Z'),
        updatedAt: new Date('2023-11-10T16:00:00Z')
    }
];

// In a real application, this would typically import a service layer, e.g.:
// const agentsService = require('../../services/agentsService');
// For the purpose of generating this single file, we'll simulate the service layer directly.
const agentsService = {
    /**
     * Retrieves all AI agents.
     * @returns {Promise<Array>} A promise that resolves to an array of agent objects.
     */
    findAll: async () => {
        // Simulate an asynchronous database call or external API fetch
        return Promise.resolve(mockAgents);
    },

    /**
     * Retrieves a single AI agent by its ID.
     * @param {string} id The unique identifier of the agent.
     * @returns {Promise<Object|undefined>} A promise that resolves to the agent object if found, otherwise undefined.
     */
    findById: async (id) => {
        // Simulate an asynchronous database call or external API fetch
        return Promise.resolve(mockAgents.find(agent => agent.id === id));
    }
};

/**
 * Controller function to get a list of all AI agents.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getAllAgents = async (req, res) => {
    try {
        const agents = await agentsService.findAll();
        res.status(200).json(agents);
    } catch (error) {
        console.error('Error fetching all agents:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/**
 * Controller function to get detailed information for a single AI agent by ID.
 * @param {object} req - The Express request object, containing agent ID in params.
 * @param {object} res - The Express response object.
 */
const getAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await agentsService.findById(id);

        if (!agent) {
            return res.status(404).json({ message: `Agent with ID ${id} not found.` });
        }

        res.status(200).json(agent);
    } catch (error) {
        console.error(`Error fetching agent with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getAllAgents,
    getAgentById,
};