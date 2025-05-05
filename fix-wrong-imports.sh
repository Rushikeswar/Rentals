#!/bin/bash

# Set the variable you want to check for duplicates
VARIABLE_NAME='import { API_URL } from "../../src/config/api";'

# Search for files where the variable is declared more than once
FILES=$(find frontend/components -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \))

# Loop through each file
for file in $FILES; do
  # Check if the variable is declared more than once in the file
  declare_count=$(grep -o -E "\b$VARIABLE_NAME\b" "$file" | wc -l)

  # If the variable appears more than once, we will flag it
  if [ "$declare_count" -gt 1 ]; then
    echo "Multiple declarations found in $file"
    
    # Show the lines where the variable is declared
    grep -n -E "\b$VARIABLE_NAME\b" "$file"
  fi
done
