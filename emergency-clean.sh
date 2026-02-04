# EMERGENCY CLEAN DEPLOYMENT

# Remove everything and rebuild
rm -rf api src start-*.js *.md package*.json node_modules logs
mkdir api

# Create minimal function
cat > api/index.js << 'EOF'
// EMERGENCY CLEAN FUNCTION
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url?.includes('favicon')) {
        res.status(204).end();
        return;
    }
    
    res.status(200).json({
        message: "EMERGENCY CLEAN DEPLOYMENT WORKING",
        timestamp: Date.now(),
        success: true
    });
};
EOF

# Create clean vercel.json  
cat > vercel.json << 'EOF'
{
  "functions": {
    "api/index.js": {}
  }
}
EOF

# Clean package.json
cat > package.json << 'EOF'
{
  "name": "emergency-clean",
  "version": "1.0.0"
}
EOF

echo "Emergency clean deployment created!"