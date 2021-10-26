import React, {useState} from "react"
import Board from './Board'

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

export default App;
