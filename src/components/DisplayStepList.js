import DisplayStep from "./DisplayStep"

const DisplayStepList = (props) => {
    return [...Array(props.step).keys()].map(s => <DisplayStep key={s} step={s} stepClick={props.stepClick} />)
  }

export default DisplayStepList
