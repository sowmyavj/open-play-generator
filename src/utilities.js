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


function shuffle(a) {
    const array=[...a];
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
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
    let elements = Array.from({length: numOfPlayers}, (x, i) => i+1);
    let count = 0;
     if ( !isMultipleOfFour) {
        while(count < 20){
            final=[];
            generateMatches(minMatches, final, elements, isMultipleOfFour, final2);
            count++;
        }
        let min = Math.min(...Object.keys(final2).map(item => item));

        result=final2[min];
        return -1;
    }
    return generateMatches(minMatches, final, elements, isMultipleOfFour);
}

function generateMatches(minMatches, final, elements, isMultipleOfFour, final2={}) {
    const r = 2;
   
    const uniqueCombinations = generateCombinations(elements, r);
    const pairings = generateUniquePairings(uniqueCombinations);
    const pairingsCopy = shuffle(pairings);
    const hash1={};
   
    for(let i=0;i<pairingsCopy.length;i++){
        const pairing=pairingsCopy[i];
        const temp=[];
        pairing.forEach((p) => {
            temp.push(...p);
        })
        if(!temp.some((elem) => hash1[elem.toString()] === minMatches)){
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
    }
    const numMatchesmet = Object.values(hash1).every((n) => n === minMatches);
    if(numMatchesmet) {
       //console.log('Number of games generated per player', hash1)
       result=final;
        return numMatchesmet;
    }
    if(!isMultipleOfFour) {
        const temp = closestToN(Object.values(hash1), minMatches);
        //console.log('closestToN',closestToN(Object.values(hash1), minMatches));
        final2[temp] = final;
       // finalNumberOfMatchesPerPlayer[temp] = hash1;
    }
   
    return numMatchesmet;
}

function assignCourtsToMatches(matches, numOfPlayers, minMatches, noOfCourts) {
    let doublesMatches = matches;
    const COURTS = new Array( 26 ).fill( 1 ).map( ( _, i ) => i+1);
   // const COURTS_ASSIGNED = COURTS.slice(0, (numOfPlayers - numOfPlayers%4) / 4);
    const minCourts = Math.min( (numOfPlayers - numOfPlayers%4) / 4, noOfCourts);
    const COURTS_ASSIGNED = COURTS.slice(0, minCourts);
    let courts =[...COURTS_ASSIGNED];
    let playerCourtAssignments = {};
    let courtAssignments = {};
    let teamsPlayed = {};
    //count=0;

    let final = {};
    COURTS_ASSIGNED.forEach((c) => final[c] = [])

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
            final[nextCourt].push(match);
        }
        return doublesMatches;
    }
    while(doublesMatches.length) {
        const temp = COURTS_ASSIGNED.filter((m) => courts.indexOf(m) < 0)
        courts.push(...temp);

        playerCourtAssignments = {};
        courtAssignments = {};
        doublesMatches=assignCourts(doublesMatches, courtAssignments, playerCourtAssignments, courts);
        //count++;
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
    function printCourts(minMatches, output){
        let h=final;
        const finalNumberOfMatchesPerPlayer ={};
        
        COURTS_ASSIGNED.forEach((key) => {
            const matches=h[key];
            output.push(`Court ${key} :`);
            for(let m=0;m<minMatches;m++) {
                const [player1, player2,player3,player4]= matches[m].flat();
                [player1, player2,player3,player4].forEach((p)=> {
                    assignTofinalNumberOfMatchesPerPlayer(p, finalNumberOfMatchesPerPlayer);
                    assignTomatchesForEachPlayer(p, matchesForEachPlayer, matches[m])
                });
                output.push(`Game ${m+1} Players ${player1} and ${player2} vs ${player3} and ${player4}`)
                //console.log(`Game ${m+1} Players ${player1} and ${player2} vs ${player3} and ${player4}`)
            }
            })
            console.log('Number of games generated per player', finalNumberOfMatchesPerPlayer)
            //console.log('Matches per player', JSON.stringify(matchesForEachPlayer))
            console.log('END OF PROGRAM')
    }
    let output =[];
    printCourts(minMatches, output);
    printMatchesForPlayer('1');
    return output;
}

const matchGenerator = async ({ numOfPlayers, minMatches, noOfCourts }) => {
    validateNumOfPlayersAndGenMatches(numOfPlayers-1, numOfPlayers);
    return assignCourtsToMatches(result,numOfPlayers, minMatches, noOfCourts)
}
export default matchGenerator;
