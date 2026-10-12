import { determinePriority } from "./priorityService.js";

const examples = [
  {
    title: "Optional webinar",
    description: "Registration is optional.",
    expected: "low",
  },
  {
    title: "Immediate action required",
    description: "Please act immediately.",
    expected: "high",
  },
  {
    title: "Mandatory submission",
    description: "You must submit the documents.",
    expected: "medium",
  },
  {
    title: "Regular task",
    description: "Prepare your notes.",
    expected: "medium",
  },
];

for (const example of examples) {
  const actual = determinePriority({
    title: example.title,
    description: example.description,
    
  });

  console.log({
    title: example.title,
    expected: example.expected,
    actual,
    passed: actual === example.expected,
  });
}