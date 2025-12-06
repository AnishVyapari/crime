# 🚀 Quick Setup Guide - Police Confession Booth

This guide will help you configure your Confession Booth in **under 5 minutes**.

---

## 📋 Configuration Checklist

All configuration is done in **ONE FILE ONLY**: `/config.ts`

Open `/config.ts` and update the following:

---

### ✅ 1. Discord Webhook (Required for Discord Integration)

**Current Status:** ✓ Already Configured

```typescript
export const DISCORD_WEBHOOK_URL = 
  'https://discord.com/api/webhooks/1446509450960834631/...';
```

**Your webhook is already set up!** Confessions will be sent to your Discord server automatically.

**To change it:**
1. Go to your Discord Server
2. Right-click a channel → Edit Channel
3. Integrations → Webhooks → Create Webhook
4. Copy Webhook URL
5. Paste into `DISCORD_WEBHOOK_URL` in `/config.ts`

---

### ⚙️ 2. Discord Bot (Optional - for reading crime records from Discord)

**Current Status:** ⚠️ Not Configured (Optional)

```typescript
export const DISCORD_BOT_TOKEN = 'YOUR_DISCORD_BOT_TOKEN_HERE';
export const DISCORD_GUILD_ID = 'YOUR_DISCORD_GUILD_ID_HERE';
```

**What this does:** Allows the app to read confession messages from Discord and display them in "View Crimes"

**How to set up:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to "Bot" tab → Reset Token → Copy token
4. Paste into `DISCORD_BOT_TOKEN`
5. Enable Developer Mode in Discord: User Settings → Advanced → Developer Mode
6. Right-click your server → Copy ID
7. Paste into `DISCORD_GUILD_ID`
8. Invite bot to server: OAuth2 → URL Generator → Check "bot" → Copy URL → Open in browser

**Skip this if:** You only want to send confessions TO Discord (not read FROM Discord)

---

### 🤖 3. Gemini AI Keys (Required for AI Chat)

**Current Status:** ✓ Already Configured (5 keys)

```typescript
export const GEMINI_API_KEYS = [
  'AIzaSyAJvW5nvvG-LkSOu9hre6xjSUT7EP9TH6s',
  'AIzaSyBDDbsXMzP5Erv20bvHF4ODOs9qZ7n5AOE',
  // ... 3 more keys
];
```

**Your AI chat is already working!** The app will rotate through these keys automatically.

**To add your own keys:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Create API Key
4. Copy and add to the `GEMINI_API_KEYS` array in `/config.ts`

**Tip:** Add multiple keys to avoid rate limits!

---

### 📁 4. GitHub Integration (Optional - for backing up confessions)

**Current Status:** ⚠️ Not Configured (Optional)

```typescript
export const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE';
export const GITHUB_REPO_OWNER = 'AnishVyapari';
export const GITHUB_REPO_NAME = 'crime';
```

**What this does:** Saves confession JSON files to a GitHub repository

**How to set up:**
1. Create a GitHub repository named "crime" (or any name you want)
2. Go to GitHub → Settings → Developer settings
3. Personal access tokens → Tokens (classic) → Generate new token
4. Select scope: `repo` (full control of private repositories)
5. Generate token → Copy it
6. Paste into `GITHUB_TOKEN` in `/config.ts`
7. Update `GITHUB_REPO_OWNER` to your GitHub username
8. Update `GITHUB_REPO_NAME` to your repo name

**Skip this if:** You only want to store confessions locally and in Discord

---

### 🔒 5. Rate Limiting Password

**Current Status:** ✓ Already Set

```typescript
export const RATE_LIMIT_PASSWORD = 'anishisdabest';
```

**What this does:** Users can submit 2 confessions normally. With this password, they can submit 2 more (total 4).

**To change:** Simply update the password in `/config.ts`

---

### 🎨 6. Customization (Optional)

You can customize the app's branding:

```typescript
export const APP_NAME = 'CONFESSION BOOTH';
export const DEPARTMENT_NAME = 'Vyapari Police Department';
export const APP_VERSION = 'v1.0';
export const CREATOR_NAME = 'Anish Vyapari';
```

**Change these** to personalize your app!

---

## 🎯 Quick Start

### Minimum Required Setup:
1. ✅ Discord Webhook (already done!)
2. ✅ Gemini AI Keys (already done!)

**You're ready to go!** 🎉

### Recommended Setup:
- ✅ Discord Webhook (already done!)
- ✅ Gemini AI Keys (already done!)
- ⚙️ Discord Bot (for reading crimes from Discord)
- 📁 GitHub Integration (for backup)

---

## 🧪 Testing Your Setup

### Test Discord Webhook:
1. Run the app
2. Submit a test confession
3. Check your Discord server - you should see the confession appear!

### Test AI Chat:
1. Select "NO" when asked if you committed a crime
2. Chat with the AI officer - responses should appear

### Test Camera:
1. Click "YES" to confess
2. Click "📷 Enable Camera"
3. Allow camera permissions
4. Click "📸 Capture Photo"

---

## ❓ Troubleshooting

### Discord messages not appearing?
- Check that `DISCORD_WEBHOOK_URL` is correct in `/config.ts`
- Make sure the webhook channel still exists

### AI not responding?
- Check browser console for errors
- Try adding more Gemini API keys in `/config.ts`
- Make sure keys are valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Camera not working?
- Make sure you clicked "Allow" when prompted
- Check browser settings: Site Settings → Camera → Allow
- Try a different browser (Chrome/Firefox work best)

### GitHub not saving?
- Check that `GITHUB_TOKEN` is valid
- Make sure the repository exists
- Check that token has `repo` scope

---

## 📞 Support

- **Creator:** Anish Vyapari
- **Repository:** Check `/config.ts` for all settings

---

## 🎉 You're Done!

Your Confession Booth is configured and ready to use!

**Remember:** All settings are in `/config.ts` - that's the only file you need to edit!
