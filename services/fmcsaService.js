// services/fmcsaService.js
const axios = require('axios');
require('dotenv').config();

const FMCSA_API_URL = "https://mobile.fmcsa.dot.gov/qc/services/carriers";

async function validateCarrier(mcNumber) {
    try {
        // Construct the full URL
        const apiUrl = `${FMCSA_API_URL}/${mcNumber}?webKey=${process.env.FMCSA_API_KEY}`;
        console.log("Querying API:", apiUrl);

        const response = await axios.get(apiUrl, {
            headers: {
                Accept: "application/json",
            },
        });

        const data = response.data;
        const carrierData = data?.content?.carrier || {};

        // Format and return the data
        return {
            allowedToOperate: carrierData.allowedToOperate || "N",
            legalName: carrierData.legalName || "N/A",
            safetyRating: carrierData.safetyRating || "N/A",
            operationType: carrierData.carrierOperation?.carrierOperationDesc || "N/A",
            location: {
                city: carrierData.phyCity || "N/A",
                state: carrierData.phyState || "N/A",
                street: carrierData.phyStreet || "N/A",
                zipcode: carrierData.phyZipcode || "N/A",
            },
            totalDrivers: carrierData.totalDrivers || 0,
            totalPowerUnits: carrierData.totalPowerUnits || 0,
        };
    } catch (error) {
        // Throw the error to be handled by the controller
        throw error;
    }
}

module.exports = {
    validateCarrier,
};
