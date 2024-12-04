import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

const SocialList = styled.ul`
  list-style: none;
  display: flex;
  gap: 8px;
  margin: 0 auto;
  padding: 0;
`

const Button = styled.button`
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  height: 36px;
  width: 36px;
  transition: background 200ms ease-in;

  &:hover {
    background: #aaa;
  }
`

const shareToTwitter = async (message) => {
  const text = encodeURIComponent(message)
  const twitterUrl = `https://x.com/intent/post?text=${text}&url=${window.location.href}`
  window.open(twitterUrl, "_blank")
}

const shareOnFacebook = () => {
  const appId = "870613919693099"
  const shareURL = encodeURIComponent(window.location.href)

  // for testing locally
  /*
  const qa =
    "https://interactives-qa.ap.org/olympics-2024-viz/visuals/olympic-athletes.html"
  */

  const fbUrl = `https://www.facebook.com/dialog/share?app_id=${appId}&display=popup&href=${shareURL}`

  window.open(fbUrl, "_blank")
}

const SocialButtons = ({
  twitterMessage = "",
  emailMessage = "",
  linkedinTitle = "",
  linkedinSummary = "",
}) => {
  const socialItems = [
    {
      service: "twitter",
      action: () => shareToTwitter(twitterMessage),
    },
    {
      service: "facebook",
      action: () => shareOnFacebook(),
    },
  ]
  return (
    <SocialList>
      {socialItems.map((item, i) => (
        <li key={i}>
          <Button onClick={item.action} style={{ padding: 0 }}>
            <img
              height="16"
              width="16"
              src={`./${item.service}.svg`}
              alt={`share to ${item.service}`}
            ></img>
          </Button>
        </li>
      ))}
      <li>
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://www.linkedin.com/shareArticle?url=${window.location.href}&title=${linkedinTitle}&summary=${linkedinSummary}&source=${window.location.href}`}
        >
          <Button>
            {" "}
            <img
              height="16"
              width="16"
              src="./linkedin.svg"
              alt="share to linkedin"
            ></img>
          </Button>
        </a>
      </li>
      <li>
        <a
          rel="noreferrer"
          target="_blank"
          href={`mailto:?subject=${
            emailMessage ?? "check out this article!"
          }&body=${window.location.href}`}
        >
          <Button>
            <img
              height="16"
              width="16"
              src="./envelope-solid.svg"
              alt="share to email"
            ></img>
          </Button>
        </a>
      </li>
    </SocialList>
  )
}

SocialButtons.propTypes = {
  twitterMessage: PropTypes.string,
  emailMessage: PropTypes.string,
  linkedinSummary: PropTypes.string,
  linkedinTitle: PropTypes.string,
}

export default SocialButtons
