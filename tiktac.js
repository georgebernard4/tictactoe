const Square = ({ takeTurnSet, owner, id , highlight}) => {
  const markArray = [ "","O", "X"];
  // id is the square's number
  const colorPalate = [ '#0ff166','red', 'blue'];
  let color = colorPalate[owner];
  let mark = markArray[owner];
  let highlightStyle = '';
  if( highlight){
    highlightStyle =' 6px solid #0ff166 '
  }
  return (
    <button style = {{background : color , border: highlightStyle}}
      onClick={() => {
        takeTurnSet(id,owner)
      }}
    >
      <h1 background = {color}>{mark}</h1>
    </button>
  );
};
function valueCount( value, arr){
  let count = -1;
  let i = -1;
  do{
    i = arr.indexOf( value, i + 1);
    count++;
  }while( i !== -1);
  return count;
}
const Board = () => {
  // 1st player is X ie 1
  // State keeps track of next player and gameState
  
  //counts number of times an item is in an Array,
  //and in most circumstances value should be a primative value, otherwise think carefully about the references your searching for
  
  //gameState will be an array, for the first 9 values, the index determines the square, 0 = empty, 1 = chosen by player 1, 2 = chosen by player 2
  const [gameState, setGameState] = React.useState(Array(9).fill(0));
  //turns start at zero

  let turn = 9 - valueCount( 0, gameState);
  let player = 2 - (turn + 1) % 2;
  //let status = `Winner is ${checkForWinner(gameState)}`;
  //;
  let [winStatus, winLinNum] = checkForWinner(gameState);
  //console.log('results from checkForWinner...')
  //console.log( 'winStatus: ' + winStatus + '   winLinNum: ' + winLinNum);
 // let [winStatusX, winRec, winEval] = checkForWinnerAndSuggestAMove(gameState,win, turn, player);
  //console.log('results from checkForWinnerAndSuggestAMove...')
  //console.log( 'winStatusX: ' + winStatusX + '   winRec: ' + winRec + '   winEval: ' + winEval);
  let messagePalate = [ 'white', 'red', 'blue'];
  let messageColor = messagePalate[winStatus];
  let playerColor = messageColor;
  if  (playerColor === 'white') playerColor = messagePalate[player];
  //setting winStatus to -1 for tie game-over
  if( winStatus === 0 && turn === 9) winStatus = -1;
  let winDesc1 = '';
  let playerDesc =''
  let winDesc2='';
  let winSquares = [];
  if( winLinNum !== -1) winSquares = win[winLinNum];

  switch (winStatus) {
    case 0:
      winDesc1 = `Turn ${turn + 1}, it\'s `;
      playerDesc= `player ${player}`;
      winDesc2 = '\'s turn.';
      break;
    case -1:
      winDesc1 = 'Tie Game';
      playerDesc = '';
      winDesc2 = '';
      break;
    default:
      winDesc1 = ``;
      playerDesc =`player ${winStatus}`;
      winDesc2 = ' Wins!';
      console.log(`We hava a winner, player ${winStatus}!`);
      break;
      
      
  }
  

  const takeTurn = (id, player) => {
    let copyGameState = [...gameState];
    copyGameState[id] = player;
    setGameState( copyGameState);
    console.log(`Square: ${id} filled by player : ${player}`);
  };

  function takeTurnSetter( id, player){ return () => takeTurn(id,player);}

  function renderSquare(i) {
    let owner = gameState[i];
    let highlight = (winSquares.includes(i));
    let clickFunction = (y,z) => {return;}
    if( owner === 0 && winStatus === 0) clickFunction = takeTurnSetter(i,player);
    // use properties to pass callback function takeTurn to Child
    return <Square takeTurnSet={clickFunction} owner= {owner} id={i} highlight={highlight}></Square>;
  }
  function restartGame(){
    setGameState(Array(9).fill(0));
  }
  return (
    <div className="game-board">
      <div className="grid-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div id="info">
        <h1 style= {{color: messageColor}}>{winDesc1}<span style= {{color: playerColor}}>{playerDesc}</span>{winDesc2}</h1>
      </div>
      <br></br>
      <div>
        <button onClick={()=>restartGame()} > {winStatus === 0 ? 'reset Game' : 'Play Again'}</button>
      </div>
    </div>
  );
  
  
};

//gamestate is an array of moves represented as objects, with the properties player (0 or 1), and id(0-8)

const win = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],
];

//returns 0 for no winner, 1 if player 1 is a winner and 2 if player 2
function checkForWinner(gameState){
  //checks if a line is a winner
  function checkLineForWinner(lineArray, gameState){
    let lineArrayValues = lineArray.map( (squareId) => {return gameState[squareId]});
    let [ a, b, c] = lineArrayValues;
    if( a === 0) return 0;
    if( a !== b) return 0;
    if( a !== c) return 0;
    return a;
  }

  for(let i=0; i<win.length; i++){
    let lineCheck = checkLineForWinner( win[i],gameState);
    if( lineCheck !== 0){ return [lineCheck,i];}
  }
  return [0,-1];
}

//performs same as above but also suggest a move on last line of output array
//move suggested will be choosen randomly from best moves possible
//also returns an evaluation of the gamestate to allow reiteration
function checkForWinnerAndSuggestAMove(gameStateX, winArray = win, turn, player){
  //returns 3 for player 2 win, 2 for player 2 almost win, 0 if all zeros, -3 for player 1 win ... if both players on line returns null, and which squares are open
  //Also returns list of empty squares in the line
  if( turn === 0){
    let moveChoice = chooseOneRandomly( [0,3,5,7,9]);
    return [0, moveChoice, 0];
  }
  if( turn === 1){
    let moveChoices = [0,3,5,7,9];
    let firstMove = gameStateX.indexOf(1);
    let indexFirstMove = moveChoices.indexOf(firstMove);
    moveChoices.splice( indexFirstMove, 1); 
    let moveChoice = chooseOneRandomly( moveChoices);
    return [0, moveChoice, 0];
  }
  if( winArray.length === 0){
    if( turn === 9) return [ -1,[],0];
    let moveChoices = findIndexesofValue( 0, gameStateX);
    let choice = chooseOneRandomly(moveChoices);
    return [0, choice, 0];
  }
  function evaluateLine( gameStateX, lineArray){
    let playerSpotted = 0;
    let emptySquares = [];
    for( let i = 0; i < lineArray.length; i++){
      let squarePosition = lineArray[i];
      let squareVal = gameStateX[squarePosition];
      if( squareVal === 0){ 
        emptySquares.push(squarePosition);
      }else{
        if( playerSpotted === 0) { playerSpotted = squareVal;
        }else{
          if( squareVal !== playerSpotted) return [null,[]];
        }
      }
    }
    let zeroCount = emptySquares.length;
    let lineEval = (3 - zeroCount) * (-1)**playerSpotted;
      return [ lineEval, emptySquares];
  }
  let winA = [ ...winArray];
  let nonNegativeEvals = Array(3).fill([]);
  let negativeEvals    = Array(3).fill([]);
  let currentNumberofLines = winArray.length;
  
  for( let j = 0; j < currentNumberofLines; j++){
    
    let [ lineEval, emptySquares] = evaluateLine( gameStateX, winA[j]);
    if( Math.abs( lineEval ) === 3){ 
      let gameStateEval = lineEval < 0 ? -Infinity : Infinity;
      //game wins evaluate to -3 and 3, this sends them to the winning player values of 1 and 2
      return [ lineEval/6 + 1.5, winA[j], gameStateEval];
    }
    //removes blocked lines from subsequent searches
    if( lineEval === null){ winArray.splice(j,1)
    }else{ 
      let storageArray = ( lineEval < 0) ? negativeEvals : nonNegativeEvals;
      let storageIndex = Math.abs(lineEval);
      let tempArray = storageArray[ storageIndex];
      tempArray = tempArray.concat( emptySquares);
      storageArray[ storageIndex] = tempArray;
    }
  }
  

  
  let winStatusX = 0;
  let evalsGoodforPlayer =[];
  let evalsBadforPlayer =[];
  if( player === 1){
    evalsGoodforPlayer = negativeEvals;
    evalsBadforPlayer  = nonNegativeEvals;
  }else{ 
    evalsGoodforPlayer = negativeEvals;
    evalsBadforPlayer  = nonNegativeEvals;
  }
  let winningMoves = evalsGoodforPlayer[2];
  let gameEval = 0;
  if( winningMoves.length !== 0){
    let recMove = chooseOneRandomly( winningMoves);
    gameEval = ( player === 1) ? -Infinity : Infinity;
    return [ winStatusX, recMove, gameEval];
  }
  let savingMoves = evalsBadforPlayer[2];
  if( savingMoves.length !== 0){
    let recMove = chooseOneRandomly( savingMoves);
    if( savingMoves.length > 1){gameEval = ( player === 2) ? -Infinity : Infinity;
    }else{
      gameEval = evaluateMove( gameStateX, winArray, turn, player, savingMoves);
    }
    return [ winStatusX, recMove, gameEval];
  }
  //so wins have been determined, 1 move wins secured or avoided as much as possible
  //now we must evaluate from lines with one square taken, 
  //the arrays evalsgoodforplayer[1] and evalsbadforplayer[1]
  //every to entries signify two open blocks on a line, so if the player goes on one, we may assume the other player will take the other one
  let positionsOne = [...evalsGoodforPlayer[1]];
    let moveArray = [];
    let moveEvalArray = [];
    while (positionsOne.length > 0) {
      let move1 = positionsOne.pop();
      let move2 = positionsOne.pop();
      
      let eval1 = evaluateMove(gameStateX, winArray, turn, player, [ move1, move2])
      moveArray.push(move1);
      moveEvalArray.push( eval1);
      
      let eval2 = evaluateMove(gameStateX, winArray, turn, player, [ move2, move1])
      moveArray.push(move2);
      moveEvalArray.push( eval2);
    } 
    if( moveArray.length !== 0) {
      let maxEval = (player === 1) ? Math.min(...moveEvalArray) : Math.max( ...moveEvalArray);

      let maxIndexes = findIndexesofValue( maxEval, moveEvalArray);
      let maxMoves = maxIndexes.map( ( index) => { return moveArray[index] });
      maxMoves=maxMoves.filter( (val, index, array) => {return array.indexOf(value) === index} );
      let moveChoice = chooseOneRandomly( maxMoves);
      return [0,moveChoice, maxEval];
    }
    moveArray = [];
    moveEvalArray =[];
  let positionsNegOne = [...evalsBadforPlayer[1]];
  while (positionsNegOne.length > 0) {
    let move1X = positionsNegOne.pop();
    let move2X = positionsNegOne.pop();
    
    let eval1X = evaluateMove(gameStateX, winArray, turn, player, [ move1X, move2X])
    moveArray.push(move1X);
    moveEvalArray.push( eval1X);
    
    let eval2X = evaluateMove(gameStateX, winArray, turn, player, [ move2X, move1X])
    moveArray.push(move2X);
    moveEvalArray.push( eval2X);
  } 
  if( moveArray.length !== 0) {
    let maxEval = (player === 1) ? Math.min(...moveEvalArray) : Math.max( ...moveEvalArray);
    let maxIndexes = findIndexesofValue( maxEval, moveEvalArray);
    let maxMoves = maxIndexes.map( ( index) => { return moveArray[index] });
    maxMoves=maxMoves.filter( (val, index, array) => {return array.indexOf(value) === index} );
    let moveChoice = chooseOneRandomly( maxMoves);
    return [0,moveChoice, maxEval];
  }

  //choosing random move if return hasn't been reached yet
  if( turn === 9) return [ -1,[],0];
  let moveChoices = findIndexesofValue( 0, gameStateX);
  let choice = chooseOneRandomly(moveChoices);
  return [0, choice, 0];










  function chooseOneRandomly( Arr){
    let numberofChoices = Arr.length;
    let choice = Math.floor(Math.random()*numberofChoices);
    return Arr[choice];
  }

  //returns evaluates a move(s), 0 is tie, the more negative the better for player1
  function evaluateMove( gameStateX, winArray, turnX, playerX, moveArray){
    //creating copies of arrays
    let gameStateY = [...gameStateX]
    let winArrayX = [...winArray];

    //applying moves
    
    for(let k = 0; k < moveArray.length; k++){
      gameStateY[moveArray[k]] = player;
      playerX= playerX % 2 + 1;
      turnX++;
    }
    //running checkforWinnerAnd.. on gamestate
    let answer = checkForWinnerAndSuggestAMove( gameStateY, winArray, turnX, playerX)[3];
    return answer;  
  }

}
// returns [ number of occurences, array of values]
// [] => [0,[undefined]]
function findValuesWhichOccurMost( arr){
  arrX = [...arr] 
  arrX.sort();
  let previousItem = undefined;
  let count = 0;
  let maxCount = 0;
  let itemsWithMaxCount = [];
  for( let i = 0; i < arrX.length; i++){
    let item = arrX[i];
    if(  item === previousItem){
      count++
    }else{
      if( count === maxCount){
        itemsWithMaxCount.push(previousItem)
      }else if( count > maxCount ) {
        maxCount = count;
        itemsWithMaxCount = [item];  
      } 
      count = 1;
      previousItem = item;
    }
  }
  if( count === maxCount){
    itemsWithMaxCount.push(previousItem)
  }else if( count > maxCount ) {
    maxCount = count;
    itemsWithMaxCount = [item];  
  } 
  return [ maxCount, itemsWithMaxCount]
}



//returns array of indexes, if value is not in array returns []
function findIndexesofValue( value, Arr){
  let indexesFound =[];
  let searchStart = 0;
  do { let indexFound = Arr.indexOf( value, searchStart);
    if( indexFound !== -1) indexesFound.push(indexFound);
    searchStart = indexFound++
  } while ( searchStart !== 0);
}


// // check if subset is in the set
// function isSuperset(set, subset) {
//   for (let elem of subset) {
//     if (!set.has(elem)) {
//       return false;
//     }
//   }
//   return true;
// }


// const checkForWinner = (gameState) => {
//   // get array of box id's
//   // can't be a winner in less than 5 turns
//   if (gameState.length < 5) return 'No Winner Yet';
//   let pO = gameState.filter((item) => {
//     if (item.player == 2) return item;
//   });
//   pO = pO.map((item) => item.id);
//   let px = gameState.filter((item) => {
//     if (item.player == 1) return item;
//   });
//   px = px.map((item) => item.id);
//   if (p0 != null && px != null) {
//     var win0 = win.filter((item) => {
//       return isSuperset(new Set(p0), new Set(item));
//     });
//     var winX = win.filter((item) => {
//       return isSuperset(new Set(px), new Set(item));
//     });
//   }
//   if (win0.length > 0) return 'Player O ';
//   else if (winX.length > 0) return 'Player X ';
//   return 'No Winner Yet';
// };
const Game = () => {
  return (
    <div className="game">
      <Board></Board>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
