import React from 'react';
import './MatchAssignmentsUi.css'; // Import the CSS file

const MatchAssignmentUI = ({ matchAssignments, playerNames }) => {
  return (
    <div>
      <h2>Match Assignments</h2>
      <table className="match-table">
        <thead>
          <tr>
            <th><pre>Player</pre></th>
            <th><pre>Matches Assigned</pre></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(matchAssignments).map(([player, matches]) => (
            <tr key={player}>
              <td><pre>{player} {playerNames[player-1]}</pre></td>
              <td><pre>{matches}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchAssignmentUI;
