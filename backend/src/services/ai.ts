import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const USE_MOCK = process.env.USE_MOCK_AI === 'true';
const WHISPER_URL = process.env.WHISPER_URL || 'http://localhost:9000';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MOCK_SOAP = `**SUBJECTIVE:**
Patient is a 38-year-old presenting with lower back pain of two weeks duration. Pain rated 6/10 on numeric scale. Onset following heavy lifting during residential move. Denies radicular symptoms including numbness and tingling. Reports mild relief with OTC ibuprofen. No prior history of back injury or chronic pain.

**OBJECTIVE:**
To be completed by examining provider.

**ASSESSMENT:**
Acute lumbar strain, likely musculoskeletal in origin. Low suspicion for disc herniation given absence of radicular symptoms.

**PLAN:**
1. Continue OTC NSAIDs as needed
2. Apply ice/heat as comfort measures
3. Gentle stretching and activity as tolerated
4. Follow up if symptoms worsen or fail to improve in 1-2 weeks
5. Consider physical therapy referral if no improvement`;

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Fetch failed after retries');
}

export async function transcribeAudio(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const formData = new FormData();
  formData.append('audio_file', new Blob([fileBuffer]), fileName);

  const response = await fetchWithRetry(`${WHISPER_URL}/asr?output=json`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper transcription failed: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json() as { text: string };
  return result.text || '';
}

export async function generateSoapNote(transcription: string): Promise<string> {
  if (USE_MOCK) {
    return MOCK_SOAP;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a medical scribe assistant. Convert the following clinical note or transcription into a formatted SOAP note. Rules: Use clear medical terminology and keep a 100% professional tone; follow the SOAP note format with clear sections: SUBJECTIVE, OBJECTIVE, ASSESSMENT, and PLAN. Do not include any other text or formatting. Do not use emojis at all.`,
      },
      {
        role: 'user',
        content: transcription,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || '';
}
