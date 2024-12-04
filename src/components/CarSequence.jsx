import styled from "styled-components"
import { useRef, useEffect } from "react"
import React from "react"
import { useNodeDimensions } from "ap-react-hooks"
//credit: https://dev.to/pipscript/creating-a-png-sequence-animation-using-react-and-scss-k71
// https://stackoverflow.com/questions/63190920/how-do-i-get-rid-of-flickering-image-and-clear-previous-canvas-result-using-canv

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

// number of images to be sequenced
const fps = 24 // based on 24fps for video

function ScrollSequence({ step, prevStepData, images }) {
  const [containerRef, { height, width }] = useNodeDimensions()
  const prevStep = useRef(-1)
  const isAnimating = useRef(false)

  const canvasRef = useRef(null)
  const requestId = useRef(null)

  // Step 3: Set up canvas
  const renderCanvas = () => {
    const context = canvasRef.current.getContext("2d")
    context.canvas.width = width
    context.canvas.height = height
  }

  // rescales the image so it's centered while maintaining its aspect ratio
  function drawImageScaled(img, ctx) {
    if (!img) return
    let canvas = ctx.canvas
    let hRatio = canvas.width / img.width
    let vRatio = canvas.height / img.height
    let ratio = Math.min(hRatio, vRatio)
    let centerShift_x = (canvas.width - img.width * ratio) / 2
    let centerShift_y = (canvas.height - img.height * ratio) / 2
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    )
  }

  // on mount, load the images and prepare the canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const { startFrame, endFrame, id } = step

    let start
    let end

    const forwards = id > prevStep.current

    if (forwards) {
      start = startFrame
      end = endFrame
    } else {
      end = prevStepData?.startFrame ?? 0
      start = prevStepData?.endFrame ?? 0
    }

    renderCanvas()
    const context = canvasRef.current.getContext("2d")

    const animate = (index) => {
      if ((forwards && index >= end) || (!forwards && index <= end)) return

      if (index === start) isAnimating.current = true
      if (index === (forwards ? end - 1 : end + 1)) isAnimating.current = false

      // draw image on the canvas
      context.clearRect(0, 0, width, height)
      drawImageScaled(images[index], context)

      setTimeout(() => {
        requestId.current = requestAnimationFrame(() =>
          animate(forwards ? index + 1 : index - 1)
        )
      }, 1000 / fps)
    }

    const stopAnimation = () => {
      // Cancel the ongoing animation frame request
      if (requestId.current) {
        cancelAllAnimationFrames()
        clearAllTimers()
        requestId.current = null
      }

      // Clear the canvas
      context.clearRect(0, 0, width, height)

      // Reset the animation state
      isAnimating.current = false
    }

    if (isAnimating.current) {
      // if an animation is already playing and another animation is requested
      // stop animating everything
      stopAnimation()
    } else {
      drawImageScaled(images[start], context)

      // start the animation
      requestId.current = requestAnimationFrame(() => animate(start))
    }

    // save the step in a ref as the previous step
    prevStep.current = id

    // cleanup by removing the request for animation
    return () => {
      stopAnimation()
    }
  }, [width, height, step, prevStepData])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="png-sequence-canvas"
        id="canvas"
      >
        {" "}
      </Canvas>
    </div>
  )
}

export default React.memo(ScrollSequence)

function cancelAllAnimationFrames() {
  var id = window.requestAnimationFrame(function () {})
  while (id--) {
    window.cancelAnimationFrame(id)
  }
}

function clearAllTimers() {
  var id = window.setTimeout(function () {}, 0)

  while (id--) {
    window.clearTimeout(id) // will do nothing if no timeout with id is present
  }
}
