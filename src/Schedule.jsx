// PrintSection.js
import React from 'react';
import MatchAssignmentUI from "./MatchAssignmentsUi"; // Adjust the import path
import  Rounds from "./Rounds";

const Schedule = ({result,rounds,numPlayers,numberOfMatchesPerPlayer,playerNames}) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write('<div style="margin: 20px;">');
    
        // Render only the content of the PrintSection component
        const sectionToPrint = document.getElementById('print-section');
        printWindow.document.write(sectionToPrint.innerHTML);
    
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.print();
      };
    
  return (
    <div className="schedule-container">
      <h2>Schedule:</h2>
      <button onClick={handlePrint}>Print Schedule</button>
      <table id="print-section">
        {result.map((r, idx) => (
          <tr key={idx}><td><pre>{r}</pre></td></tr>
        ))}
      </table>
      <Rounds rounds={rounds} numPlayers={numPlayers} playerNames={playerNames}/>
      <MatchAssignmentUI
        matchAssignments={numberOfMatchesPerPlayer}
        playerNames={playerNames}
      />
    </div>
  );
};

export default Schedule;
