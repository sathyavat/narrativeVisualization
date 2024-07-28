/**
 * Clean and filter the CSV data.
 * @param {Array} data - The raw CSV data.
 * @returns {Array} - The cleaned and filtered data.
 */
async function cleanData(data) {
    // Columns to keep
    const columnsToKeep = [
        'Vehicle Manufacturer Name', 'Represented Test Veh Make', 'Test Fuel Type Description',
        'Tested Transmission Type', 'Vehicle Type', 'CO2 (g/mi)', 'RND_ADJ_FE', 'FE_UNIT',
        'Rated Horsepower'
    ];

    // Mapping for fuel type renaming
    const fuelTypeMap = {
        "CARB LEV3 E10 Premium Gasoline": "Premium Gasoline E10",
        "CARB LEV3 E10 Regular Gasoline": "Regular Gasoline E10",
        "Cold CO E10 Regular Gasoline (Tier 3)": "Regular Gasoline (Cold E10)",
        "Cold CO Premium (Tier 2)": "Premium Gasoline",
        "Cold CO Regular (Tier 2)": "Regular Gasoline",
        "E85 (85% Ethanol 15% EPA Unleaded Gasoline)": "E85",
        "Electricity": "Electric",
        "Federal Cert Diesel 7-15 PPM Sulfur": "Low-Sulfur Diesel",
        "Hydrogen 5": "Hydrogen",
        "Tier 2 Cert Gasoline": "Standard Gasoline"
    };

    // Clean and filter data
    return data
        .map(row => {
            // Convert numeric values to numbers
            row['RND_ADJ_FE'] = +row['RND_ADJ_FE'];
            row['CO2 (g/mi)'] = +row['CO2 (g/mi)'];
            row['Rated Horsepower'] = +row['Rated Horsepower'];

            return row;
        })
        .filter(row => {
            const mpg = row['RND_ADJ_FE'];
            const co2 = row['CO2 (g/mi)'];
            const horsepower = row['Rated Horsepower'];
            const fuelType = row['Test Fuel Type Description'];

            // Filter based on conditions
            return mpg > 0 && mpg <= 200 && co2 > 0 && !isNaN(mpg) && !isNaN(co2)
                && !isNaN(horsepower) && horsepower > 0
                && fuelType !== 'Tier 3 E10 Premium Gasoline (9 RVP @Low Alt.)'; // Remove specific fuel type
        })
        .map(row => {
            let cleanedRow = {};
            columnsToKeep.forEach(column => {
                if (column === 'Test Fuel Type Description') {
                    // Rename fuel types
                    cleanedRow[column] = fuelTypeMap[row[column]] || row[column];
                } else {
                    cleanedRow[column] = row[column];
                }
            });
            return cleanedRow;
        });
}

export { cleanData };
