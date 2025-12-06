// ==========================================
// 🔧 CONFIGURATION FILE
// ==========================================
// Update all your API keys, tokens, and URLs here
// This is the ONLY file you need to edit for configuration
// ==========================================

// ==========================================
// 🎮 DISCORD CONFIGURATION
// ==========================================

/**
 * Discord Webhook URL
 * How to get: Server > Channel > Edit > Integrations > Webhooks > Create Webhook > Copy URL
 * This is used to send confession reports to Discord
 */
export const DISCORD_WEBHOOK_URL = 
  'https://discord.com/api/webhooks/1446509450960834631/8MesZqEppmGZgaGPJKN-_upr1JuJd39lI8-KxGKaakS-Y9YT0aoTP-2oZZWEu0e74Cur';

/**
 * Discord Bot Token (Optional - for reading messages from Discord)
 * How to get: Discord Developer Portal > Applications > Bot > Reset Token
 * Leave as 'YOUR_DISCORD_BOT_TOKEN_HERE' if not using
 */
export const DISCORD_BOT_TOKEN = 'MTQ0NTk4MzA5NjY5MTQ5NDkzMw.Gw8gRX.hz7cE--vhgzMnvP_-gcz_N0_fXKPx0Uv6NnvoQ';

/**
 * Discord Guild ID (Server ID) (Optional - for reading messages from Discord)
 * How to get: Enable Developer Mode in Discord > Right click server > Copy ID
 * Leave as 'YOUR_DISCORD_GUILD_ID_HERE' if not using
 */
export const DISCORD_GUILD_ID = '1339890577889693737';

// ==========================================
// 🤖 GEMINI AI CONFIGURATION
// ==========================================

/**
 * Google Gemini API Keys (for AI chat functionality)
 * How to get: https://makersuite.google.com/app/apikey
 * The app will rotate through these keys to avoid rate limits
 * Add as many as you want for better reliability
 */
export const GEMINI_API_KEYS = [
  'AIzaSyAJvW5nvvG-LkSOu9hre6xjSUT7EP9TH6s',
  'AIzaSyBDDbsXMzP5Erv20bvHF4ODOs9qZ7n5AOE',
  'AIzaSyBq_FrsrvMLkebLwvW4TPaAoasYpM_FWRo',
  'AIzaSyAJvW5nvvG-LkSOu9hre6xjSUT7EP9TH6s',
  'AIzaSyA5uNyZZYx8G6v3jbF2HPPef17GwcKwVU0',
];

/**
 * Gemini Model to use
 * Options: 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'
 */
export const GEMINI_MODEL = 'gemini-2.0-flash-lite';

// ==========================================
// 📁 GITHUB CONFIGURATION (Optional)
// ==========================================

/**
 * GitHub Personal Access Token (Optional - for saving confessions to GitHub)
 * How to get: GitHub > Settings > Developer settings > Personal access tokens > 
 *             Tokens (classic) > Generate new token > Select 'repo' scope
 * Leave as 'YOUR_GITHUB_TOKEN_HERE' if not using
 */
export const GITHUB_TOKEN = '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';

/**
 * GitHub Repository Owner (your username)
 */
export const GITHUB_REPO_OWNER = 'AnishVyapari';

/**
 * GitHub Repository Name (where confessions will be saved)
 */
export const GITHUB_REPO_NAME = 'crime';

// ==========================================
// 🔒 SECURITY CONFIGURATION
// ==========================================

/**
 * Password to unlock additional confessions beyond daily limit
 * Users can submit 2 confessions per day normally
 * With this password, they can submit 2 more (total 4 per day)
 */
export const RATE_LIMIT_PASSWORD = 'anishisdabest';

/**
 * Normal daily confession limit per IP
 */
export const NORMAL_CONFESSION_LIMIT = 2;

/**
 * Maximum daily confession limit per IP (with password)
 */
export const MAX_CONFESSION_LIMIT = 4;

// ==========================================
// 🎨 APP CONFIGURATION
// ==========================================

/**
 * Application Name
 */
export const APP_NAME = 'CONFESSION BOOTH';

/**
 * Department Name
 */
export const DEPARTMENT_NAME = 'Vyapari Police Department';

/**
 * App Version
 */
export const APP_VERSION = 'v1.0';

/**
 * Creator Name
 */
export const CREATOR_NAME = 'Anish Vyapari';

// ==========================================
// END OF CONFIGURATION
// ==========================================
// You don't need to edit anything below this line
// ==========================================
