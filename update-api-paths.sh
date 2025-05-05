#!/bin/bash

FILES=$(find frontend/components -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \))

for file in $FILES; do
  if grep -q "import.meta.env.VITE_BACKEND_URL" "$file"; then
    echo "Updating $file"

    # Count how deep the file is, to build correct relative path
    depth=$(awk -F"/" '{print NF-1}' <<< "$file")
    path_to_root=""
    for ((i=0; i<depth-2; i++)); do
      path_to_root+="../"
    done

    # Build final import path
    import_path="${path_to_root}src/config/api"

    # Add import if not already there
    if ! grep -q "config/api" "$file"; then
      sed -i "1i import { API_URL } from \"$import_path\";" "$file"
    fi

    # Replace all env usages
    sed -i 's/import\.meta\.env\.VITE_BACKEND_URL/API_URL/g' "$file"
  fi
done

echo "✅ All frontend/components/* files updated."
