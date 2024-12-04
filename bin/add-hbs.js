const fs = require("fs")
const path = require("path")

// Function to update HTML files
function updateHTMLFiles(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error reading file stats:", filePath, err)
          return
        }
        if (stats.isDirectory()) {
          updateHTMLFiles(filePath) // Recursively process subfolders
        } else if (path.extname(file) === ".html") {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading file:", filePath, err)
              return
            }

            // Update HTML content
            const updatedContent = data.replace(
              /<\/head>/i,
              "{{combined-head-scripts}}</head>",
            )

            // Write updated content back to the file
            fs.writeFile(filePath, updatedContent, "utf8", (err) => {
              if (err) {
                console.error("Error writing file:", filePath, err)
                return
              }
              console.log("File updated:", filePath)
            })
          })
        }
      })
    })
  })
}

// Accept folder path as a command-line argument
const folderPath = process.argv[2]
if (!folderPath) {
  console.error("Please provide the folder path as an argument.")
  process.exit(1)
}

// Run the function with the provided folder path
updateHTMLFiles(folderPath)