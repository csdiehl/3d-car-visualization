import styled, { keyframes } from "styled-components"

const tablet = "768px"
const mobile = "425px"

const Background = styled.div`
  background: #000;
  height: 100vh;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    background: black;
  }
`

const Grid = styled.div`
  position: relative;
  background: none;
  height: 100vh;
  width: 100%;
  transition: background 500ms ease-in;
  margin: 0 auto;
  max-width: 1600px;
  overflow-y: clip;
`

const FloatText = styled.div<{ progress: number }>`
  position: relative;
  grid-area: text;
  opacity: ${(props) => (props.progress < 0.5 ? props.progress : 1)};
  transform: translateY(${(props) => 100 + -props.progress * 100}px);
`

const PhotoWrapper = styled.div<{
  aspectRatio: number
  progress: number
  step: number
}>`
  width: 100%;
  aspect-ratio: ${(props) => props.aspectRatio};
  position: relative;
  object-fit: contain;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(${(props) => 1 + props.progress * 0.1});
  transition: transform 200ms linear;
`

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`

const InfoBox = styled.div`
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  max-width: 300px;
  padding: 8px;
  height: 100vh;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 300px 1fr;
  grid-template-areas: "text" "fuel";

  @media (max-width: ${tablet}) {
    height: auto;
    max-width: 100%;
    width: 100%;
    grid-template-columns: 1fr minmax(240px, 300px);
    grid-template-rows: 1fr;
    grid-template-areas: "text fuel";
  }

  @media (max-width: ${mobile}) {
    height: 100vh;
    width: 100%;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 200px 1fr 300px;
    grid-template-areas: "text" "." "fuel";
  }
`
export { Background, Grid, PhotoWrapper, FloatText, Loader, InfoBox }
