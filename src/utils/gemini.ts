import { GEMINI_API_KEYS, GEMINI_MODEL } from '../config';

let currentKeyIndex = 0;

export async function getGeminiResponse(
  userMessage: string,
  systemPrompt: string
): Promise<string> {
  const geminiKey = GEMINI_API_KEYS[currentKeyIndex];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: { parts: [{ text: systemPrompt }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limited - trying next key');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Rotate to next API key
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    console.log(`Switched to API key index: ${currentKeyIndex}`);
    throw error;
  }
}
