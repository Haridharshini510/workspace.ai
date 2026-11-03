const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /disregard\s+(all\s+)?(previous|above|prior)\s+instructions/gi,
  /you\s+are\s+now\s+a/gi,
  /new\s+instructions:/gi,
  /system\s*prompt:/gi,
  /\[INST\]/gi,
  /<<SYS>>/gi,
];

const MAX_INPUT_LENGTH = 2000;

export function sanitizeForLLM(text: string): string {
  let sanitized = text;

  // Strip control characters (keep newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Remove common injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[removed]");
  }

  // Truncate to prevent token stuffing
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.slice(0, MAX_INPUT_LENGTH);
  }

  return sanitized.trim();
}

export function wrapUserContent(text: string): string {
  const sanitized = sanitizeForLLM(text);
  return `<user_content>\n${sanitized}\n</user_content>`;
}
