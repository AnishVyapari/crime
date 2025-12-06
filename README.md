# 🚨 Police Confession Booth

A modern, AI-powered web application for police departments to manage and respond to public confessions. Built with TypeScript, React, and Discord integration.

## 📝 About

This is a code bundle for the Enhance Police Confession Booth UI design. It provides a complete, production-ready implementation with AI chatbot integration and Discord webhook support.

**Original Design:** [Figma Design](https://www.figma.com/design/uZ72zoW2CKvyV7JHVfUERs/Enhance-Police-Confession-Booth)

## ✨ Features

- 🤖 **AI-Powered Chat**: Integration with Google Gemini API for intelligent responses
- 📋 **Discord Integration**: Send confession reports directly to Discord channels
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔐 **Secure**: Environment variable support for sensitive credentials
- 🚀 **Production-Ready**: Fully typed TypeScript codebase
- 🧙 **Multiple AI Keys**: Support for multiple Gemini API keys with fallback

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **AI Integration**: Google Gemini API 2.0 Flash
- **Notifications**: Discord Webhooks
- **Build Tools**: Vite, TypeScript Compiler

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Configuration

All configuration uses environment variables. See `.env.example`:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/ID/TOKEN
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
GEMINI_API_KEY_3=AIzaSy...
GEMINI_API_KEY_4=AIzaSy...
GEMINI_API_KEY_5=AIzaSy...
```

See [`src/config.ts`](src/config.ts) for all options.

## 📔 Usage

1. Enter confession in the booth
2. AI analyzes and responds
3. Send to Discord (optional)
4. View in Discord channel

## 📄 License

MIT License - See LICENSE file

## 💋 Acknowledgments

- Figma community for original design
- Google Gemini API
- Discord API

---

**⚠️ Important**: Keep `.env` with secrets private. Never commit to version control.

Made with ♥ by [AnishVyapari](https://github.com/AnishVyapari)
