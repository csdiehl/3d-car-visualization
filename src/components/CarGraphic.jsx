import React, { useState, useEffect, useRef } from "react"
import { Scroller } from "ap-react-components"
import { Body } from "@apdata/core/typography"
import FuelGauge from "./FuelGauge.jsx"
import CarLabel from "./CarLabel"
import CarSequence from "./CarSequence"
import { useNodeDimensions } from "ap-react-hooks"
import ProgressBar from "./ProgressBar"
import { labels, tabletLabels } from "./labels.js"
import {
  Background,
  Grid,
  PhotoWrapper,
  FloatText,
  Loader,
  InfoBox,
} from "./CarStyles.ts"

const scrollSteps = [
  {
    id: "1",
    content: <div id="invisible-step"></div>,
  },
  {
    id: "2",
    content: <div id="invisible-step"></div>,
  },
  {
    id: "3",
    content: <div id="invisible-step"></div>,
  },
  {
    id: "4",
    content: <div id="invisible-step"></div>,
  },
]

const content = [
  {
    id: 1,
    text: (
      <Body style={{ padding: "0 16px" }} key={1}>
        A little-known fact: Most of your car's gasoline gets wasted.
      </Body>
    ),
    startFrame: 0,
    endFrame: 1,
  },
  {
    id: 2,
    text: (
      <Body style={{ padding: "0 16px" }} key={2}>
        Some 80% of the gasoline you put in your car ends up being wasted,
        mostly as heat. It doesn't actually go to moving your car forward.
      </Body>
    ),
    startFrame: 1,
    endFrame: 25,
  },
  {
    id: 3,
    text: (
      <Body style={{ padding: "0 16px" }} key={3}>
        Tailpipe exhaust from burning gasoline contributes in a major way to
        climate change.
      </Body>
    ),
    startFrame: 25,
    endFrame: 50,
  },
  {
    id: 4,
    text: (
      <Body style={{ padding: "0 16px" }} key={4}>
        Even at its peak efficiency, only 20% to 25% of the energy in your gas
        goes to wheels, accessories or other useful functions, such as power
        steering
      </Body>
    ),
    startFrame: 50,
    endFrame: 75,
  },
]

const numFrames = 100
const S3 = "https://s3.amazonaws.com/data.ap.org/projects/2024/car-energy/"
// const mobilePath = `${S3}mobile/Engine Effieincy 09_RS Camera_1_c_1080x1920_`
const photoPath = `${S3}square/Engine Effieincy 11_RS Camera_1_a_1080x1080_`
// const widePhotoPath = `${S3}wide/Engine Effieincy 09_RS Camera_1_a_1920x1080_`

// Engine Effieincy 09_RS Camera_1_c_00000
// Generates the filename of the image based on the current index
const getCurrentFrame = (index) => {
  const path = photoPath
  return `${path}${index.toString().padStart(5, "0")}.webp`
}

const binWidth = (width) => (width === 0 || !width ? null : "square")

const CarGraphic = () => {
  const [currentStepProgress, setCurrentStepProgress] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [ref, { width }] = useNodeDimensions()
  const prevWidth = useRef(null)
  const currentSize = binWidth(width)

  const [images, setImages] = useState([])

  const [counter, setCounter] = useState(0)

  const imagesLoaded = counter >= numFrames

  const currentContent = content[currentStep - 1]

  function checkIfImagesLoaded() {
    setCounter((prev) => prev + 1)
  }

  useEffect(() => {
    // if (counter > 0) return // so that we don't preload images every time one loads

    function preloadImages(size) {
      for (let i = 1; i <= numFrames; i++) {
        const img = new Image()
        const imgSrc = getCurrentFrame(i, size)
        img.src = imgSrc
        img.onload = checkIfImagesLoaded

        setImages((prev) => [...prev, img])
      }
    }

    const prevSize = binWidth(prevWidth.current)

    if (prevSize !== currentSize) {
      preloadImages(currentSize)
    }

    prevWidth.current = width
  }, [counter, width, currentSize])

  const pctLoaded = ((counter / numFrames) * 100).toFixed(0)

  return (
    <Scroller
      steps={scrollSteps}
      onStepChange={(step) => setCurrentStep(step === 0 ? 1 : step)}
      onStepProgress={setCurrentStepProgress}
      startOnFirstStep
    >
      <Background currentStep={currentStep}>
        {!imagesLoaded && (
          <Loader id="loader">
            Loading... {pctLoaded}%
            <div
              style={{
                height: "4px",
                background: "#FFF",
                width: `${(pctLoaded / 100) * 350}px`,
              }}
            ></div>
          </Loader>
        )}
        <Grid ref={ref}>
          <InfoBox>
            <FloatText
              progress={+currentStepProgress?.toFixed(2)}
              key={currentStep}
            >
              {currentContent?.text}
            </FloatText>
            <FuelGauge
              orient={width <= 425 ? "mobile" : "desktop"}
              step={+currentStep}
            />
          </InfoBox>

          <PhotoWrapper
            step={currentStep}
            progress={+currentStepProgress?.toFixed(2)}
            aspectRatio={1}
          >
            {imagesLoaded && (
              <CarSequence
                prevStepData={content[currentStep]}
                step={currentContent}
                images={images}
              />
            )}

            {width > 425 &&
              (width > 768
                ? labels.map((label) => (
                    <CarLabel
                      key={label.text}
                      show={label.slide === +currentStep}
                      {...label}
                    />
                  ))
                : tabletLabels.map((label) => (
                    <CarLabel
                      key={label.text}
                      show={label.slide === +currentStep}
                      {...label}
                    />
                  )))}
          </PhotoWrapper>
        </Grid>
        {currentStepProgress && imagesLoaded && (
          <ProgressBar progress={currentStepProgress} />
        )}
      </Background>
    </Scroller>
  )
}

export default CarGraphic
