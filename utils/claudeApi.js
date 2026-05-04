import axios from 'axios';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const WILDLIFE_SYSTEM_PROMPT = `You are a wildlife identification expert. Given an image, identify the animal species. Return ONLY a valid JSON object with no extra text: { name, scientificName, rarityScore (1-100), rarityTier (Common/Uncommon/Rare/Epic/Legendary), points, funFact }. If no animal detected return { error: 'No animal detected' }`;

export const identifyAnimal = async (base64Image) => {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Set EXPO_PUBLIC_CLAUDE_API_KEY environment variable.');
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: WILDLIFE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: 'Please identify the animal in this image and provide the information as a JSON object.',
              },
            ],
          },
        ],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    if (!response.data.content || response.data.content.length === 0) {
      throw new Error('No response from Claude API');
    }

    const textContent = response.data.content.find((block) => block.type === 'text');
    if (!textContent) {
      throw new Error('No text response from Claude API');
    }

    // Extract JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error identifying animal:', error.message);
    throw error;
  }
};
