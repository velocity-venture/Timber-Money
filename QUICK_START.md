# 🦫 Timber Money - Quick Start Guide

## Get Started in 3 Steps

### Step 1: Install Dependencies (if not already done)

```bash
cd /home/ubuntu/Timber-Money
npm install
```

### Step 2: Seed Test Data

```bash
python3 seed_timber_data.py
```

This creates 3 test users:
- **avalanche@timbermoney.test** - High credit card debt
- **snowball@timbermoney.test** - Multiple small loans  
- **healthy@timbermoney.test** - High savings, many documents

### Step 3: Run the Application

```bash
npm run dev
```

Visit `http://localhost:5000` and log in with one of the test emails above.

---

## What's New? 🎉

### Timber the Beaver Mascot
Your friendly AI financial guide appears throughout the app with animations and helpful tips!

### New Components
- **Timber's Lodge** - Chat with Timber about your finances
- **Financial Overview** - See your "Logs" (assets), "Termites" (debt), and "Dam Strength" (net worth)
- **Timber Tips** - Auto-showing financial wisdom every 60 seconds
- **Document Manager** - Track all your uploaded documents with real-time status

### Enhanced AI
Timber now speaks in dam-building analogies and provides encouraging, shame-free financial guidance.

---

## Key Features to Test

1. **Dashboard Overview Tab** - See Timber's themed financial stats
2. **Chat with Timber Button** - Opens sliding sidebar chat
3. **Timber Tips** - Wait 60 seconds for auto-showing tips
4. **Document List** - View processing status with Timber animations
5. **Landing Page** - Check out the new Timber branding

---

## File Locations

- **New Components**: `client/src/components/Timber*.tsx`
- **Updated Dashboard**: `client/src/pages/Dashboard.tsx`
- **AI Prompts**: `server/openai.ts`
- **Mascot Assets**: `client/public/mascot/`
- **Database Seeder**: `seed_timber_data.py`

---

## Troubleshooting

**Q: Mascot images not showing?**  
A: Check that files exist in `client/public/mascot/` directory

**Q: Seeder script fails?**  
A: Ensure `DATABASE_URL` environment variable is set

**Q: Colors not applying?**  
A: Run `npm install` to ensure TailwindCSS is configured

---

**Ready to build your financial foundation? Let's get started! 🦫**
