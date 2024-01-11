const CACHE = {};
function generateUniquePairings(combinations) {
  const usedCombinations = new Array();
  const pairings = [];

  for (let i = 0; i < combinations.length - 1; i++) {
    for (let j = i + 1; j < combinations.length; j++) {
      const commonElements = findCommonElements(
        combinations[i],
        combinations[j]
      );

      if (commonElements.length === 0) {
        pairings.push([combinations[i], combinations[j]]);
        usedCombinations.push(i);
        usedCombinations.push(j);
        // break; // Break to ensure that each combination is used only once
      }
    }
  }

  return pairings;
}

function findCommonElements(arr1, arr2) {
  return arr1.filter((element) => arr2.includes(element));
}

function generateCombinations(elements, r) {
  const allCombinations = [];

  function generate(currentCombination, start) {
    if (currentCombination.length === r) {
      allCombinations.push([...currentCombination]);
      return;
    }

    for (let i = start; i < elements.length; i++) {
      currentCombination.push(elements[i]);
      generate(currentCombination, i + 1);
      currentCombination.pop();
    }
  }

  generate([], 0);
  //console.log('allCombinations', allCombinations)
  return allCombinations;
}

function shuffle(a) {
  const array = [...a];
  var count = array.length,
    randomnumber,
    temp;
  while (count) {
    randomnumber = (Math.random() * count--) | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp;
  }
  return array;
}

function closestToN(array, n) {
  // console.log('array', array)
  // Calculate the sum of absolute differences
  const sumOfDifferences = array.reduce(
    (sum, number) => sum + Math.abs(number - n),
    0
  );
  return sumOfDifferences;
}

let result = {};
function validateNumOfPlayersAndGenMatches(minMatches, numOfPlayers) {
  if (numOfPlayers < 4 || minMatches > numOfPlayers) {
    console.log("Invalid input");
    return -1;
  }
  let numModuloFour = numOfPlayers % 4;
  const isMultipleOfFour = numModuloFour === 0;
  let final = [];
  const final2 = {};
  const final3 = {};
  let elements = Array.from({ length: numOfPlayers }, (x, i) => i + 1);
  let count = 0;
  if (true) {
    // while(count < 20){
    final = [];
    generateMatches(
      minMatches,
      final,
      elements,
      isMultipleOfFour,
      final2,
      count,
      final3
    );
    count++;
    //  }

    Object.keys(final2).forEach((k) => {});
    let min = Math.min(...Object.keys(final2).map((item) => item));
    result = final2[min];
    return -1;
  }
}

function generateMatches(
  minMatches,
  final,
  elements,
  isMultipleOfFour,
  final2 = {},
  count,
  final3 = {}
) {
  const r = 2;
  const cacheKey = elements.length + "C4";
  let pairings;
  if (CACHE[cacheKey]) {
    pairings = CACHE[cacheKey];
    //console.log('Cached Pairings', pairings);
  } else {
    const uniqueCombinations = generateCombinations(elements, r);
    pairings = generateUniquePairings(uniqueCombinations);
  }
  const pairingsCopy = shuffle(pairings);
  //const pairingsCopy = [...pairings];
  //console.log('Pairings,',pairingsCopy.length,pairingsCopy);

  const hash1 = {};

  for (let i = 0; i < pairingsCopy.length; i++) {
    const pairing = pairingsCopy[i];
    const temp = pairing.flat();
    for (let j = 0; j < temp.length; j++) {
      const x = temp[j];
      if (x.toString() in hash1) {
        hash1[x.toString()]++;
      } else {
        hash1[x.toString()] = 1;
      }
    }
    final.push(pairing);
  }
  //const numMatchesmet = Object.values(hash1).every((n) => n === minMatches);
  //console.log('Sowmya', final.length)
  final2[count] = final;
  return true;
}

function assignCourtsToMatches(
  matches,
  numOfPlayers,
  minMatches,
  noOfCourts,
  pc,
  myHash
) {
  console.log("matches", matches.length);
  let doublesMatches = matches;
  const COURTS = new Array(26).fill(1).map((_, i) => i + 1);
  // const COURTS_ASSIGNED = COURTS.slice(0, (numOfPlayers - numOfPlayers%4) / 4);
  const minCourts = Math.min(
    (numOfPlayers - (numOfPlayers % 4)) / 4,
    noOfCourts
  );
  //let minCourts = noOfCourts;
  const COURTS_ASSIGNED = COURTS.slice(0, minCourts);
  let courts = [...COURTS_ASSIGNED];
  let playerCourtAssignments = {};
  let courtAssignments = {};
  let teamsPlayed = {};
  let PLAYERS = Array.from({ length: numOfPlayers }, (x, i) => i + 1);
  PLAYERS.forEach((e) => (playerCount[e] = 0));
  let courtsWithAssignments = {};
  COURTS_ASSIGNED.forEach((c) => (courtsWithAssignments[c] = []));
  let count = 0;
  let teamsPaired = {};
  let sortingPriorityPlayers = [];
  function assignCourts(
    doublesMatches,
    courtAssignments,
    playerCourtAssignments,
    courts
  ) {
    for (let i = 0; i < doublesMatches.length; i++) {
      let match = doublesMatches[i];
      const [team1, team2] = match;
      const t1 = team1.join();
      const reversedt1 = [...team1].reverse().join();
      const t2 = team2.join();
      const reversedt2 = [...team2].reverse().join();

      let nextCourt = courts[0];

      //if(nextCourt in courtAssignments) break;

      if (match.flat().some((m) => m in playerCourtAssignments)) continue;

      nextCourt = courts.shift();

      if (!nextCourt) break;
      // console.log('Before',doublesMatches.length )

      doublesMatches = doublesMatches.filter((m) => {
        const [team1, team2] = match;
        const [origTeam1, origTeam2] = m;
        //console.log(team1.join(),team2.join(), origTeam1.join(),origTeam2.join())
        if (
          team1.join() !== origTeam1.join() &&
          team2.join() !== origTeam1.join() &&
          team1.join() !== origTeam2.join() &&
          team2.join() !== origTeam2.join()
        ) {
          return true;
        }
      });

      match.flat().forEach((m) => {
        playerCourtAssignments[m] = nextCourt;
        playerCount[m]++;
      });
      if (nextCourt in courtsWithAssignments) {
        courtsWithAssignments[nextCourt].push(match);
      } else {
        courtsWithAssignments[nextCourt] = [match];
      }

      //courtsWithAssignments[nextCourt].push(match);

      teamsPaired[t1] = true;
      teamsPaired[t2] = true;
      teamsPaired[reversedt1] = true;
      teamsPaired[reversedt2] = true;
      //console.log('courtsWithAssignments',JSON.stringify(courtsWithAssignments))
      //console.log(teamsPaired)
    }
    return doublesMatches;
  }

  while (
    Object.values(playerCount).some((n) => n < minMatches) &&
    doublesMatches.length !== 0  && count < 100
  ) {
    if (courts.length === 0) {
      sortingPriorityPlayers = PLAYERS.filter(
        (x) => !Object.keys(playerCourtAssignments).includes(x.toString())
      );
      if (sortingPriorityPlayers.length !== 0) {
        doublesMatches.sort((m1, m2) => {
          const [m1team1, m1team2] = m1;
          const [m2team1, m2team2] = m2;
          if (
            m1team1.filter((value) => sortingPriorityPlayers.includes(value))
              .length +
              m1team2.filter((value) => sortingPriorityPlayers.includes(value))
                .length >
            m2team1.filter((value) => sortingPriorityPlayers.includes(value))
              .length +
              m2team2.filter((value) => sortingPriorityPlayers.includes(value))
                .length
          ) {
            return -1;
          } else {
            return 1;
          }
        });
      }

      playerCourtAssignments = {};
    }
    const temp = COURTS_ASSIGNED.filter((m) => courts.indexOf(m) < 0);
    courts.push(...temp);
    doublesMatches = assignCourts(
      doublesMatches,
      courtAssignments,
      playerCourtAssignments,
      courts
    );
    count++;
  }

  console.log("playerCount Final", JSON.stringify(playerCount), count);
  const sumOfDifferencesWithMinMatches = closestToN(
    Object.values(playerCount),
    minMatches
  );
  myResHash[sumOfDifferencesWithMinMatches] = {
    sumOfDifferencesWithMinMatches,
    courtsWithAssignments,
    playerCount,
  };
  //console.log("sumOfDifferencesWithMinMatches", sumOfDifferencesWithMinMatches);
  function assignTofinalNumberOfMatchesPerPlayer(player, playersHash) {
    if (player in playersHash) {
      playersHash[player]++;
      return;
    }
    playersHash[player] = 1;
  }

  function assignTomatchesForEachPlayer(player, playersHash, match) {
    if (player in playersHash) {
      playersHash[player].push(match);
      return;
    }
    playersHash[player] = [match];
  }
  let matchesForEachPlayer = {};

  function printMatchesForPlayer(player) {
    console.log("Matches per player", player);
    console.log(matchesForEachPlayer[player]);
  }
  function initializefinalNumberOfMatchesPerPlayer(hash, numP) {
    let elements = Array.from({ length: numOfPlayers }, (x, i) => i + 1);
    elements.forEach((e) => {
      hash[e] = 0;
    });
  }
}

const findLinesContainingPlayers = (playerNumber, data) => {
  const playersRegex = new RegExp(`\\bPlayer ${playerNumber}\\b`);
  return data.filter((line) => playersRegex.test(line));
};

function printCourts(courtsWithAssignments, numOfPlayers, noOfCourts) {
  let h = courtsWithAssignments;
  let output = [];
  let matchRes = {};
  const COURTS = new Array(26).fill(1).map((_, i) => i + 1);
  // const COURTS_ASSIGNED = COURTS.slice(0, (numOfPlayers - numOfPlayers%4) / 4);
  const minCourts = Math.min(
    (numOfPlayers - (numOfPlayers % 4)) / 4,
    noOfCourts
  );
  //let minCourts = noOfCourts;
  const COURTS_ASSIGNED = COURTS.slice(0, minCourts);
  COURTS_ASSIGNED.forEach((key) => {
    let matches = h[key];
    matchRes[key] = [];
    output.push(`Court ${key} :`);
    for (let m = 0; m < matches.length; m++) {
      const [player1, player2, player3, player4] = matches[m].flat();
      output.push(
        `Game ${
          m + 1
        } Players ${player1} and ${player2} vs ${player3} and ${player4}`
      );
    }
  });
  console.log(output);
  return output;
}
let myHash = {};
let myResHash = {};
let playerCount = {};
function matchGenerator({ numOfPlayers, minMatches, noOfCourts }) {
  let pc = 0;
  while (pc < 1) {
    pc++;
    validateNumOfPlayersAndGenMatches(numOfPlayers - 1, numOfPlayers);
    assignCourtsToMatches(
      result,
      numOfPlayers,
      minMatches,
      noOfCourts,
      pc,
      myHash
    );
  }
  const minimumDiff = Math.min(...Object.keys(myResHash));
  let res = myResHash[minimumDiff];
  let output = printCourts(res.courtsWithAssignments, numOfPlayers, noOfCourts);
  return {
    output,
    finalNumberOfMatchesPerPlayer: res.playerCount,
  };
}

export default matchGenerator;
