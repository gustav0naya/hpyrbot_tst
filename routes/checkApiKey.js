require('dotenv').config();

function checkApiKey(req, res, next) {
    // You can look for the key in headers, query params, or wherever you prefer
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.LOAD_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    // If the key matches, proceed
    next();
}

module.exports = checkApiKey;
