import DisplayStep from "./DisplayStep"

const DisplayStepList = (props) => {
    return (
      <div className="displayStepList">
        {[...Array(props.step).keys()].map(s => <DisplayStep key={s} step={s} stepClick={props.stepClick} />)}
      </div>
    )
  }

export default DisplayStepList
