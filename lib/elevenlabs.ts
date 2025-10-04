export async function createConversationalAgent(config: {
  systemPrompt: string;
  firstMessage: string;
}) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_config: {
          agent: {
            prompt: {
              prompt: config.systemPrompt,
            },
            first_message: config.firstMessage,
            language: 'en',
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', response.status, error);
      throw new Error(`ElevenLabs failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('ElevenLabs agent created:', data.agent_id);
    return data.agent_id;
  } catch (error) {
    console.error('Failed to create ElevenLabs agent:', error);
    throw error;
  }
}