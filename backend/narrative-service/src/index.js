const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is not set

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Placeholder for narrative generation logic
// In a real application, this would likely be in a separate service layer or module
const generateNarrative = async ({ topic, length, style, complexity }) => {
    // This function would integrate with AI models (e.g., GPT, custom NLP)
    // to generate narrative content based on the provided parameters.
    // For this boilerplate, we'll return a simple mock response.

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    const generatedContent = `
        <h3>A ${length || 'medium'} narrative on "${topic || 'an unspecified subject'}"</h3>
        <p>In a ${style || 'neutral'} style with ${complexity || 'standard'} complexity:</p>
        <p>Once upon a time, in a digital realm far beyond human comprehension, a powerful narrative engine hummed to life. Its purpose: to weave tales, long and short, simple and intricate, on any topic imaginable.</p>
        <p>Today, its focus was on "${topic || 'the art of storytelling'}". With data points gathered and creative algorithms engaged, it began to craft a compelling story.</p>
        <p>Imagine a protagonist, perhaps a lone explorer in a forgotten galaxy, or a humble librarian discovering an ancient secret. The narrative unfolded, paragraph by paragraph, building suspense, developing characters, and exploring themes related to the initial prompt.</p>
        <p>The story reached its climax, a moment of profound revelation or thrilling conflict, before gently guiding the reader towards a satisfying resolution. The engine, ever-vigilant, ensured the prose flowed beautifully, the descriptions were vivid, and the emotional arc resonated.</p>
        <p>And so, a new narrative was born, ready to captivate minds and ignite imaginations, proving that even in the age of machines, the magic of a good story endures.</p>
        <p>This is a ${length || 'medium'}-length example. For a real generation, the output would be much more detailed and dynamic.</p>
    `;
    return generatedContent;
};

// Routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Narrative Generation Service is running!',
        status: 'OK',
        endpoints: {
            generate: 'POST /api/narrative/generate'
        }
    });
});

app.post('/api/narrative/generate', async (req, res) => {
    const { topic, length, style, complexity } = req.body;

    if (!topic) {
        return res.status(400).send({ error: 'Validation Error', message: 'The "topic" parameter is required for narrative generation.' });
    }

    try {
        const narrative = await generateNarrative({ topic, length, style, complexity });
        res.status(200).send({
            status: 'success',
            narrative: narrative,
            metadata: {
                topic,
                length,
                style,
                complexity,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error generating narrative:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to generate narrative due to an internal server error.',
            details: error.message
        });
    }
});

// Basic error handling for unmatched routes
app.use((req, res, next) => {
    res.status(404).send({
        status: 'error',
        message: 'Not Found',
        details: `The requested URL ${req.originalUrl} was not found on this server.`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: 'error',
        message: 'Something went wrong!',
        details: err.message
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Narrative Generation Service running on http://localhost:${PORT}`);
});