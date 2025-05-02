export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }
    
    try {
        const { target, payload } = req.body;
        
        if (!target || !payload) {
            return res.status(400).json({ status: 'error', message: 'Missing target or payload' });
        }
        
        // Validasi target URL untuk keamanan
        if (!/^https?:\/\/[^\/]+$/.test(`http://${target}`)) {
            return res.status(400).json({ status: 'error', message: 'Invalid target format' });
        }
        
        const response = await fetch(`http://${target}/api/control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Internal server error' 
        });
    }
};
