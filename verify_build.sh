#!/bin/bash
echo "🦫 Timber Money Build Verification"
echo "===================================="
echo ""

echo "✅ 1. Checking mascot assets..."
if [ -f "client/public/mascot/timber-animated.svg" ]; then
  echo "   ✓ Mascot assets present"
else
  echo "   ✗ Mascot assets missing"
fi

echo ""
echo "✅ 2. Checking new components..."
components=(
  "client/src/components/TimberChatSidebar.tsx"
  "client/src/components/TimberOverview.tsx"
  "client/src/components/TimberTips.tsx"
  "client/src/components/DocumentList.tsx"
  "client/src/components/LegalDisclaimer.tsx"
)

for comp in "${components[@]}"; do
  if [ -f "$comp" ]; then
    echo "   ✓ $(basename $comp)"
  else
    echo "   ✗ $(basename $comp) missing"
  fi
done

echo ""
echo "✅ 3. Checking backend updates..."
if grep -q "Timber the Beaver" server/openai.ts; then
  echo "   ✓ AI prompts updated with Timber persona"
else
  echo "   ✗ AI prompts not updated"
fi

echo ""
echo "✅ 4. Checking database seeder..."
if [ -f "seed_timber_data.py" ]; then
  echo "   ✓ Database seeder script present"
else
  echo "   ✗ Database seeder missing"
fi

echo ""
echo "✅ 5. Checking color scheme..."
if grep -q "timber-green" client/src/index.css; then
  echo "   ✓ Timber color scheme added"
else
  echo "   ✗ Color scheme not updated"
fi

echo ""
echo "✅ 6. Checking landing page updates..."
if grep -q "Timber Money" client/src/pages/Landing.tsx; then
  echo "   ✓ Landing page updated with Timber branding"
else
  echo "   ✗ Landing page not updated"
fi

echo ""
echo "✅ 7. Checking dashboard integration..."
if grep -q "TimberOverview" client/src/pages/Dashboard.tsx; then
  echo "   ✓ Dashboard integrated with Timber components"
else
  echo "   ✗ Dashboard not updated"
fi

echo ""
echo "===================================="
echo "Build verification complete! 🦫"
