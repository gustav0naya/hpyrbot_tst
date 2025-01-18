// controllers/loadController.js
const loadService = require('../services/loadService');

exports.getLoadDetails = async (req, res) => {
    try {
        // Log the incoming request details
        console.log('Received request:');
        console.log('Headers:', req.headers);
        console.log('Query Parameters:', req.query);

        const referenceNumber = req.query.reference_number;

        if (!referenceNumber) {
            return res.status(400).json({ error: "Reference number is required" });
        }

        const loadData = await loadService.findLoadByReference(referenceNumber);

        if (!loadData) {
            return res.status(404).json({ error: "Load not found" });
        }

        // If you need to transform the data further, do it here:
        // e.g. rename fields, add extra computed values, etc.

        res.json(loadData);
    } catch (error) {
        console.error("Error fetching load data:", error.message);
        res.status(500).json({ error: "Failed to retrieve load data" });
    }
};
