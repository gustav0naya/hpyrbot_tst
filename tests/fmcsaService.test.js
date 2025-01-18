const axios = require('axios');
const { validateCarrier } = require('../services/fmcsaService');
jest.mock('axios');

describe('FMCSA Service - validateCarrier', () => {
    // Test case 1: Successful API response
    it('should return formatted carrier data for a valid response', async () => {
        const mcNumber = '123456';
        const mockResponse = {
            data: {
                content: {
                    carrier: {
                        allowedToOperate: 'Y',
                        legalName: 'Test Carrier',
                        safetyRating: 'Satisfactory',
                        carrierOperation: { carrierOperationDesc: 'Interstate' },
                        phyCity: 'Sample City',
                        phyState: 'CA',
                        phyStreet: '123 Sample Street',
                        phyZipcode: '90210',
                        totalDrivers: 10,
                        totalPowerUnits: 5,
                    },
                },
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await validateCarrier(mcNumber);

        expect(result).toEqual({
            allowedToOperate: 'Y',
            legalName: 'Test Carrier',
            safetyRating: 'Satisfactory',
            operationType: 'Interstate',
            location: {
                city: 'Sample City',
                state: 'CA',
                street: '123 Sample Street',
                zipcode: '90210',
            },
            totalDrivers: 10,
            totalPowerUnits: 5,
        });
        expect(axios.get).toHaveBeenCalledWith(
            `https://mobile.fmcsa.dot.gov/qc/services/carriers/${mcNumber}?webKey=${process.env.FMCSA_API_KEY}`,
            { headers: { Accept: 'application/json' } }
        );
    });

    // Test case 2: Partial API response
    it('should handle partial data from the API response', async () => {
        const mcNumber = '123456';
        const mockResponse = {
            data: {
                content: {
                    carrier: {
                        allowedToOperate: 'N',
                        phyCity: 'Sample City',
                    },
                },
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await validateCarrier(mcNumber);

        expect(result).toEqual({
            allowedToOperate: 'N',
            legalName: 'N/A',
            safetyRating: 'N/A',
            operationType: 'N/A',
            location: {
                city: 'Sample City',
                state: 'N/A',
                street: 'N/A',
                zipcode: 'N/A',
            },
            totalDrivers: 0,
            totalPowerUnits: 0,
        });
    });

    // Test case 3: API error handling
    it('should throw an error when the API call fails', async () => {
        const mcNumber = '123456';

        axios.get.mockRejectedValue(new Error('API Error'));

        await expect(validateCarrier(mcNumber)).rejects.toThrow('API Error');
    });

    // Test case 4: Missing API key
    it('should throw an error if the API key is missing', async () => {
        delete process.env.FMCSA_API_KEY;

        const mcNumber = '123456';

        await expect(validateCarrier(mcNumber)).rejects.toThrow();
    });

    // Test case 5: Unexpected response structure
    it('should handle unexpected response structure', async () => {
        const mcNumber = '123456';
        const mockResponse = { data: {} };

        axios.get.mockResolvedValue(mockResponse);

        const result = await validateCarrier(mcNumber);

        expect(result).toEqual({
            allowedToOperate: 'N',
            legalName: 'N/A',
            safetyRating: 'N/A',
            operationType: 'N/A',
            location: {
                city: 'N/A',
                state: 'N/A',
                street: 'N/A',
                zipcode: 'N/A',
            },
            totalDrivers: 0,
            totalPowerUnits: 0,
        });
    });

    // Test case 6: Log API URL
    it('should log the correct API URL', async () => {
        const mcNumber = '123456';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        axios.get.mockResolvedValue({ data: {} });

        await validateCarrier(mcNumber);

        expect(consoleSpy).toHaveBeenCalledWith(
            'Querying API:',
            `https://mobile.fmcsa.dot.gov/qc/services/carriers/${mcNumber}?webKey=${process.env.FMCSA_API_KEY}`
        );

        consoleSpy.mockRestore();
    });

    // Test case 7: Integration test (optional, real API call)
    it('should make a real API call and return valid data', async () => {
        const mcNumber = '123456';

        // Ensure you have a valid FMCSA_API_KEY in your .env file
        const result = await validateCarrier(mcNumber);

        console.log(result); // Check the output
        expect(result).toHaveProperty('allowedToOperate');
    });
});
