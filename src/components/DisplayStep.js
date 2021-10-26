const DisplayStep = (props) => {
    return <button id={props.step} onClick={props.stepClick}>Go to step {props.step}</button>
  }

export default DisplayStep
