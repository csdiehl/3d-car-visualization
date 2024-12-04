#!/bin/bash
folder_path="./raw_photos"

# remove spaces
# for f in *\ *; do mv "$f" "${f// /_}"; done

# Iterate through all files in the folder
for file in "$folder_path"/*
do
    if [ -f "$file" ]; then
        # Perform actions on each file
        echo "Processing file: $file"
        # Add your custom commands here
        yarn prep-image $file sizes=[2000]
    fi
done

