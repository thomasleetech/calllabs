import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateQuestions(task: any) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `The user wants to cancel ${task.taskDetails.company}. 
      Generate 3-5 questions to gather necessary information.
      Return as JSON array of strings.
      
      Example: ["What's your account number?", "When do you want service to end?"]`
    }]
  });
  
  let text = response.content[0].type === 'text' ? response.content[0].text : '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

export async function generateCallScript(task: any) {
  const details = task.taskDetails;
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Generate a call script for an AI agent to cancel ${details.company}.
      
      Details:
      ${JSON.stringify(details, null, 2)}
      
      Return JSON with:
      {
        "summary": "Brief 2-sentence summary for user",
        "opening": "First thing to say",
        "full_instructions": "Complete system prompt for the AI",
        "expected_scenarios": ["retention offer", "transfer to supervisor"]
      }`
    }]
  });
  
  let text = response.content[0].type === 'text' ? response.content[0].text : '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

export async function extractOutcome(transcript: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Analyze this call transcript and extract the outcome.
      
      ${transcript}
      
      Return JSON with:
      {
        "success": boolean,
        "confirmation_number": string or null,
        "end_date": string or null,
        "final_bill": string or null,
        "notes": "Any important details"
      }`
    }]
  });
  
  let text = response.content[0].type === 'text' ? response.content[0].text : '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}