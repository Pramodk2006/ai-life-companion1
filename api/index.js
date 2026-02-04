// Lightweight serverless function for AI Companion
const { createClient } = require('@supabase/supabase-js');

let supabase = null;

// Initialize only essential components for serverless
function initServerless() {
    if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    }
    return { supabase };
}

// Serverless function handler
module.exports = async (req, res) => {
    try {
        // Set CORS headers for browser requests
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        
        const { method, url } = req;
        
        // Root endpoint
        if (method === 'GET' && (url === '/' || url === '')) {
            return res.json({ 
                message: '🤖 AI Life Companion is running!',
                status: 'active',
                mode: 'serverless',
                endpoints: [
                    '/health',
                    '/memory/stats',
                    '/api/chat'
                ],
                timestamp: new Date().toISOString()
            });
        }
        
        // Favicon endpoint
        if (method === 'GET' && url === '/favicon.ico') {
            res.status(204).end();
            return;
        }
        
        // Health endpoint
        if (method === 'GET' && url === '/health') {
            return res.json({ 
                status: 'ok', 
                mode: 'serverless',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString()
            });
        }
        
        // Memory stats (lightweight version)
        if (method === 'GET' && url === '/memory/stats') {
            const { supabase } = initServerless();
            if (!supabase) {
                return res.status(500).json({ error: 'Database not configured' });
            }
            
            try {
                // Simple query with timeout
                const { data, error } = await Promise.race([
                    supabase.from('conversations').select('count', { count: 'exact' }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 5000))
                ]);
                
                if (error) throw error;
                
                return res.json({ 
                    conversations: data?.length || 0,
                    status: 'connected',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Database error:', error.message);
                return res.json({ 
                    error: 'Database temporarily unavailable',
                    status: 'disconnected',
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        // Simple chat endpoint
        if (method === 'POST' && url === '/api/chat') {
            const body = req.body || {};
            const message = body.message || 'Hello';
            
            // Simple AI response without full initialization
            const responses = [
                "👋 Hello! I'm your AI companion, currently running in lightweight serverless mode.",
                "🚀 The full AI companion system works best when deployed with persistent storage.",
                "💡 You can interact with me through the web interface or integrate with messaging platforms.",
                "📱 For proactive messaging and full features, consider deploying to a platform with persistent processes.",
                "🤖 I'm here to help! What would you like to know about the AI companion system?"
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            return res.json({
                response,
                message,
                mode: 'serverless',
                timestamp: new Date().toISOString()
            });
        }
        
        // Default 404
        res.status(404).json({ 
            error: 'Endpoint not found',
            availableEndpoints: ['/', '/health', '/memory/stats', '/api/chat']
        });
        
    } catch (error) {
        console.error('❌ Serverless function error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
            timestamp: new Date().toISOString()
        });
    }
};