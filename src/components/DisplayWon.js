const DisplayWon = (props) => {
    return (
      <div style={{visibility: props.wonGame === true ? 'visible' : 'hidden'}}>
        <label>{`Player ${props.player} won!!...`}</label>
        <br/>
        <button onClick={props.restartClick}>Restart Game...</button>
      </div>      
    )
  }

export default DisplayWon
