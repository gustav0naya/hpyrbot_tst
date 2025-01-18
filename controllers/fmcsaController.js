// controllers/fmcsaController.js
const fmcsaService = require('../services/fmcsaService');

exports.validateCarrier = async (req, res) => {
    try {
        // Log the incoming request details
        console.log('Received request:');
        console.log('Headers:', req.headers);
        console.log('Query Parameters:', req.query);

        const mcNumber = req.query.mc_number;

        if (!mcNumber) {
            return res.status(400).json({ error: "MC number is required" });
        }

        // Call service to do the heavy lifting
        const carrierData = await fmcsaService.validateCarrier(mcNumber);

        // Send the JSON response
        res.json(carrierData);

    } catch (error) {
        console.error("Error fetching data from FMCSA API:", error.message);

        // If we have more info from the error response, log it
        if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Response Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else {
            console.error("No response received:", error.request);
        }

        res.status(500).json({ error: "Failed to fetch data from FMCSA API" });
    }
};
