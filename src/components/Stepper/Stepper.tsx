import React from 'react'
import './Stepper.css'

interface Props {
  options: string[]
  currentIndex: number
}

const Stepper = ({ options, currentIndex }: Props) => {
  return (
    <div id="mainCont">
      <div id="stepperMain">
        {options.map((val, i) => {
          const checkNormal = (
            <>
              <div className="stepperCircle">
                <img src="/images/checked.svg" alt="check" height="30" width="30" />
              </div>
              <div className="stepper-Bridge" />
            </>
          )

          const checkLast = (
            <div className="stepperCircle">
              <img src="/images/checked.svg" alt="check" height="30" width="30" />
            </div>
          )

          const dotLast = (
            <div className="stepperCircleInactive">
              <div className="stepper-Bridge-Half" />
              <div className="blueDot" />
            </div>
          )

          const dotNormal = (
            <>
              <div className="stepperCircleInactiveNormal">
                <div className="stepper-Bridge" />
                <div className="blueDotNormal" />
              </div>
              <div className="stepper-Bridge" />
            </>
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
            return <div className="textCont">{val}</div>
          } else {
            return (
              <>
                <div className="textCont">{val}</div>
                <div className="divmargin" />
              </>
            )
          }
        })}
      </div>
    </div>
  )
}

export default Stepper
