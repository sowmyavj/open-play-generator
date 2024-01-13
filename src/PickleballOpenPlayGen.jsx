import React, { useState, useEffect } from "react";
import MatchAssignmentUI from "./MatchAssignmentsUi"; // Adjust the import path
import ExcelReader from "./ExcelReader";
import  Rounds from "./Rounds";
import Schedule from './Schedule';
import "./PickleballOpenPlayGen.css"; // Import the CSS file
import matchGenerator from "./utilities1";
import RESULT_CACHE from "./resultsCaches";

const PickleballOpenPlayGen = () => {
  const [numPlayers, setNumPlayers] = useState("");
  const [minMatches, setMinMatches] = useState("");
  const [numCourts, setNumCourts] = useState("");
  const [result, setResult] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [numberOfMatchesPerPlayer, setNumberOfMatchesPerPlayer] =
    useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmit] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
       getScheduleData().then(({output, finalNumberOfMatchesPerPlayer, rounds}) => {
        setNumberOfMatchesPerPlayer(finalNumberOfMatchesPerPlayer);
        let res = generatePlayerNamesinOutput(output);
        setResult(res);
        setRounds(rounds);
        setIsSubmit(false)
       });
      
    }
  }, [isSubmitting]);

  const getScheduleData = async () => {
    if (isChecked && RESULT_CACHE[numPlayers + "-" + minMatches + "-" + numCourts]) {
      return RESULT_CACHE[numPlayers + "-" + minMatches + "-" + numCourts];
    } else {
      return matchGenerator({
        numOfPlayers: numPlayers,
        minMatches,
        noOfCourts: numCourts,
      });
    }
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const generatePlayerNamesinOutput = (op) => {
    const numberRegex = /(?:Players )(\d+)(?: and )(\d+) vs (\d+) and (\d+)/g;
    return op.map((o) => {
      const updatedMatchString = o.replace(
        numberRegex,
        (_, player1, player2, player3, player4) => {
          return `Players ${playerNames[player1 - 1] || player1} and ${
            playerNames[player2 - 1] || player2
          } vs ${playerNames[player3 - 1] || player3} and ${
            playerNames[player4 - 1] || player4
          }`;
        }
      );
      return updatedMatchString;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   // setResult([]);
    // Validate input
    if (
      isNaN(numPlayers) ||
      isNaN(minMatches) ||
      isNaN(numCourts) ||
      parseInt(numPlayers) < 4 ||
      parseInt(minMatches) >= parseInt(numPlayers) ||
      parseInt(numCourts) <= 0
    ) {
      alert(
        "Please enter valid values.\nNumber of players must be greater than or equal to 4. \nMinimum Number of Matches must be less than the no of players "
      );
      return;
    }
    setIsSubmit(true);

    // Perform any logic or API calls with the entered values here
    console.log("Number of Players:", numPlayers);
    console.log("Minimum Number of Matches per Player:", minMatches);
    console.log("Number of Courts:", numCourts);
  };

  const onUpload = (t) => {
    console.log(t);
    setPlayerNames(t);
    setNumPlayers(t.length);
  };

  return (
    <div className="pickleball-container">
      <h1>Open Play Games Generator</h1>
      <ExcelReader onUpload={onUpload} />
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
        <button type="submit"  className={isSubmitting ? 'loading' : ''} disabled={isSubmitting}>Generate Schedule</button>
        
        <label htmlFor="checkbox" className="optimizeResultCheck">Check this box if you would like to see optimized result for your input combination</label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </form>
      {isSubmitting &&
        <div>Loading... </div>
      }
      {!!result.length && !isSubmitting && <Schedule result={result} rounds={rounds} numPlayers={numPlayers} numberOfMatchesPerPlayer={numberOfMatchesPerPlayer} playerNames={playerNames}/>
      }
    </div>
  );
};

export default PickleballOpenPlayGen;
