const fs = require('fs');
const { Readable } = require('stream');
const { initLoads, findLoadByReference } = require('../services/loadService');
jest.mock('fs');

describe('Load Service', () => {
    const mockCsvData = `reference_number,origin,destination,equipment_type,rate,commodity
12345,Chicago,New York,Dry Van,1500,Furniture
67890,Los Angeles,Dallas,Flatbed,2000,Construction Materials
54321,Miami,Atlanta,Refrigerated,2500,Perishable Foods`;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    function createMockReadableStream(data) {
        const readable = new Readable({
            read() {}, // No-op _read
        });
        data.split('\n').forEach((line) => readable.push(`${line}\n`));
        readable.push(null); // End of stream
        return readable;
    }

    describe('initLoads', () => {
        it('should initialize loads from the CSV file', async () => {
            fs.createReadStream.mockReturnValue(createMockReadableStream(mockCsvData));

            await expect(initLoads()).resolves.toBeUndefined();

            expect(findLoadByReference('12345')).toEqual({
                reference_number: '12345',
                origin: 'Chicago',
                destination: 'New York',
                equipment_type: 'Dry Van',
                rate: '1500',
                commodity: 'Furniture',
            });

            expect(findLoadByReference('67890')).toEqual({
                reference_number: '67890',
                origin: 'Los Angeles',
                destination: 'Dallas',
                equipment_type: 'Flatbed',
                rate: '2000',
                commodity: 'Construction Materials',
            });

            expect(findLoadByReference('54321')).toEqual({
                reference_number: '54321',
                origin: 'Miami',
                destination: 'Atlanta',
                equipment_type: 'Refrigerated',
                rate: '2500',
                commodity: 'Perishable Foods',
            });
        });
    });


    describe('findLoadByReference', () => {
        beforeEach(async () => {
            fs.createReadStream.mockReturnValue(createMockReadableStream(mockCsvData));
            await initLoads();
        });

        it('should return a load when given a valid reference number', () => {
            const load = findLoadByReference('12345');
            expect(load).toEqual({
                reference_number: '12345',
                origin: 'Chicago',
                destination: 'New York',
                equipment_type: 'Dry Van',
                rate: '1500',
                commodity: 'Furniture',
            });
        });

        it('should return null when the reference number is not found', () => {
            const load = findLoadByReference('NONEXISTENT');
            expect(load).toBeNull();
        });
    });
});
