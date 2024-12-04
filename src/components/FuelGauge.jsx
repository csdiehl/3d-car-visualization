import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { arc, pie } from "d3-shape"
import { select } from "d3-selection"
import "d3-transition"
import { useNodeDimensions } from "ap-react-hooks"

const Wrapper = styled.div`
  position: relative;
  height: 240px;
  align-self: start; /* grid property */
  grid-area: fuel;

  @media (max-width: 425px) {
    height: 200px;
  }
`

const ChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
`
const Number = styled.h2`
  color: #fff;
  font-family: "AP";
  font-size: 6rem;
  font-style: normal;
  font-weight: 272;
  line-height: 6rem; /* 100% */

  @media (max-width: 768px) {
    font-size: 4rem;
    line-height: 4rem;
  }

  @media (max-width: 425px) {
    font-size: 2rem;
    line-height: 2rem;
  }
`

const Subhead = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-family: "AP";
  font-size: 32px;
  font-style: normal;
  font-weight: 170;
  line-height: 32px; /* 100% */
`

const labels = [
  {
    value: 0,
    label: "wasted",
  },
  {
    value: 80,
    label: "wasted",
  },
  {
    value: 80,
    label: "wasted",
  },
  {
    value: 20,
    label: "useful",
  },
]

const FuelGauge = ({ step, orient = "desktop" }) => {
  const [value, setValue] = useState(0)
  const prev = useRef(0)
  const svgRef = useRef(null)
  const [chartRef, { width }] = useNodeDimensions()
  const newValue = labels[step - 1].value
  const breaks = [newValue, 100 - newValue]

  const height = orient === "mobile" ? 200 : 240

  useEffect(() => {
    if (!width) return

    const R = Math.min(width, height) / 2
    const svg = select(svgRef.current)
    const start = -Math.PI,
      end = 0

    const layout = pie().startAngle(start).endAngle(end).padAngle(0.03)

    svg
      .selectAll(".break")
      .data(layout(breaks))
      .attr("transform", `translate(${8}, ${R})`)
      .attr("fill-opacity", (d, i) => (i === 0 ? 0.9 : 0.2))
      .attr("d", (d) =>
        arc()({
          innerRadius: R - 16,
          outerRadius: R - 8,
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: d.padAngle,
        })
      )
  }, [width, breaks])

  useEffect(() => {
    const { current: prevValue } = prev

    if (newValue === prevValue) {
      //return
    } else if (newValue > prevValue) {
      let incrementValue = prevValue

      for (let i = prevValue; i <= newValue; i++) {
        setTimeout(
          () => {
            setValue(incrementValue)
            incrementValue++ // Increment the value inside the setTimeout callback
          },
          20 * (i - prevValue)
        )
      }
    } else {
      let decrementValue = prevValue
      for (let i = prevValue; i >= newValue; i--) {
        setTimeout(
          () => {
            setValue(decrementValue)
            decrementValue-- // Decrement the value inside the setTimeout callback
          },
          20 * (prevValue - i)
        )
      }
    }

    prev.current = newValue
  }, [step, newValue])
  return (
    <Wrapper>
      <ChartWrapper ref={chartRef}>
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 79 ${height}`}
          fill="none"
        >
          {breaks.map((d, i) => {
            return (
              <path
                key={d}
                class="break"
                fill={i === 0 ? (d === 20 ? "#84c2a7" : "orange") : "#FBFBFB"}
              />
            )
          })}
        </svg>
      </ChartWrapper>
      <Container>
        {step >= 1 && (
          <>
            <Number>{value}%</Number>
            <Subhead>{labels[step - 1].label}</Subhead>
          </>
        )}
      </Container>
    </Wrapper>
  )
}

export default FuelGauge
