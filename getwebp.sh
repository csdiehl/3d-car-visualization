#!/bin/bash

# Define the source directory where .webp files are located
source_dir="./raw_photos"

# Define the destination directory where files will be moved to
destination_dir="./public/animation"

# Create the destination directory if it doesn't exist
mkdir -p "$destination_dir"

# Find all directories in the source directory
find "$source_dir" -type d | while IFS= read -r dir; do
    # Check if the directory contains a file named "2000.webp"
    if [ -f "$dir/2000.webp" ]; then
        # Move the file to the destination directory with a new name
        new_filename=$(basename -- "$dir")"_2000.webp"
        mv "$dir/2000.webp" "$destination_dir/$new_filename"
        echo "Moved $dir/2000.webp to $destination_dir/$new_filename"
    fi
done

echo "File move complete."
