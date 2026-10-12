export type Priority = "urgent" | "high" | "medium" | "low";

type DeadlineSignal =
  | "within_2_days"
  | "within_7_days"
  | "later"
  | "none";

interface PriorityInput {
  title: string;
  description: string;
  deadline?: Date;
}

interface PrioritySignals {
  strongUrgency: boolean;
  mandatory: boolean;
  seriousConsequences: boolean;
  optional: boolean;
}
function normalizeText(input: PriorityInput): string {
  return `${input.title} ${input.description}`.toLowerCase();
}

const strongUrgencyPhrases = [
  "immediate action required",
  "act immediately",
  "final chance",
  "last chance to apply",
  "urgent response required",
];

const mandatoryPhrases = [
  "mandatory",
  "compulsory",
  "required",
  "must submit",
  "must complete",
];

const consequencePhrases = [
  "will be disqualified",
  "lose eligibility",
  "will not be considered",
  "registration will be cancelled",
  "failure to submit",
];

const optionalityPhrases = [
  "optional",
  "voluntary",
  "not compulsory",
  "not mandatory",
  "if you wish",
  "if interested",
  "participation is not required",
];

const negativeUrgencyPhrases = [
  "no immediate action required",
  "no urgent action required",
  "no action required",
  "no action is required",
];

const negativeMandatoryPhrases = [
  "not mandatory",
  "not compulsory",
  "not required",
  "isn't mandatory",
  "is not mandatory",
];

function containsPhrase(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}
function extractPrioritySignals(text: string): PrioritySignals {
  const hasNegativeUrgency = containsPhrase(
    text,
    negativeUrgencyPhrases
  );

  const hasNegativeMandatory = containsPhrase(
    text,
    negativeMandatoryPhrases
  );

  return {
    strongUrgency:
      !hasNegativeUrgency &&
      containsPhrase(text, strongUrgencyPhrases),

    mandatory:
      !hasNegativeMandatory &&
      containsPhrase(text, mandatoryPhrases),

    seriousConsequences: containsPhrase(
      text,
      consequencePhrases
    ),

    optional: containsPhrase(text, optionalityPhrases),
  };
}
function getDeadlineSignal(deadline?: Date): DeadlineSignal {
  if (!deadline) {
    return "none";
  }

  const now = new Date();
  const timeRemaining = deadline.getTime() - now.getTime();
  const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

  if (daysRemaining <= 2 && daysRemaining >= 0) {
    return "within_2_days";
  }

  if (daysRemaining <= 7 && daysRemaining > 2) {
    return "within_7_days";
  }

  return "later";
}
function calculatePriority(
  signals: PrioritySignals,
  deadlineSignal: DeadlineSignal
): Priority {
  if (
    signals.strongUrgency &&
    signals.seriousConsequences
  ) {
    return "urgent";
  }

  if (
    deadlineSignal === "within_2_days" &&
    signals.seriousConsequences
  ) {
    return "urgent";
  }

  if (signals.strongUrgency) {
    return "high";
  }
  if (
    deadlineSignal === "within_2_days" ||
    signals.seriousConsequences
  ) {
    return "high";
  }
  if (
    signals.mandatory &&
    deadlineSignal === "within_7_days"
  ) {
    return "high";
  }
  if (
  signals.optional &&
  !signals.seriousConsequences
) {
  return "low";
}
  if (
    signals.mandatory ||
    deadlineSignal === "within_7_days"
  ) {
    return "medium";
  }
  return "medium";
}
export function determinePriority(input: PriorityInput): Priority {
  const text = normalizeText(input);
  const signals = extractPrioritySignals(text);
  const deadlineSignal = getDeadlineSignal(input.deadline);

  return calculatePriority(signals, deadlineSignal);
}