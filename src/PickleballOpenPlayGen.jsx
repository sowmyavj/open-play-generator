import React, { useState } from 'react';
import MatchAssignmentUI from './MatchAssignmentsUi'; // Adjust the import path
import ExcelReader from './ExcelReader';

import './PickleballOpenPlayGen.css'; // Import the CSS file
import matchGenerator from './utilities1';
import RESULT_CACHE from './resultsCaches';

const PickleballOpenPlayGen = () => {
  const [numPlayers, setNumPlayers] = useState('');
  const [minMatches, setMinMatches] = useState('');
  const [numCourts, setNumCourts] = useState('');
  const [result, setResult] = useState([]);
  const [numberOfMatchesPerPlayer, setNumberOfMatchesPerPlayer]= useState(null);
  const [playerNames, setPlayerNames] = useState([]);


  const generatePlayerNamesinOutput =(op) => {
    const numberRegex = /(?:Players )(\d+)(?: and )(\d+) vs (\d+) and (\d+)/g;
    return op.map((o) => {
      const updatedMatchString = o.replace(numberRegex, (_, player1, player2, player3, player4) => {
             return `Players ${playerNames[player1-1] || player1} and ${playerNames[player2-1] || player2} vs ${playerNames[player3-1] ||player3} and ${playerNames[player4-1] ||player4}`;
          });
      return updatedMatchString;
    });
  };
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
      
      let res=generatePlayerNamesinOutput(output);
      setResult(res)
    }else {
      matchGenerator({ numOfPlayers: numPlayers, minMatches , noOfCourts: numCourts}).then(({output, finalNumberOfMatchesPerPlayer}) => {
        setNumberOfMatchesPerPlayer(finalNumberOfMatchesPerPlayer);
      let res=generatePlayerNamesinOutput(output);
      setResult(res)
    });
    }
    
  };

  const onUpload = (t) => {
    console.log(t);
    setPlayerNames(t);
    setNumPlayers(t.length);
  }

  return (
    <div className="pickleball-container">
      <h1>Open Play Games Generator</h1>
      <ExcelReader onUpload={onUpload}/>
      <form onSubmit={handleSubmit}>
        <label>
        <p className="input-label">Number of Players:</p>
          <input
            type="number"
            value={numPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          <p className="input-label">Minimum Number of Matches per Player:</p>
          <input
            type="number"
            value={minMatches}
            onChange={(e) => setMinMatches(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
        <p className="input-label">Number of Courts:</p>
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
          <MatchAssignmentUI matchAssignments={numberOfMatchesPerPlayer} playerNames={playerNames}/>
        </div>
      )}
    </div>
  );
};

export default PickleballOpenPlayGen;
