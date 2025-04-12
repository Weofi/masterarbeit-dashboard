import { createReadStream } from "fs";
    import csv from "csv-parser";

    const filePaths = [
      './React_1k.csv','./Vue_1k.csv', './Angular_1k.csv',
      './React_10k.csv','./Vue_10k.csv', './Angular_10k.csv',
      './React_100k.csv','./Vue_100k.csv', './Angular_100k.csv',
      './React_1M.csv','./Vue_1M.csv', './Angular_1M.csv',
    ];

    const calculateMean = (values) => {
      const validValues = values.filter((value) => !isNaN(value));
      return validValues.length > 0
        ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length
        : null;
    };

    filePaths.forEach((filePath) => {
      const columnData = {};

      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          Object.entries(row).forEach(([key, value]) => {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
              if (!columnData[key]) {
                columnData[key] = [];
              }
              columnData[key].push(numericValue);
            }
          });
        })
        .on('end', () => {
          console.log(`Column means for file: ${filePath}`);
          Object.entries(columnData).forEach(([column, values]) => {
            const mean = calculateMean(values);
            if (mean !== null) {
              const formattedMean = mean.toString().replace('.', ',');
              console.log(`  ${column}: ${formattedMean}`);
            }
          });
          console.log(`Finished processing file: ${filePath}`);
        });
    });
