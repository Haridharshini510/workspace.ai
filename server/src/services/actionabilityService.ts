import { IWorkspaceItem } from "../models/WorkspaceItem.js";
type ActionabilityDecision =
  | "actionable"
  | "informational"
  | "uncertain";

interface ActionabilityResult {
  decision: ActionabilityDecision;
  reason: string;
}

const actionPhrases = [
  "apply",
  "register",
  "submit",
  "confirm",
  "complete",
  "rsvp",
  "respond",
  "upload",
  "attend",
  "book",
];

const informationalPhrases = [
  "your application has been received",
  "your application was received",
  "your application has been submitted",
  "your application was submitted",
  "thank you for applying",
  "thank you for your application",
  "your registration is confirmed",
  "your registration has been confirmed",
  "we have received your response",
  "we have received your application",
  "this is an announcement",
  "for your information",
  "please note",
  "just a reminder",
  "this is to inform you",
  "your request has been received",
  "your request has been processed",
  "your submission has been received",
]; 

export function determineActionability(
  item: IWorkspaceItem
): ActionabilityResult {
    const lowerCaseTitle = item.title.toLowerCase();
    const lowerCaseDescription = item.description.toLowerCase();
    const combinedText = `${lowerCaseTitle} ${lowerCaseDescription}`;
    for (const phrase of actionPhrases) {
      if (combinedText.includes(phrase)) {
        return {
          decision: "actionable",
          reason: `Found actionable phrase: "${phrase}"`,
        };
      }
      else if (informationalPhrases.some((infoPhrase) => combinedText.includes(infoPhrase))) {
        return {
          decision: "informational",
          reason: "Found informational phrase",
        };
      }
}
return {
          decision: "uncertain",
          reason: "No actionable phrases found",
        };
    }