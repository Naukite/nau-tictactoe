import React, {useState} from "react";


const BoardEntry = (props) => {  
  return (
    <button id={props.entryKey} onClick={props.onEntryClick} disabled={props.disabled}>[ {props.value} ]</button>
  )
}

const BoardRow = (props) => {
  const boardEntries = []
  for (let j = 0; j < props.row.length; j++) {
    const entryKey = `${props.i}_${j}`
    boardEntries.push(<BoardEntry key={entryKey} entryKey={entryKey} i={props.i} j={j} 
                                  value={props.row[j]} onEntryClick={props.onEntryClick} disabled={props.disabled}/>)
  }
  return boardEntries
}

const DisplayPlayer = (props) => {
  return (
    <label>Current player: {props.player}</label>
  )
}

const DisplayWon = (props) => {
  return (
    <div style={{visibility: props.wonGame === true ? 'visible' : 'hidden'}}>
      <label>{`Player ${props.player} won!!...`}</label>
      <br/>
      <button onClick={props.restartClick}>Restart Game...</button>
    </div>      
  )
}

const DisplayStep = (props) => {
   return <button id={props.step} onClick={props.stepClick}>Go to step {props.step}</button>
 }


const DisplayStepList = (props) => {
  return [...Array(props.step).keys()].map(s => <DisplayStep key={s} step={s} stepClick={props.stepClick} />)
}

const useBoardState = (size) => {  
  const [state, setState] = useState({
    step: 1,
    player: 0,
    board: new BoardObject(size),
    wonGame: false
  })

  const setBoardState = (prevState, i, j, players) => {
    setState((prevState) => {
      const newBoard = prevState.board.clone()      
      const wonGame = newBoard.setValue(i, j, players[prevState.player])
      if (wonGame) {
        return {
          step: prevState.step,
          player: prevState.player,
          board: newBoard,
          wonGame: wonGame
        }
      }
      return {
        step: prevState.step + 1,
        player: (prevState.player + 1) % 2,
        board: newBoard,
        wonGame: wonGame
      }
    })
  }

  return [state, setBoardState]
}


const Board = (props) => {
  const players = ['X', 'O']
  const [boardState, setBoardState] = useBoardState(props.size)

  const handleEntryClick = (event) => {
    const coords = event.target.id.split("_")
    const i = parseInt(coords[0])
    const j = parseInt(coords[1])
    if (boardState.board.getValue(i, j)) {
      return
    }

    setBoardState(boardState, i, j, players)
  }

  const handleStepClick = (event) => {
    console.log(event.target.id)
  }

  const rowIndexes = [...Array(props.size).keys()]

  return(
    <React.Fragment>
      <DisplayPlayer player={players[boardState.player]} />
      <br/>      
      {
        rowIndexes.map(i => { return [<BoardRow key={i} i={i} row={boardState.board.getRow(i)} onEntryClick={handleEntryClick} 
                                                disabled={boardState.wonGame}/>,<br/>]})
      }
      <DisplayWon wonGame={boardState.wonGame} player={players[boardState.player]} restartClick={props.restartClick}/> 
      <br/><br/>
      <DisplayStepList step={boardState.step} stepClick={handleStepClick} />
    </React.Fragment>
  )
}

function App() {
  const [boardKey, setBoardKey] = useState(0)
  const handleRestartClick = () => {
      setBoardKey(boardKey + 1)
  }

  return (
    <React.Fragment>
      <Board key={boardKey} restartClick={handleRestartClick} size={3}/>      
    </React.Fragment>
  );
}

function BoardObject(size) {
  this.size = size
  this.board = []

  this.init = () => {
    for(let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push(null)
      }
      this.board.push(row)
    }
  }

  this.getRow = (i) => {
    return this.board[i]
  }

  this.getValue = (i, j) => {
    return (this.board[i])[j]
  }

  this.setValue = (i, j, value) => {
    this.board[i][j] = value
    if (this.checkRow(i, value) === true) {
      return true;
    } 
    if (this.checkColumn(j, value) === true) {
      return true;
    }     
    if (this.checkMainDiagonal(i, j, value) === true) {
      return true;
    }     
    if (this.checkReverseDiagonal(i, j, value) === true) {
      return true;
    }         
    return false;
  }

  this.checkRow = (i, value) => {
    for (let j = 0; j < this.board.length; j++) {
      if (this.board[i][j] !== value) {
        return false;
      }
    }
    return true;
  }

  this.checkColumn = (j, value) => {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i][j] !== value) {
        return false;
      }
    }
    return true;
  }

  this.checkMainDiagonal = (rowIndex, colIndex, value) => {
    if (rowIndex !== colIndex) {
      return false;
    }
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i][i] !== value) {
        return false;
      }
    }
    return true;
  }  

  this.checkReverseDiagonal = (rowIndex, colIndex, value) => {
    if ((rowIndex + colIndex) !== this.board.length - 1) {
      return false
    }
    for (let i = 0; i < this.board.length; i++) {
      let j = this.board.length - 1 - i;
      if (this.board[i][j] !== value) {
        return false;
      }
    }
    return true;
  }    

  this.clone = () => {
    const newBoard = new BoardObject(this.size)
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        newBoard.setValue(i, j, this.board[i][j])
      }
    }
    return newBoard;
  }

  this.init();
  return this;
}


export default App;
