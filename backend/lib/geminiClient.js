/**
 * Google Gemini LLM Client and Multi-turn Classifier for MannMitra Backend
 *
 * Connects directly to Google Gemini API (gemini-3.6-flash / gemini-2.0-flash)
 * with structured JSON schema output for empathetic peer responses and mood classification.
 */

const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { MOODS } = require('./moods');

const SYSTEM_PROMPT = `
You are MannMitra, a warm, compassionate, attentive, and culturally sensitive peer-support companion.
You are NOT a therapist, doctor, or diagnostic tool. Never make clinical diagnoses or medical guarantees.

Your goal is to listen empathetically, validate the user's feelings, and help them identify what support might feel most helpful right now.

Allowed Mood Classifications (Pick exactly one string for the "mood" field):
- "depressed": When the user expresses feeling deeply depressed, empty, heavy, sad for days/weeks, crying, or finding it hard to get out of bed.
- "low": When the user expresses feeling low energy, mildly down, unmotivated, drained, or having a bad day.
- "anxious": When the user expresses feeling nervous, worried, panic, tense, overthinking, jittery, or scared.
- "stressed": When the user expresses feeling overwhelmed, busy, pressure, burnout, or burdened by work/exams.
- "lonely": When the user expresses feeling alone, isolated, missing someone, or disconnected.
- "wants_humor": When the user asks for a joke, laugh, comedy, memes, or lighthearted distraction.
- "neutral": General greetings, questions, or casual chat without strong emotional distress.

Guidelines:
1. Speak warmly, gently, and conversationally in 1-3 sentences.
2. If the user expresses deep sadness, emptiness, or depression, classify as "depressed".
3. Set ready_to_route to true when the user's mood is clear and they would benefit from curated resources.
4. Always return valid JSON matching the requested schema with "reply", "mood", "confidence", and "ready_to_route".
`;

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    reply: {
      type: SchemaType.STRING,
      description: 'Empathetic peer-support reply to the user (1-3 sentences)',
    },
    mood: {
      type: SchemaType.STRING,
      description: 'Must be one of: anxious, low, depressed, stressed, lonely, wants_humor, neutral',
      enum: ['anxious', 'low', 'depressed', 'stressed', 'lonely', 'wants_humor', 'neutral'],
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: 'Confidence score between 0.0 and 1.0',
    },
    ready_to_route: {
      type: SchemaType.BOOLEAN,
      description: 'Whether we have enough clarity to route the user to curated mood packs',
    },
  },
  required: ['reply', 'mood', 'confidence', 'ready_to_route'],
};

/**
 * Normalizes raw mood string to valid locked MOODS enum
 */
function normalizeMood(rawMood, replyText = '', userText = '') {
  if (!rawMood || typeof rawMood !== 'string') return 'neutral';
  const clean = rawMood.toLowerCase().trim().replace(/['"]/g, '');
  if (clean === 'depressed' || clean.includes('depress')) return 'depressed';
  if (clean === 'low' || clean.includes('low') || clean.includes('drain') || clean.includes('exhaust')) return 'low';
  if (clean.includes('anxi') || clean.includes('panic') || clean.includes('nervous') || clean.includes('worry')) return 'anxious';
  if (clean.includes('stress') || clean.includes('overwhelm') || clean.includes('burnout')) return 'stressed';
  if (clean.includes('lone') || clean.includes('alone') || clean.includes('isolat')) return 'lonely';
  if (clean.includes('humor') || clean.includes('joke') || clean.includes('laugh') || clean.includes('funny')) return 'wants_humor';
  if (MOODS.includes(clean)) return clean;

  const combined = (userText + ' ' + replyText).toLowerCase();
  if (combined.includes('depress')) return 'depressed';
  if (combined.includes('empty') || combined.includes('down') || combined.includes('sad') || combined.includes('exhaust') || combined.includes('drained')) return 'low';
  if (combined.includes('anxious') || combined.includes('panic') || combined.includes('nervous') || combined.includes('worry')) return 'anxious';
  if (combined.includes('stress') || combined.includes('overwhelm')) return 'stressed';
  if (combined.includes('lonely') || combined.includes('alone')) return 'lonely';
  if (combined.includes('joke') || combined.includes('laugh') || combined.includes('humor')) return 'wants_humor';

  return 'neutral';
}

/**
 * Fallback heuristic classifier when API key is missing or unreachable
 */
function heuristicFallback(messages) {
  const userMessages = messages.filter((m) => m.role === 'user');
  const latestUserMsg = userMessages[userMessages.length - 1];
  const userText = latestUserMsg ? latestUserMsg.text.toLowerCase().trim() : '';

  const isGreeting = /^(hi|hello|hey|hey there|good morning|good afternoon|good evening|howdy|sup|hola)[\s!.]*$/i.test(userText);
  if (isGreeting) {
    return {
      reply: "Hello! I'm MannMitra, your peer-support companion. I'm here to listen without judgment. How are you feeling right now?",
      mood: 'neutral',
      confidence: 0.6,
      ready_to_route: false,
      crisis: false,
    };
  }

  if (userText.includes('depress') || userText.includes('depression')) {
    return {
      reply: "I hear how heavy and overwhelming everything feels right now. Please know that you don't have to carry this alone, and there is no pressure to be okay today. Let's look at some gentle support together.",
      mood: 'depressed',
      confidence: 0.95,
      ready_to_route: true,
      crisis: false,
    };
  }

  if (
    userText.includes('empty') ||
    userText.includes('down') ||
    userText.includes('sad') ||
    userText.includes('worth doing') ||
    userText.includes('unmotivated') ||
    userText.includes('heavy') ||
    userText.includes('low') ||
    userText.includes('bad day') ||
    userText.includes('exhausted') ||
    userText.includes('drained')
  ) {
    return {
      reply: "I hear how heavy and draining things feel right now. It takes courage to open up, and you don't have to carry this alone. Let me bring up some gentle support for you.",
      mood: 'low',
      confidence: 0.92,
      ready_to_route: true,
      crisis: false,
    };
  }

  if (
    userText.includes('anxious') ||
    userText.includes('panic') ||
    userText.includes('worry') ||
    userText.includes('worried') ||
    userText.includes('nervous') ||
    userText.includes('heart racing') ||
    userText.includes('anxiety') ||
    userText.includes('scared')
  ) {
    return {
      reply: "Feeling anxious can be so overwhelming in the mind and body. Let's take a slow, gentle breath together. I've prepared some calming practices to help you ground yourself.",
      mood: 'anxious',
      confidence: 0.94,
      ready_to_route: true,
      crisis: false,
    };
  }

  if (
    userText.includes('stress') ||
    userText.includes('stressed') ||
    userText.includes('overwhelmed') ||
    userText.includes('burnout') ||
    userText.includes('deadline') ||
    userText.includes('pressure')
  ) {
    return {
      reply: "It sounds like you're carrying a lot of weight and pressure on your shoulders. You deserve a pause. Let's explore some de-stressing resources for you.",
      mood: 'stressed',
      confidence: 0.9,
      ready_to_route: true,
      crisis: false,
    };
  }

  if (
    userText.includes('lonely') ||
    userText.includes('alone') ||
    userText.includes('isolated') ||
    userText.includes('no one') ||
    userText.includes('nobody') ||
    userText.includes('miss')
  ) {
    return {
      reply: "Loneliness can feel deeply painful, but please know that you are heard and welcomed here. Let's look at some comforting spaces and words together.",
      mood: 'lonely',
      confidence: 0.88,
      ready_to_route: true,
      crisis: false,
    };
  }

  if (
    userText.includes('joke') ||
    userText.includes('laugh') ||
    userText.includes('funny') ||
    userText.includes('humor') ||
    userText.includes('cheer me up') ||
    userText.includes('latent')
  ) {
    return {
      reply: "A good laugh is wonderful medicine! Let's get you some lighthearted humor and comedy to brighten your day.",
      mood: 'wants_humor',
      confidence: 0.95,
      ready_to_route: true,
      crisis: false,
    };
  }

  return {
    reply: "Thank you for sharing that with me. I'm here to support you. What kind of space or content feels most comforting to you at this moment?",
    mood: 'neutral',
    confidence: 0.6,
    ready_to_route: false,
    crisis: false,
  };
}

/**
 * Main Gemini classification & conversation generator
 */
async function classifyAndReply(messages) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
        },
      });

      // Format multi-turn messages for Gemini
      const contents = messages
        .filter((m) => m && m.text && m.text.trim())
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text.trim() }],
        }));

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
      }

      const result = await model.generateContent({ contents });
      const rawText = result.response.text();
      const parsed = JSON.parse(rawText);

      const latestUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      const userText = latestUserMsg ? latestUserMsg.text : '';

      return {
        reply: parsed.reply || "I'm here with you. How can I help you today?",
        mood: normalizeMood(parsed.mood, parsed.reply, userText),
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
        ready_to_route: Boolean(parsed.ready_to_route),
        crisis: false,
      };
    } catch (apiError) {
      console.error('[geminiClient] Gemini API call error, using fallback:', apiError.message);
    }
  }

  return heuristicFallback(messages);
}

// Alias for chat.js
const getChatTurn = classifyAndReply;

module.exports = {
  SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
  classifyAndReply,
  getChatTurn,
};
