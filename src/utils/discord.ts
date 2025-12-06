import {
  DISCORD_WEBHOOK_URL,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  RATE_LIMIT_PASSWORD,
  NORMAL_CONFESSION_LIMIT,
  MAX_CONFESSION_LIMIT,
} from '../config';

export async function sendToDiscord(type: 'CONFESSION' | 'DENIAL', data: any) {
  const timestamp = new Date().toISOString();
  let embed: any = {};

  if (type === 'CONFESSION') {
    embed = {
      title: '🚨 CRIME CONFESSION REPORTED',
      description: 'New suspect confession received',
      fields: [
        { name: '👤 Suspect Name', value: data.name || 'Unknown', inline: false },
        { name: '📍 Location Address', value: data.address || 'Unknown', inline: false },
        { name: '⚠️ Crime Description', value: data.crime || 'Not provided', inline: false },
        { name: '⏰ Report Time', value: new Date(timestamp).toLocaleString(), inline: false },
      ],
      color: 16711680, // Red
    };
  }

  // Send to Discord webhook
  if (DISCORD_WEBHOOK_URL && !DISCORD_WEBHOOK_URL.includes('YOUR_')) {
    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
      if (response.ok) {
        console.log('✓ Message sent to Discord successfully');
      } else {
        console.error('Discord webhook error:', response.status);
      }
    } catch (error) {
      console.error('Discord webhook fetch error:', error);
    }
  } else {
    console.warn('⚠️ Discord webhook not configured in /config.ts');
  }
}

export async function fetchCrimesFromDiscord(): Promise<
  Array<{ title: string; fields: Array<{ name: string; value: string }>; timestamp: string }>
> {
  // Get crimes from localStorage (always available)
  const localCrimes = JSON.parse(localStorage.getItem('all_crimes') || '[]');
  
  const formattedLocalCrimes = localCrimes.map((crime: any) => {
    const fields = [
      { name: '👤 Suspect Name', value: crime.name || 'Unknown' },
      { name: '📍 Location Address', value: crime.address || 'Unknown' },
      { name: '⚠️ Crime Description', value: crime.crime || 'Not provided' },
    ];
    fields.push({ name: '⏰ Report Time', value: new Date(crime.timestamp).toLocaleString() });
    return {
      title: '🚨 CRIME CONFESSION REPORTED',
      fields,
      timestamp: new Date(crime.timestamp).toLocaleString(),
    };
  });

  // Try to fetch from Discord if bot is configured
  const channelId = localStorage.getItem('police_channel_id');
  if (
    DISCORD_BOT_TOKEN &&
    !DISCORD_BOT_TOKEN.includes('YOUR_') &&
    DISCORD_GUILD_ID &&
    !DISCORD_GUILD_ID.includes('YOUR_') &&
    channelId
  ) {
    try {
      const messagesRes = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages?limit=100`,
        { headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` } }
      );
      if (messagesRes.ok) {
        const messages = await messagesRes.json();
        if (Array.isArray(messages)) {
          const discordCrimes = messages
            .filter((msg: any) => msg.embeds && msg.embeds.length > 0)
            .reverse()
            .map((msg: any) => {
              const embed = msg.embeds[0];
              return {
                title: embed.title || 'Unknown',
                fields: embed.fields || [],
                timestamp: new Date(msg.timestamp).toLocaleString(),
              };
            });
          // Combine local and Discord crimes
          return [...formattedLocalCrimes, ...discordCrimes];
        }
      }
    } catch (error) {
      console.error('Error fetching from Discord:', error);
    }
  }
  return formattedLocalCrimes;
}

export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('IP fetch error:', error);
    return 'unknown_' + Date.now();
  }
}

export async function checkDailyLimit(): Promise<boolean> {
  const ip = await getUserIP();
  const confessionKey = `confessions_${ip}`;
  const passwordUsedKey = `password_used_${ip}`;
  
  const confessions = JSON.parse(localStorage.getItem(confessionKey) || '[]');
  const passwordUsed = localStorage.getItem(passwordUsedKey) === 'true';
  
  const today = new Date().toDateString();
  const todayConfessions = confessions.filter(
    (timestamp: string) => new Date(timestamp).toDateString() === today
  );

  if (todayConfessions.length < NORMAL_CONFESSION_LIMIT) {
    // Under normal limit, allow
    recordConfessionSubmission(ip);
    return true;
  } else if (todayConfessions.length < MAX_CONFESSION_LIMIT && passwordUsed) {
    // Used password before and under max limit
    recordConfessionSubmission(ip);
    return true;
  } else if (todayConfessions.length >= NORMAL_CONFESSION_LIMIT && todayConfessions.length < MAX_CONFESSION_LIMIT && !passwordUsed) {
    // Hit normal limit, need password for more
    const password = prompt(
      `🔒 You have reached your daily limit (${NORMAL_CONFESSION_LIMIT} confessions).\n\nEnter password to unlock ${MAX_CONFESSION_LIMIT - NORMAL_CONFESSION_LIMIT} more confessions:`
    );
    
    if (password === RATE_LIMIT_PASSWORD) {
      localStorage.setItem(passwordUsedKey, 'true');
      recordConfessionSubmission(ip);
      alert(`✓ Password accepted! You can now submit ${MAX_CONFESSION_LIMIT - todayConfessions.length} more confessions today.`);
      return true;
    } else {
      alert('❌ Invalid password. No more confessions allowed today.');
      return false;
    }
  } else {
    // Hit absolute max limit
    alert(`❌ Maximum daily limit reached (${MAX_CONFESSION_LIMIT} confessions). Please try again tomorrow.`);
    return false;
  }
}

function recordConfessionSubmission(ip: string) {
  const key = `confessions_${ip}`;
  const confessions = JSON.parse(localStorage.getItem(key) || '[]');
  confessions.push(new Date().toISOString());
  localStorage.setItem(key, JSON.stringify(confessions));
}
