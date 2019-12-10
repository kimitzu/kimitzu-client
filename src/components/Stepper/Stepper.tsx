import React from 'react'
import './Stepper.css'

interface Props {
  options: string[]
  currentIndex: number
}

const Stepper = ({ options, currentIndex }: Props) => {
  return (
    <div id="mainCont" className="uk-width-1-1">
      <div id="stepperMain">
        {options.map((val, i) => {
          const checkNormal = (
            <React.Fragment key={val}>
              <div className="stepperCircle">
                <img src="/images/checked.svg" alt="check" height="30" width="30" />
              </div>
              <div className="stepper-Bridge" />
            </React.Fragment>
          )

          const checkLast = (
            <div className="stepperCircle" key={val}>
              <img src="/images/checked.svg" alt="check" height="30" width="30" />
            </div>
          )

          const dotLast = (
            <div key={val} className="stepperCircleInactive">
              <div className="stepper-Bridge-Half" />
              <div className="blueDot" />
            </div>
          )

          const dotNormal = (
            <React.Fragment key={val}>
              <div className="stepperCircleInactiveNormal">
                <div className="stepper-Bridge" />
                <div className="blueDotNormal" />
              </div>
              <div className="stepper-Bridge" />
            </React.Fragment>
          )

          let render

          if (i > currentIndex) {
            render = {
              n: dotNormal,
              l: dotLast,
            }
          } else {
            render = {
              n: checkNormal,
              l: checkLast,
            }
          }

          if (i === options.length - 1) {
            return render.l
          } else {
            return render.n
          }
        })}
      </div>
      <div id="contentContainerMain">
        {options.map((val, i) => {
          if (i === options.length - 1) {
            return (
              <div key={val} className="textCont uk-text-uppercase">
                {val}
              </div>
            )
          } else {
            return (
              <React.Fragment key={val}>
                <div className="textCont uk-text-uppercase">{val}</div>
                <div className="divmargin" />
              </React.Fragment>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Stepper
