import React, { useState } from 'react'
import DisplayPlayer from './DisplayPlayer'
import DisplayWon from './DisplayWon'
import BoardRow from './BoardRow'
import DisplayStepList from './DisplayStepList'
import BoardObject from '../lib/BoardObject'

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
    return (
        <React.Fragment>
            <DisplayPlayer player={players[currentState.player]} />
            <br />
            {
                rowIndexes.map(i => {
                    return <BoardRow key={i} i={i} row={currentState.board.getRow(i)} onEntryClick={handleEntryClick}
                        disabled={currentState.wonGame} />
                })
            }
            <DisplayWon wonGame={currentState.wonGame} player={players[currentState.player]} restartClick={props.restartClick} />
            <br /><br />
            <DisplayStepList step={currentState.step} stepClick={handleStepClick} />
        </React.Fragment>
    )
}

export default Board
