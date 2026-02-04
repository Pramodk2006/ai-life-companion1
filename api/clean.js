// ISOLATED SERVERLESS FUNCTION
// NO IMPORTS - NO DEPENDENCIES - NO REFERENCES

module.exports = function handler(req, res) {
    // Basic error boundary
    try {
        // Set response type
        res.setHeader('Content-Type', 'application/json');
        
        // Handle favicon
        if (req.url && req.url.includes('favicon')) {
            res.status(204).end();
            return;
        }
        
        // Basic success response
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Isolated serverless function working',
            timestamp: Date.now(),
            method: req.method || 'UNKNOWN',
            url: req.url || '/'
        });
        
    } catch (err) {
        // Minimal error response
        res.status(500).json({
            error: 'Function error',
            message: err.message || 'Unknown error'
        });
    }
};