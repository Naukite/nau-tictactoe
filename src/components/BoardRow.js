import React from 'react'
import BoardEntry from './BoardEntry'

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

export default BoardRow
