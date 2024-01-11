import React from "react";

const Rounds = ({ rounds, numPlayers }) => {
  const byesPerRound = {};
  let elements = Array.from({ length: numPlayers }, (x, i) => i + 1);
  let elementsSet = new Set(elements);
  Object.keys(rounds).forEach((k) => {
    let round = new Set(rounds[k]);
    const difference = new Set();
    elementsSet.forEach((element) => {
      if (!round.has(element)) {
        difference.add(element);
      }
    });
    byesPerRound[k] = [...difference];
  });
  return (
    <div>
      <table className="match-table">
        <thead>
          <tr>
            <th>
              <pre>Game</pre>
            </th>
            <th>
              <pre>Players sitting out</pre>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(byesPerRound).map((round) => (
            <tr key={round}>
              <td>
                <pre>Game {round}</pre>
              </td>
              <td>
                <pre>{byesPerRound[round].join(',')}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rounds;
