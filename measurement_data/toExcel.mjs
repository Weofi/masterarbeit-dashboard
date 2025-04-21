import ExcelJS from "exceljs";
import {createReadStream} from "fs";
import csv from "csv-parser";

const fileGroups = {
  "1k": ['./React_1k.csv', './Vue_1k.csv', './Angular_1k.csv'],
  "10k": ['./React_10k.csv', './Vue_10k.csv', './Angular_10k.csv'],
  "100k": ['./React_100k.csv', './Vue_100k.csv', './Angular_100k.csv'],
  "1M": ['./React_1M.csv', './Vue_1M.csv', './Angular_1M.csv'],
};

const processFiles = (filePaths) => {
  return new Promise((resolve) => {
    const appData = {};
    let processedFiles = 0;

    filePaths.forEach((filePath) => {
      const appName = filePath.match(/React|Vue|Angular/)[0];
      appData[appName] = [];

      createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          appData[appName].push(row);
        })
        .on("end", () => {
          processedFiles++;
          if (processedFiles === filePaths.length) {
            resolve(appData);
          }
        });
    });
  });
};

const convertToExcel = async () => {
  const workbook = new ExcelJS.Workbook();

  for (const [group, filePaths] of Object.entries(fileGroups)) {
    const appData = await processFiles(filePaths);

    const metrics = ['INP', 'CLS', 'TBT', 'LCP', 'PeakHeap'];
    const maxRows = Math.max(
      appData.React.length,
      appData.Vue.length,
      appData.Angular.length
    );

    const orderedRows = [];
    for (let i = 0; i < maxRows; i++) {
      const row = [];
      metrics.forEach((metric) => {
        row.push(appData.React[i]?.[metric] || '');
        row.push(appData.Vue[i]?.[metric] || '');
        row.push(appData.Angular[i]?.[metric] || '');
        row.push(''); // Leere Spalte für visuelle Trennung
      });
      orderedRows.push(row);
    }

    const worksheet = workbook.addWorksheet(group);

    // Erste Reihe (Header) fixieren
    worksheet.views = [
      { state: 'frozen', ySplit: 1 } // ySplit: 1 bedeutet, dass die erste Zeile fixiert wird
    ];

    // Spaltenüberschriften erstellen
    const headerRow = [];
    metrics.forEach((metric) => {
      headerRow.push(`${metric}_React`);
      headerRow.push(`${metric}_Vue`);
      headerRow.push(`${metric}_Angular`);
      headerRow.push(''); // Leere Spalte
    });
    worksheet.addRow(headerRow);

    // Datenzeilen hinzufügen
    orderedRows.forEach((row) => {
      worksheet.addRow(row);
    });

    // Automatische Spaltenbreite
    worksheet.columns = headerRow.map((header) => ({
      header,
      width: header.length + 2, // Breite basierend auf der Header-Länge
    }));

    // Färbung und Zahlenformatierung der Zellen
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // Überspringe die Kopfzeile
      row.eachCell((cell, colIndex) => {
        const columnHeader = headerRow[colIndex - 1];
        if (columnHeader?.includes('Angular')) {
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFCCCC'}}; // Rötlich
        } else if (columnHeader?.includes('React')) {
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'CCCCFF'}}; // Bläulich
        } else if (columnHeader?.includes('Vue')) {
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'CCFFCC'}}; // Grünlich
        }

        if (columnHeader?.startsWith('INP')) {
          // Zahlenformatierung mit 2 Nachkommastellen anwenden
          if (!isNaN(cell.value) && cell.value !== '') {
            cell.value = parseFloat(cell.value); // Wert als Zahl setzen
            cell.numFmt = '#,##0.00'; // Zahlenformat mit 2 Nachkommastellen
          }
        } else if (!isNaN(cell.value) && cell.value !== '') {
          cell.value = parseFloat(cell.value); // Wert als Zahl setzen
          cell.numFmt = '#,##0'; // Zahlenformat mit 1000er-Trennzeichen ohne Dezimalstellen
        }
      });
    });

    // Berechnungen für Durchschnitt, Maximum und Minimum
    const dataStartRow = 2; // Daten beginnen ab Zeile 2
    const dataEndRow = worksheet.rowCount; // Letzte Zeile mit Daten
    const emptyRow = dataEndRow + 1; // Leerzeile
    const statsStartRow = emptyRow + 1; // Statistiken beginnen nach der Leerzeile

    worksheet.addRow([]); // Leerzeile einfügen

    headerRow.forEach((header, colIndex) => {
      if (header) {
        const columnLetter = worksheet.getColumn(colIndex + 1).letter; // Spaltenbuchstabe
        const dataRange = `${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}`; // Bereich der Daten

        // Formeln für Durchschnitt, Maximum und Minimum
        worksheet.getRow(statsStartRow).getCell(colIndex + 1).value = { formula: `AVERAGE(${dataRange})` };
        worksheet.getRow(statsStartRow + 1).getCell(colIndex + 1).value = { formula: `MAX(${dataRange})` };
        worksheet.getRow(statsStartRow + 2).getCell(colIndex + 1).value = { formula: `MIN(${dataRange})` };

        // Konfidenzintervall
        //worksheet.getRow(statsStartRow + 3).getCell(colIndex + 1).value =  `=KONFIDENZ.NORM(0,05;STABW.S(${dataRange});ANZAHL(${dataRange}))`;
        worksheet.getRow(statsStartRow + 4).getCell(colIndex + 1).value = { formula: `=AVERAGE(${dataRange}) + 1.96 * SQRT(SUMPRODUCT((${dataRange}-AVERAGE(${dataRange}))^2) / (COUNTA(${dataRange}) - 1)) / SQRT(COUNTA(${dataRange}))` };
        worksheet.getRow(statsStartRow + 5).getCell(colIndex + 1).value = { formula: `=AVERAGE(${dataRange}) - 1.96 * SQRT(SUMPRODUCT((${dataRange}-AVERAGE(${dataRange}))^2) / (COUNTA(${dataRange}) - 1)) / SQRT(COUNTA(${dataRange}))` };

        worksheet.getRow(statsStartRow + 7).getCell(colIndex + 1).value = { formula: `=AVERAGE(${dataRange}) + 2.58 * SQRT(SUMPRODUCT((${dataRange}-AVERAGE(${dataRange}))^2) / (COUNTA(${dataRange}) - 1)) / SQRT(COUNTA(${dataRange}))` };
        worksheet.getRow(statsStartRow + 8).getCell(colIndex + 1).value = { formula: `=AVERAGE(${dataRange}) - 2.58 * SQRT(SUMPRODUCT((${dataRange}-AVERAGE(${dataRange}))^2) / (COUNTA(${dataRange}) - 1)) / SQRT(COUNTA(${dataRange}))` };

        worksheet.getRow(statsStartRow + 10).getCell(colIndex + 1).value =  `=KONFIDENZ.NORM(0,05;STABW.S(${dataRange});ANZAHL(${dataRange}))`;
        worksheet.getRow(statsStartRow + 11).getCell(colIndex + 1).value =  `=KONFIDENZ.NORM(0,01;STABW.S(${dataRange});ANZAHL(${dataRange}))`;


        // Zahlenformatierung
        worksheet.getRow(statsStartRow).getCell(colIndex + 1).numFmt = '#,##0.00';
        worksheet.getRow(statsStartRow + 1).getCell(colIndex + 1).numFmt = '#,##0.00';
        worksheet.getRow(statsStartRow + 2).getCell(colIndex + 1).numFmt = '#,##0.00';

        worksheet.getRow(statsStartRow + 4).getCell(colIndex + 1).numFmt = '#,##0.00';
        worksheet.getRow(statsStartRow + 5).getCell(colIndex + 1).numFmt = '#,##0.00';
        worksheet.getRow(statsStartRow + 7).getCell(colIndex + 1).numFmt = '#,##0.00';
        worksheet.getRow(statsStartRow + 8).getCell(colIndex + 1).numFmt = '#,##0.00';
      }
    });

    // Beschriftungen für die Statistiken ans Ende der Zeile setzen
    const lastColumn = headerRow.length + 1; // Letzte Spalte
    worksheet.getRow(statsStartRow).getCell(lastColumn).value = 'Durchschnitt';
    worksheet.getRow(statsStartRow + 1).getCell(lastColumn).value = 'Maximum';
    worksheet.getRow(statsStartRow + 2).getCell(lastColumn).value = 'Minimum';

    worksheet.getRow(statsStartRow + 4).getCell(lastColumn).value = 'Konfidenzintervall 95% (oben)';
    worksheet.getRow(statsStartRow + 5).getCell(lastColumn).value = 'Konfidenzintervall 95% (unten)';

    worksheet.getRow(statsStartRow + 7).getCell(lastColumn).value = 'Konfidenzintervall 99% (oben)';
    worksheet.getRow(statsStartRow + 8).getCell(lastColumn).value = 'Konfidenzintervall 99% (unten)';

    // Farben für die Statistiken anwenden
    worksheet.getRow(statsStartRow).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } }; // Gelblich
    });

    worksheet.getRow(statsStartRow + 1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CCFFCC' } }; // Grünlich
    });

    worksheet.getRow(statsStartRow + 2).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCC' } }; // Rötlich
    });
  }

  await workbook.xlsx.writeFile("Excel_Auswertung.xlsx");
  console.log("Die Excel-Datei wurde erfolgreich erstellt.");
};

convertToExcel().then();
