import {
  DISCORD_WEBHOOK_URL,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  GITHUB_TOKEN,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
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

    // Save to GitHub
    await saveToGitHub({
      name: data.name,
      address: data.address,
      crime: data.crime,
      timestamp: timestamp,
      ip: await getUserIP(),
    });
  } else if (type === 'DENIAL') {
    embed = {
      title: '⚠️ SUSPECT DENIAL RECORDED',
      description: 'Suspect denied committing a crime - potential suspect under investigation',
      fields: [
        { name: '📝 Report Type', value: 'DENIAL', inline: false },
        { name: '⏰ Report Time', value: new Date(timestamp).toLocaleString(), inline: false },
      ],
      color: 16776960, // Yellow
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

export async function sendCompleteConfessionToDiscord(confessionData: any) {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes('YOUR_')) {
    console.log('Discord webhook not configured in /config.ts');
    return;
  }

  const timestamp = new Date().toISOString();

  // Format chat history
  let chatTranscript = '';
  if (confessionData.chatHistory && confessionData.chatHistory.length > 0) {
    chatTranscript = confessionData.chatHistory
      .map((msg: any) => {
        const sender = msg.role === 'user' ? '👤 Suspect' : '📋 Legal Rep';
        return `${sender}: ${msg.content}`;
      })
      .join('\n\n');
  } else {
    chatTranscript = 'No chat transcript available';
  }

  // Truncate chat if too long (Discord has 1024 char limit per field)
  if (chatTranscript.length > 1000) {
    chatTranscript = chatTranscript.substring(0, 997) + '...';
  }

  const embed = {
    title: '🚨 COMPLETE CONFESSION REPORT',
    description: '**Full Interrogation Record with Photo**',
    fields: [
      { name: '👤 Suspect Name', value: confessionData.name || 'Unknown', inline: true },
      { name: '📍 Address', value: confessionData.address || 'Unknown', inline: true },
      { name: '⚠️ Crime Description', value: confessionData.crime || 'Not provided', inline: false },
      { name: '💬 Legal Chat Transcript', value: chatTranscript, inline: false },
      { name: '⏰ Report Time', value: new Date(timestamp).toLocaleString(), inline: false },
    ],
    color: 16711680, // Red
    footer: {
      text: 'Vyapari Police Department - Confession Booth',
    },
    timestamp: timestamp,
  };

  try {
    // Send main embed with all text data
    const mainResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: '**🚨 NEW COMPLETE CONFESSION RECEIVED 🚨**',
        embeds: [embed] 
      }),
    });

    if (mainResponse.ok) {
      console.log('✓ Complete confession sent to Discord');
    }

    // Send suspect photo as separate message
    if (confessionData.photo) {
      try {
        const base64Data = confessionData.photo.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('file', blob, `suspect_${confessionData.name.replace(/\s/g, '_')}.jpg`);
        formData.append('content', `📸 **SUSPECT PHOTO: ${confessionData.name}**`);

        const imageResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          console.log('✓ Suspect photo sent to Discord');
        }
      } catch (photoError) {
        console.error('Photo upload error:', photoError);
      }
    }

    // Save complete data to GitHub and localStorage
    await saveCompleteConfessionToGitHub({
      name: confessionData.name,
      address: confessionData.address,
      crime: confessionData.crime,
      chatHistory: confessionData.chatHistory,
      photo: confessionData.photo,
      timestamp: timestamp,
      ip: await getUserIP(),
    });

  } catch (error) {
    console.error('Discord complete confession error:', error);
  }
}

async function saveToGitHub(crimeData: any) {
  // Always save to localStorage first
  const localCrimes = JSON.parse(localStorage.getItem('all_crimes') || '[]');
  localCrimes.push(crimeData);
  localStorage.setItem('all_crimes', JSON.stringify(localCrimes));

  console.log('✓ Crime data saved locally:', crimeData);

  // Attempt GitHub save if token is configured
  if (GITHUB_TOKEN && !GITHUB_TOKEN.includes('YOUR_')) {
    try {
      const fileName = `crimes/${crimeData.timestamp.replace(/:/g, '-')}_${crimeData.ip}.json`;
      const fileContent = JSON.stringify(crimeData, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${fileName}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add confession: ${crimeData.name}`,
            content: encodedContent,
          }),
        }
      );

      if (response.ok) {
        console.log('✓ Crime saved to GitHub successfully');
      } else {
        const errorData = await response.json();
        console.error('GitHub save error:', response.status, errorData);
      }
    } catch (error) {
      console.error('GitHub API error:', error);
    }
  } else {
    console.log('ℹ️ GitHub not configured in /config.ts - skipping GitHub save');
  }
}

async function saveCompleteConfessionToGitHub(confessionData: any) {
  // Save to localStorage
  const localCrimes = JSON.parse(localStorage.getItem('all_crimes') || '[]');
  
  // Check if already exists and update, or add new
  const existingIndex = localCrimes.findIndex(
    (crime: any) => crime.timestamp === confessionData.timestamp
  );
  
  if (existingIndex >= 0) {
    localCrimes[existingIndex] = confessionData;
  } else {
    localCrimes.push(confessionData);
  }
  
  localStorage.setItem('all_crimes', JSON.stringify(localCrimes));
  console.log('✓ Complete confession saved locally');

  // Attempt GitHub save if token is configured
  if (GITHUB_TOKEN && !GITHUB_TOKEN.includes('YOUR_')) {
    try {
      const fileName = `crimes/complete_${confessionData.timestamp.replace(/:/g, '-')}_${confessionData.ip}.json`;
      
      // Don't include photo in GitHub (too large)
      const dataForGithub = { ...confessionData };
      delete dataForGithub.photo;
      
      const fileContent = JSON.stringify(dataForGithub, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${fileName}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Complete confession: ${confessionData.name}`,
            content: encodedContent,
          }),
        }
      );

      if (response.ok) {
        console.log('✓ Complete confession saved to GitHub');
      } else {
        const errorData = await response.json();
        console.error('GitHub save error:', response.status, errorData);
      }
    } catch (error) {
      console.error('GitHub API error:', error);
    }
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

    // Add chat history if available
    if (crime.chatHistory && crime.chatHistory.length > 0) {
      let chatTranscript = crime.chatHistory
        .map((msg: any) => {
          const sender = msg.role === 'user' ? '👤 Suspect' : '📋 Legal Rep';
          return `${sender}: ${msg.content}`;
        })
        .join('\n');
      
      if (chatTranscript.length > 500) {
        chatTranscript = chatTranscript.substring(0, 497) + '...';
      }
      
      fields.push({ name: '💬 Chat Transcript', value: chatTranscript });
    }

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
