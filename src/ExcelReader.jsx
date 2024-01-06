import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import  './ExcelReader.css';
const ExcelReader = ({onUpload}) => {
  const [playerNames, setPlayerNames] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Assuming player names are in column 'A' starting from row 2
      const playerNamesArray = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 });
      onUpload(playerNamesArray);
      setPlayerNames(playerNamesArray);
    };

    reader.readAsBinaryString(file);
  };

  return (
        <div>
          <h2>Upload Player Names File(in .xls/.xlsx format</h2>
          <input type="file" accept=".xls, .xlsx" onChange={handleFileUpload} />
          <div className="player-list">
            {playerNames.map((player, index) => (
              <div key={index} className="player-item">
                <span className="player-number">{index+1}.</span>
                <span className="player-name">{player}</span>
              </div>
            ))}
          </div>
        </div>
      );
};

export default ExcelReader;
