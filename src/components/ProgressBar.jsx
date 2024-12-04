import React from "react"
import styled from "styled-components"

const gap = 8
const Container = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 48px;
  left: 50%;
  transform: translate(-50%);
  width: 100%;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  grid-area: scroll;
  gap: ${gap}px;

  @media (max-width: 728px) {
    bottom: 8px;
  }
`

const ProgressBar = ({ progress }) => {
  return (
    <Container id="progress-bar">
      <p>Scroll</p>
      <div
        style={{
          height: "1px",
          width: "100%",
          background: "#4b4b4b",
          transform: `translateY(${gap + 3}px)`,
        }}
      ></div>
      <div
        style={{
          height: "4px",
          width: `100%`,
          background: "#84c2a7",
          borderRadius: "10px",
          transform: `scaleX(${progress.toFixed(2)})`,
        }}
      ></div>
      <img
        src={"./arrow-down-solid.svg"}
        height={24}
        width={24}
        alt="down arrow"
      />
    </Container>
  )
}

export default ProgressBar
