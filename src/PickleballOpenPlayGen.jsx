import React, { useState } from 'react';
import MatchAssignmentUI from './MatchAssignmentsUi'; // Adjust the import path

import './PickleballOpenPlayGen.css'; // Import the CSS file
import matchGenerator from './utilities1';
import RESULT_CACHE from './resultsCaches';

const PickleballOpenPlayGen = () => {
  const [numPlayers, setNumPlayers] = useState('');
  const [minMatches, setMinMatches] = useState('');
  const [numCourts, setNumCourts] = useState('');
  const [result, setResult] = useState([]);
  const [numberOfMatchesPerPlayer, setNumberOfMatchesPerPlayer]= useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (
      isNaN(numPlayers) ||
      isNaN(minMatches) ||
      isNaN(numCourts) ||
      parseInt(numPlayers) < 4 ||
      parseInt(minMatches) >= parseInt(numPlayers) ||
      parseInt(numCourts) <= 0
    ) {
      alert('Please enter valid values.\nNumber of players must be greater than or equal to 4. \nMinimum Number of Matches must be less than the no of players ');
      return;
    }

    // Perform any logic or API calls with the entered values here
    console.log('Number of Players:', numPlayers);
    console.log('Minimum Number of Matches per Player:', minMatches);
    console.log('Number of Courts:', numCourts);
    if(RESULT_CACHE[numPlayers+'-'+minMatches+'-'+numCourts]){
      const {finalNumberOfMatchesPerPlayer, output }= RESULT_CACHE[numPlayers+'-'+minMatches+'-'+numCourts];
      setNumberOfMatchesPerPlayer(finalNumberOfMatchesPerPlayer);
      setResult(output)
    }else {
      matchGenerator({ numOfPlayers: numPlayers, minMatches , noOfCourts: numCourts}).then(({output, finalNumberOfMatchesPerPlayer}) => {
        setNumberOfMatchesPerPlayer(finalNumberOfMatchesPerPlayer);
      setResult(output)
    });
    }
    
  };

  

  return (
    <div className="pickleball-container">
      <h1>Open Play Games Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
        <p>Number of Players:</p>
          <input
            type="number"
            value={numPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          <p>Minimum Number of Matches per Player:</p>
          <input
            type="number"
            value={minMatches}
            onChange={(e) => setMinMatches(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
        <p>Number of Courts:</p>
          <input
            type="number"
            value={numCourts}
            onChange={(e) => setNumCourts(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Generate Schedule</button>
      </form>
      {!!result.length && (
        <div className="schedule-container">
          <h2>Schedule:</h2>
          <div>{result.map((r,idx) => 
            <pre key={idx}>{r}</pre>
          )}</div>
          <MatchAssignmentUI matchAssignments={numberOfMatchesPerPlayer} />
        </div>
      )}
    </div>
  );
};

export default PickleballOpenPlayGen;
