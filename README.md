# Amazon Top Sellers Tracker

Daily dashboard showing Amazon bestsellers for ZIP 10019 (NYC) across:
- Beauty & Personal Care
- Electronics
- Home & Kitchen

---

## Deploy to Vercel (15 min, free)

### Step 1 — Push to GitHub

1. Go to https://github.com/new and create a new **private** repository named `amazon-tracker`
2. On your computer, open Terminal and run:

```bash
cd amazon-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amazon-tracker.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username.

---

### Step 2 — Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `amazon-tracker` repository → click **"Import"**
4. Under **"Environment Variables"**, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (get it at https://console.anthropic.com)
5. Click **"Deploy"**

Vercel will build and give you a live URL like:
`https://amazon-tracker-yourname.vercel.app`

---

### Step 3 — Share with your team

Send teammates the Vercel URL. Anyone with the link can open the dashboard and click **"Run Daily Report"** to fetch fresh data.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
# Open http://localhost:3000
```

---

## How it works

- **Frontend** (`app/page.js`) — React dashboard with category tabs, product cards, metrics
- **API route** (`app/api/report/route.js`) — server-side proxy that calls Anthropic with web search; your API key never leaves the server
- **No database** — fetches fresh data on demand each time you click "Run Daily Report"

---

## Adding more categories

Open `app/api/report/route.js` and update the category list in the prompt.
Then update `CAT_COLORS` and `CATEGORIES` in `app/page.js`.
