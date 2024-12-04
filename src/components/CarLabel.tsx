import React from "react"
import styled from "styled-components"

const baseWidth = "96px"
const delay = "1.2s"

const Container = styled.div<{
  x: number
  y: number
  align: string
  offset: number
  $show: boolean
}>`
  position: absolute;
  bottom: calc(50% + ${(props) => props.y}%);
  left: calc(50% + ${(props) => props.x}%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) =>
    props.align === "right" ? "flex-end" : "flex-start"};
  gap: 4px;
  width: ${(props) => props.offset}%;

  .label-content {
    opacity: ${(props) => (props.$show ? 1 : 0)};
    transition: opacity 0.5s ease-in-out ${delay};
  }
`

const Number = styled.h3`
  color: #fff;
  font-size: 2rem;
  font-weight: 170;
  line-height: 75%;

  @media (max-width: 425px) {
    font-size: 1rem;
    line-height: 0.75rem;
  }
`

const Label = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 170;
  line-height: 24px; /* 150% */
`

const Chart = styled.div<{ height?: number; width?: string }>`
  position: relative;
  height: ${(props) => props.height ?? 4}px;
  width: ${(props) => props.width ?? "100%"};
`

const Indicator = styled.div<{
  height?: number
  width?: string
  $show: boolean
  align: string
}>`
  position: relative;
  height: ${(props) => props.height ?? 4}px;
  width: ${(props) => props.width ?? "100%"};

  .indicator-line {
    transform: scaleX(${(props) => (props.$show ? 100 : 0)}%);
    transform-origin: ${(props) => (props.align === "left" ? "right" : "left")};
    transition: transform 0.5s ease-in-out ${delay};
  }
`

const absolute = `
position: absolute;
left: 0;
`

const Line = styled.div<{ color?: string }>`
  ${absolute}
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  background: ${(props) => props.color ?? "#4b4b4b"};
  width: 100%;
`

const Bar = styled.div<{ align: string; color: string }>`
  position: absolute;
  ${(props) => (props.align === "left" ? "left:0" : "right:0")};
  top: 0;
  height: 4px;
  border-radius: 10px;
  background: ${(props) => props.color};
  width: 50%;
`

const Circle = styled.div<{ align: string }>`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: #d9d9d9;
  position: absolute;
  ${(props) => (props.align === "right" ? "left:0" : "right:0")};
`

interface LabelProps {
  x: number // % from the center
  y: number
  align?: "left" | "right"
  offset: number // distance of the label
  value: string
  text?: string
  show: boolean
  alignTop: boolean
}

const CarLabel = ({
  x,
  y,
  align = "left",
  offset = 20,
  value,
  text = "",
  show = true,
  alignTop = false,
}: LabelProps) => {
  const color =
    text.toLowerCase() === "engine" || text.toLowerCase() === "drivetrain"
      ? "orange"
      : "#84c2a7"

  return (
    <Container $show={show} offset={offset} align={align} x={x} y={y}>
      {alignTop && (
        <Indicator $show={show} align={align} height={20}>
          <Line className="indicator-line" color="#d9d9d9" />
          <Circle
            style={{
              opacity: show ? 1 : 0,
              transition: `opacity 200ms linear ${delay}`,
            }}
            align={align}
          />
        </Indicator>
      )}
      <Number className="label-content">{value}</Number>
      <Label className="label-content">{text}</Label>
      <Chart className="label-content" width={baseWidth}>
        <Line />
        <Bar color={color} align={align} />
      </Chart>
      {!alignTop && (
        <Indicator $show={show} align={align} height={20}>
          <Line className="indicator-line" color="#d9d9d9" />
          <Circle
            style={{
              opacity: show ? 1 : 0,
              transition: `opacity 200ms linear ${delay}`,
            }}
            align={align}
          />
        </Indicator>
      )}
    </Container>
  )
}

export default CarLabel
