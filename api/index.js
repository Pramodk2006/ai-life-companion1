// EMERGENCY NUCLEAR CLEAN FUNCTION
module.exports = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/health') {
        res.status(200).json({
            status: 'ok',
            timestamp: Date.now()
        });
        return;
    }

    if (req.url && req.url.includes('favicon')) {
        res.status(204).end();
        return;
    }
    
    res.status(200).json({
        message: "🚨 NUCLEAR CLEAN DEPLOYMENT SUCCESSFUL! 🚨",
        status: "EMERGENCY_CLEAN_WORKING", 
        timestamp: Date.now(),
        nuclear: true
    });
};