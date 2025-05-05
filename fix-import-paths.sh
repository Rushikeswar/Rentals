#!/bin/bash

FILES=$(find frontend/components -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \))

for file in $FILES; do
  if grep -q 'from "src/config/api' "$file"; then
    echo "Fixing $file"

    # Count how deep the file is inside frontend/components/
    depth=$(awk -F"/" '{print NF-2}' <<< "$file")  # subtract 2 for "frontend/components"

    # Build correct path
    path_to_root=""
    for ((i=0; i<depth; i++)); do
      path_to_root+="../"
    done

    new_path="${path_to_root}../../src/config/api"

    # Replace the incorrect import path
    sed -i "s|from \"src/config/api\"|from \"$new_path\"|g" "$file"
  fi
done

echo "✅ Fixed all import paths to src/config/api"
