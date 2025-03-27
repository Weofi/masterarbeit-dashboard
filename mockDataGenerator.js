const fs = require('fs');

// Load the existing dataset
const data = require('./angular-app/public/MOCK_DATA.json');

// Function to increase the dataset size
function increaseDatasetSize(data, targetSize) {
  const currentSize = data.length;
  const result = [...data];
  let nextId = currentSize + 1;

  while (result.length < targetSize) {
    const remaining = targetSize - result.length;
    const toAdd = data.slice(0, Math.min(remaining, currentSize)).map(entry => ({
      ...entry,
      id: nextId++
    }));
    result.push(...toAdd);
  }

  return result;
}

// Increase to 10,000 entries
const data10000 = increaseDatasetSize(data, 10000);
fs.writeFileSync('./angular-app/public/MOCK_DATA_10_000.json', JSON.stringify(data10000, null, 2));

// Increase to 100,000 entries
const data100000 = increaseDatasetSize(data, 100000);
fs.writeFileSync('./angular-app/public/MOCK_DATA_100_000.json', JSON.stringify(data100000, null, 2));

// Increase to 1,000,000 entries
const data1000000 = increaseDatasetSize(data, 1000000);
fs.writeFileSync('./angular-app/public/MOCK_DATA_1_000_000.json', JSON.stringify(data1000000, null, 2));

console.log('Datasets have been increased and saved.');
