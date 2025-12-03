const path = require('path');
const fs = require('fs').promises;

// Define the base directory where saga markdown files are stored
const SAGA_DIR = path.join(__dirname, '..', '..', '..', 'saga_content');

/**
 * Fetches the markdown content for a specific saga page.
 * @param {number} pageNumber - The page number to fetch (1-indexed).
 * @returns {Promise<string>} The markdown content of the page.
 * @throws {Error} If the file cannot be read or does not exist.
 */
const getSagaPageContent = async (pageNumber) => {
    if (typeof pageNumber !== 'number' || pageNumber < 1 || !Number.isInteger(pageNumber)) {
        throw new Error('Invalid page number provided.');
    }

    const fileName = `${pageNumber}.md`;
    const filePath = path.join(SAGA_DIR, fileName);

    try {
        const content = await fs.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`Saga page ${pageNumber} not found.`);
        }
        throw new Error(`Failed to read saga page ${pageNumber}: ${error.message}`);
    }
};

/**
 * API Controller for handling saga page requests.
 * GET /api/v1/saga/pages/:pageNumber
 */
exports.getPage = async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber, 10);

    if (isNaN(pageNumber)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Page number must be a valid integer.' 
        });
    }

    try {
        const content = await getSagaPageContent(pageNumber);
        
        res.status(200).json({
            success: true,
            page: pageNumber,
            content: content,
            contentType: 'markdown'
        });
    } catch (error) {
        console.error(`Error fetching saga page ${pageNumber}:`, error.message);
        
        // Handle specific error types for better client feedback
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving saga content.'
        });
    }
};