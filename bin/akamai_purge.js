const EdgeGrid = require("akamai-edgegrid")
const fs = require("fs")
const path = require("path")

// This script is run by Gitlab CI after deployments in order to bust cache

const domain = process.argv[2] // Get the domain argument
const buildFolder = process.argv[3] || "public" // Get the build folder argument, defaulting to "public" if not provided

if (!domain) {
  console.error("Please provide a domain.")
  process.exit(1)
}

if (!buildFolder) {
  console.error("Please provide a build folder to deploy.")
  process.exit(1)
}

const eg = new EdgeGrid(
  process.env.AKAMAI_CLIENT_TOKEN,
  process.env.AKAMAI_CLIENT_SECRET,
  process.env.AKAMAI_ACCESS_TOKEN,
  process.env.AKAMAI_HOST,
)

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach((file) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walk(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file))
  })
  return filelist
}

const excludedExtensions = /\.(webp|jpg|avif|mp4|webm)$/

let files = walk(buildFolder)
  .map((file) => {
    const filePath = file.replace(new RegExp(`^${buildFolder}/`), "")
    const url = `https://${domain}/features/2023/${process.env.CI_PROJECT_NAME}/${filePath}` // Use the domain argument

    // No need to bust cache on image files
    if (!excludedExtensions.test(filePath)) {
      return url
    }

    return null
  })
  .filter(Boolean)

// bust interactives.ap.org/stuff/ in addition to /stuff/index.html
const pageUrls = files
  .filter((url) => url.endsWith("index.html"))
  .map((url) => url.replace(/\/index\.html$/, "/"))

files.push(...pageUrls)

const MAX_BATCH_SIZE = 250
for (let i = 0; i < files.length; i += MAX_BATCH_SIZE) {
  const batch = files.slice(i, i + MAX_BATCH_SIZE)
  const requestBody = { objects: batch }
  console.log(batch)

  eg.auth({
    path: "/ccu/v3/invalidate/url",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  })

  eg.send((error, response, body) => {
    console.log(body)
    if (error) {
      console.log("error", error)
    }
  })
}
