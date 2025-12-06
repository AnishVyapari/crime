// ================================================
// 🔑 CONFIGURATION FILE
// ================================================
// Update all your API keys, tokens, and URLs here
// This is the ONLY file you need to edit for configuration
// ================================================

// ================================================
// 🎮 DISCORD CONFIGURATION
// ================================================

/**
 * Discord Webhook URL
 * How to get: Server > Channel > Edit > Integrations > Webhooks > Create Webhook > Copy URL
 * This is used to send confession reports to Discord
 */
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

/**
 * Discord Bot Token (Optional - for reading messages from Discord)
 * How to get: Discord Developer Portal > Applications > Bot > Reset Token
 * Leave as environment variable if not using
 */
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

/**
 * Discord Guild ID (Server ID) (Optional - for reading messages from Discord)
 * How to get: Enable Developer Mode in Discord > Right click server > Copy ID
 */
export const DISCORD_GUILD_ID = '1339890577889693737';

// ================================================
// 🤖 GEMINI AI CONFIGURATION
// ================================================

/**
 * Google Gemini API Keys (for AI chat functionality)
 * How to get: https://makersuite.google.com/app/apikey
 * The app will rotate through these keys to avoid rate limits
 * Add as many as you want for better reliability
 */
export const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_1 || '',
  process.env.GEMINI_API_KEY_2 || '',
  process.env.GEMINI_API_KEY_3 || '',
  process.env.GEMINI_API_KEY_4 || '',
  process.env.GEMINI_API_KEY_5 || '',
];

/**
 * Gemini Model to use
 * Options: 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'
 */
export const GEMINI_MODEL = 'gemini-2.0-flash-lite';

// ================================================
// 🔒 RATE LIMITING CONFIGURATION
// ================================================

/**
 * Rate Limit Password - Allow users to exceed daily limit with password
 */
export const RATE_LIMIT_PASSWORD = process.env.RATE_LIMIT_PASSWORD || 'POLICECONFESSION123';

/**
 * Normal daily confession limit per IP address
 */
export const NORMAL_CONFESSION_LIMIT = 5;

/**
 * Maximum daily confession limit per IP address (with password)
 */
export const MAX_CONFESSION_LIMIT = 20;
