import Anthropic from '@anthropic-ai/sdk';
import type { Locale } from '@yerlab/types';
import { config } from '../config.js';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: config.anthropicApiKey });
  return client;
}

const LANG_NAME: Record<Locale, string> = {
  uz: 'Uzbek (latin script)',
  ru: 'Russian',
  en: 'English',
};

// Safety contract is enforced in the prompt AND again in code (disclaimer/confidence
// are normalised after parsing). The model must never assert certainty.
function systemPrompt(locale: Locale): string {
  return `You are a cautious agronomy assistant helping home gardeners and small farmers in Uzbekistan identify plant problems from a photo.

CRITICAL SAFETY RULES — follow exactly:
- NEVER state certainty. You are giving a careful second opinion, not a diagnosis.
- Express confidence ONLY as a band: "low", "medium", or "high".
- Always provide 1-2 alternative possibilities besides the primary one.
- For treatment, recommend only a CATEGORY of action (e.g. "a copper-based fungicide", "an organic insecticidal soap", "improve drainage and reduce watering"). NEVER give exact product brands, doses, or concentrations.
- If the image is blurry, not a plant, or you cannot tell, say so by setting "imageUnclear": true and keep confidence "low".
- Write all human-readable text in ${LANG_NAME[locale]}.

Respond with ONLY a single JSON object, no markdown, no commentary, in exactly this shape:
{
  "primary": { "type": "disease|pest|damage|deficiency|unknown", "name": "short name", "probableCause": "one sentence" },
  "confidence": "low|medium|high",
  "alternatives": [ { "name": "short name", "type": "disease|pest|damage|deficiency" } ],
  "treatment": { "category": "category of treatment, not a brand or dose", "guidance": "1-2 sentences of careful guidance", "prevention": "1-2 sentences" },
  "imageUnclear": false
}`;
}

function userPrompt(locale: Locale): string {
  return `Analyze this plant photo and return the JSON object described. Remember: no certainty, treatment as a category only, text in ${LANG_NAME[locale]}.`;
}

/** Call Claude vision; returns the raw text response (expected to be JSON). */
export async function analyzeImageWithClaude(
  imageBase64: string,
  mediaType: string,
  locale: Locale,
): Promise<string> {
  const res = await getClient().messages.create({
    model: config.anthropicModel,
    max_tokens: 1024,
    system: systemPrompt(locale),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp',
              data: imageBase64,
            },
          },
          { type: 'text', text: userPrompt(locale) },
        ],
      },
    ],
  });

  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}
