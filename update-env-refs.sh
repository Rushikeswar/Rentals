#!/bin/bash

FILES=$(find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \))

for file in $FILES; do
  if grep -q "import.meta.env.VITE_BACKEND_URL" "$file"; then
    echo "Updating $file"

    # Add import if not already present
    if ! grep -q "config/api" "$file"; then
      sed -i '1i import { API_URL } from "../config/api";' "$file"
    fi

    # Replace all occurrences
    sed -i 's/import\.meta\.env\.VITE_BACKEND_URL/API_URL/g' "$file"
  fi
done

echo "✅ All files updated."
