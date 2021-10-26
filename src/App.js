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
  return (
    <div>
      {boardEntries}
    </div>
  )
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
  const stateObject = {
    step: 1,
    player: 0,
    board: new BoardObject(size),
    wonGame: false
  }

  const [state, setState] = useState({
    history: [stateObject]
  })

  const setBoardState = (prevState, i, j, players) => {
    setState((prevState) => {
      const lastState = prevState.history[prevState.history.length - 1]
      const lastStep = lastState.step
      const lastPlayer = lastState.player
      const newBoard = lastState.board.clone()            
      const wonGame = newBoard.setValue(i, j, players[lastState.player])
      const newHistory = [...prevState.history]      
      if (wonGame) {
        newHistory.push({
          step: lastStep,
          player: lastPlayer,
          board: newBoard,
          wonGame: wonGame
        })
        return {
          history: newHistory
        }
      }
      newHistory.push({
        step: lastStep + 1,
        player: (lastPlayer + 1) % 2,
        board: newBoard,
        wonGame: wonGame
      })
      return {
        history: newHistory
      }
    })
  }

  const jumpToState = (stateIndex) => {
    setState(() => {
      const newHistory = []
      for (let i = 0; i <= stateIndex; i++) {
        newHistory.push(state.history[i])
      }
      return {
        history: newHistory
      }      
    })
  }

  return [state, setBoardState, jumpToState]
}


const Board = (props) => {
  const players = ['X', 'O']
  const [boardState, setBoardState, jumpToState] = useBoardState(props.size)

  const handleEntryClick = (event) => {
    const coords = event.target.id.split("_")
    const i = parseInt(coords[0])
    const j = parseInt(coords[1])    
    const lastState = boardState.history[boardState.history.length - 1]
    if (lastState.board.getValue(i, j)) {
      return
    }

    setBoardState(lastState, i, j, players)
  }

  const handleStepClick = (event) => {  
    jumpToState(parseInt(event.target.id))    
  }

  const rowIndexes = [...Array(props.size).keys()]
  const currentState = boardState.history[boardState.history.length - 1]
  return(
    <React.Fragment>
      <DisplayPlayer player={players[currentState.player]} />
      <br/>      
      {
        rowIndexes.map(i => { return <BoardRow key={i} i={i} row={currentState.board.getRow(i)} onEntryClick={handleEntryClick} 
                                                disabled={currentState.wonGame}/>})
      }
      <DisplayWon wonGame={currentState.wonGame} player={players[currentState.player]} restartClick={props.restartClick}/> 
      <br/><br/>
      <DisplayStepList step={currentState.step} stepClick={handleStepClick} />
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
