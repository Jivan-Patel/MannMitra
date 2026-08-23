/**
 * App Safety Language Policies for MannMitra
 *
 * Defines preferred and forbidden language guidelines to ensure no medical,
 * diagnostic, or guaranteed-outcome claims are made anywhere in the application.
 * Ported from the hackathon prototype's appSafety.js.
 */

export const CONTENT_LANGUAGE_POLICY = {
  preferredPhrases: [
    'may help',
    'designed to support',
    'a gentle option for',
    'intended to help you pause',
    'can offer a moment of distraction',
  ],
  forbiddenPhrases: ['instantly cures', 'proven to fix', 'guarantees', 'stops panic', 'scientifically guaranteed'],
};

/**
 * Crisis Keyword Registry for demo-grade heuristic crisis detection.
 */
export const CRISIS_KEYWORDS: string[] = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'self-harm',
  'self harm',
  'overdose',
  'want to die',
  'hopeless',
  'no reason to live',
  'cant go on',
  "can't go on",
  'harm myself',
  'ending it all',
  'take my life',
];
