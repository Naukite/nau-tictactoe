const BoardEntry = (props) => {  
    return (
      <button id={props.entryKey} onClick={props.onEntryClick} disabled={props.disabled}>[ {props.value} ]</button>
    )
  }

export default BoardEntry
