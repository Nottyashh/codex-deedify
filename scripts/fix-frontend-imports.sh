#!/bin/bash

# Fix Frontend Import Paths Script
# This script fixes all @/ import paths to use relative paths

echo "🔧 Fixing frontend import paths..."

cd frontend

# Fix all @/components imports to relative paths
echo "📁 Fixing component imports..."

# Fix layout.tsx
sed -i '' 's|@/components/|../components/|g' app/layout.tsx

# Fix all page files
for file in app/**/*.tsx; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    sed -i '' 's|@/components/|../components/|g' "$file"
    sed -i '' 's|@/lib/|../lib/|g' "$file"
    sed -i '' 's|@/types/|../types/|g' "$file"
  fi
done

# Fix component files
for file in components/**/*.tsx; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    sed -i '' 's|@/lib/|../lib/|g' "$file"
    sed -i '' 's|@/types/|../types/|g' "$file"
  fi
done

# Fix lib files
for file in lib/**/*.ts; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    sed -i '' 's|@/types/|../types/|g' "$file"
  fi
done

echo "✅ All import paths fixed!"
echo ""
echo "🎯 Summary:"
echo "✅ Fixed @/components/ imports"
echo "✅ Fixed @/lib/ imports"
echo "✅ Fixed @/types/ imports"
echo "✅ Updated all .tsx and .ts files"
echo ""
echo "🚀 Try running 'pnpm dev:frontend' now!"