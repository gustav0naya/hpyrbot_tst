// services/loadService.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const loadsFilePath = path.join(__dirname, '../loads.csv');

// We'll keep our loaded data in a dictionary, keyed by reference_number
let loadsByRef = {};

/**
 * Initialize the loads data once at application startup.
 * This reads the CSV file, builds loadsByRef, and resolves the Promise when complete.
 */
function initLoads() {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(loadsFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // Accumulate rows in an array first
                results.push(row);
            })
            .on('end', () => {
                // Convert the array into a dictionary for quick lookups
                results.forEach((row) => {
                    // Example row shape:
                    // {
                    //   reference_number: "ABC123",
                    //   origin: "Dallas, TX",
                    //   destination: "Atlanta, GA",
                    //   equipment_type: "Dry Van",
                    //   rate: "2500",
                    //   commodity: "Electronics"
                    // }
                    loadsByRef[row.reference_number] = row;
                });

                console.log('Loads data initialized in memory');
                resolve(); // Done loading
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

/**
 * Finds a load by reference number in the in-memory dictionary.
 *
 * Returns the load object if found, otherwise null.
 */
function findLoadByReference(referenceNumber) {
    // Quick dictionary lookup instead of reading the CSV again
    return loadsByRef[referenceNumber] || null;
}

module.exports = {
    initLoads,
    findLoadByReference,
};
