import CACHE from './cachedData';
  
  function generateUniquePairings(combinations) {
      const usedCombinations = new Set();
      const pairings = [];
  
      for (let i = 0; i < combinations.length - 1; i++) {
          for (let j = i + 1; j < combinations.length; j++) {
              const commonElements = findCommonElements(combinations[i], combinations[j]);
  
              if (commonElements.length === 0 && !usedCombinations.has(i) && !usedCombinations.has(j)) {
                  pairings.push([combinations[i], combinations[j]]);
                  usedCombinations.add(i);
                  usedCombinations.add(j);
                  break; // Break to ensure that each combination is used only once
              }
          }
      }
  
      return pairings;
  }
  
  
  function findCommonElements(arr1, arr2) {
      return arr1.filter(element => arr2.includes(element));
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
     
      return allCombinations;
  }
  
  function shuffle( a ){
      const array=[...a];
   var count = array.length,
       randomnumber,
       temp;
   while( count ){
    randomnumber = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp
   }
   return array;
  }
  
  function closestToN(array, n) {
    // console.log('array', array)
    // Calculate the sum of absolute differences
    const sumOfDifferences = array.reduce((sum, number) => sum + Math.abs(number - n), 0);
    return sumOfDifferences;
  }
  
  let result={};
  function validateNumOfPlayersAndGenMatches(minMatches, numOfPlayers) {
      if(numOfPlayers < 4 || minMatches > numOfPlayers) {
          console.log('Invalid input');
          return -1;
      }
      let numModuloFour = numOfPlayers % 4;
      const isMultipleOfFour = numModuloFour === 0;
      let final=[];
      const final2={};
      const final3={};
      let elements = Array.from({length: numOfPlayers}, (x, i) => i+1);
      let count = 0;
       if (true) {
        // while(count < 20){
              final=[];
              generateMatches(minMatches, final, elements, isMultipleOfFour, final2, count, final3);
              count++;
       //  }
          
          Object.keys(final2).forEach((k) => {
              
          })
          let min = Math.min(...Object.keys(final2).map(item => item));
          result=final2[min];
          return -1;
      }
  }
  
  function generateMatches(minMatches, final, elements, isMultipleOfFour, final2={}, count, final3={}) {
      const r = 2;
      const cacheKey = elements.length +'C4';
      let pairings;
      if(CACHE[cacheKey]) {
          pairings = CACHE[cacheKey];
          //console.log('Cached Pairings', pairings);
      }else {
          const uniqueCombinations = generateCombinations(elements, r);
          pairings = generateUniquePairings(uniqueCombinations);
      }
      
      const pairingsCopy = shuffle(pairings);
  
      const hash1={};
     
      for(let i=0;i<pairingsCopy.length;i++){
          const pairing=pairingsCopy[i];
          const temp=pairing.flat();
              for(let j=0;j<temp.length;j++){
              const x=temp[j];
              if(x.toString() in hash1){
                  hash1[x.toString()]++;
              }else {
                  hash1[x.toString()]=1;
              }
              }
              final.push(pairing)
      }
      const numMatchesmet = Object.values(hash1).every((n) => n === minMatches);
  
      final2[count] = final;
      return numMatchesmet;
  }
  
  function assignCourtsToMatches(matches, numOfPlayers, minMatches, noOfCourts, pc, myHash) {
      let doublesMatches = matches;
      const COURTS = new Array( 26 ).fill( 1 ).map( ( _, i ) => i+1);
     // const COURTS_ASSIGNED = COURTS.slice(0, (numOfPlayers - numOfPlayers%4) / 4);
      const minCourts = Math.min( (numOfPlayers - numOfPlayers%4) / 4, noOfCourts);
      //let minCourts = noOfCourts;
      const COURTS_ASSIGNED = COURTS.slice(0, minCourts);
      let courts =[...COURTS_ASSIGNED];
      let playerCourtAssignments = {};
      let courtAssignments = {};
      let teamsPlayed = {};
      //count=0;
  
      let courtsWithAssignments = {};
      COURTS_ASSIGNED.forEach((c) => courtsWithAssignments[c] = [])
  
      function assignCourts(doublesMatches, courtAssignments, playerCourtAssignments, courts) {
          for(let i=0;i< doublesMatches.length;i++) {
              let match = doublesMatches[i];
         
              let nextCourt = courts[0];
              if(nextCourt in courtAssignments) break;
         
              if(match.flat().some((m) => m in playerCourtAssignments)) continue;
         
              nextCourt =courts.shift();
              if(!nextCourt) break;
              doublesMatches=doublesMatches.filter((m) => m.flat().join(',') !== match.flat().join(','));
              match.flat().forEach((m) => playerCourtAssignments[m] = nextCourt);
              courtAssignments[nextCourt] = (courtAssignments[nextCourt]||[]).push(match)
              courtsWithAssignments[nextCourt].push(match);
          }
          return doublesMatches;
      }
      while(doublesMatches.length) {
          const temp = COURTS_ASSIGNED.filter((m) => courts.indexOf(m) < 0)
          courts.push(...temp);
  
          playerCourtAssignments = {};
          courtAssignments = {};
          doublesMatches=assignCourts(doublesMatches, courtAssignments, playerCourtAssignments, courts);
         // count++;
      }
     
     function assignTofinalNumberOfMatchesPerPlayer(player, playersHash) {
         if(player in playersHash) {
             playersHash[player]++;
             return;
         }
         playersHash[player]=1;
     }
     
     function assignTomatchesForEachPlayer(player, playersHash, match) {
         if(player in playersHash) {
             playersHash[player].push(match);
             return;
         }
         playersHash[player]=[match];
     }
     let matchesForEachPlayer={};
  
     function printMatchesForPlayer(player){
      console.log('Matches per player', player);
      console.log(matchesForEachPlayer[player])
      }
      function initializefinalNumberOfMatchesPerPlayer(hash, numP){
         let elements = Array.from({length: numOfPlayers}, (x, i) => i+1);
         elements.forEach((e) => {
             hash[e]=0;
         });
      }
      function printCourts(minMatches,pc, myHash, myResHash){
          let h=courtsWithAssignments;
          const finalNumberOfMatchesPerPlayer ={};
          initializefinalNumberOfMatchesPerPlayer(finalNumberOfMatchesPerPlayer, numOfPlayers);
         let output =[];
         let matchRes= {};
          COURTS_ASSIGNED.forEach((key) => {
               let matches = h[key];
               matchRes[key]=[];
              //console.log('Matches', numOfPlayers, matches.length, matches)
              output.push(`Court ${key} :`);
              //console.log(`Court ${key} :`)
             // console.log('KEY',key, JSON.stringify(h))
              for(let m=0;m<minMatches+1;m++) {
                 // console.log('matches', m, matches[m])
                  const [player1, player2,player3,player4]= matches[m].flat();
                  [player1, player2,player3,player4].forEach((p)=> {
                      assignTofinalNumberOfMatchesPerPlayer(p, finalNumberOfMatchesPerPlayer);
                      assignTomatchesForEachPlayer(p, matchesForEachPlayer, matches[m])
                  });
                  //console.log(`Game ${m+1} Players ${player1} and ${player2} vs ${player3} and ${player4}`)
                  
                  matchRes[key].push(matches[m].flat());
                  output.push(`Game ${m+1} Players ${player1} and ${player2} vs ${player3} and ${player4}`)
              }
              })
              //console.log('Number of games generated per player', finalNumberOfMatchesPerPlayer)
              //console.log('Matches per player', JSON.stringify(matchesForEachPlayer))
              const sumOfDifferencesWithMinMatches =closestToN(Object.values(finalNumberOfMatchesPerPlayer), minMatches);
              // console.log('sumOfDifferencesWithMinMatches',sumOfDifferencesWithMinMatches);
              //output.push(finalNumberOfMatchesPerPlayer)
              myHash[sumOfDifferencesWithMinMatches]={output, finalNumberOfMatchesPerPlayer, matchRes};
             // myResHash[sumOfDifferencesWithMinMatches]=matchRes;
            // console.log('END OF PROGRAM')
      }
      
      printCourts(minMatches,pc, myHash, myResHash);
     // printMatchesForPlayer('1');
  }
  
  
  
  
  let myHash={};
  let myResHash={};
  const matchGenerator = async ({ numOfPlayers, minMatches, noOfCourts }) => {
    let pc=0;
    while(pc<500){
      pc++;
      validateNumOfPlayersAndGenMatches(numOfPlayers-1, numOfPlayers);
      assignCourtsToMatches(result,numOfPlayers, minMatches, noOfCourts,  pc, myHash);
      }
    const minimumDiff = Math.min(...Object.keys(myHash));
    console.log(minimumDiff, myHash[minimumDiff]);
    return myHash[minimumDiff];
}
export default matchGenerator;