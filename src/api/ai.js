import * as groq from './groq';

export async function getCollegeSuggestions(examScores, preferences) {
  return groq.getCollegeSuggestions(examScores, preferences);
}

export async function getApplicationGuidance(colleges, examScores, preferences) {
  return groq.getApplicationGuidance(colleges, examScores, preferences);
}

export async function askFollowUp(question, examScores, preferences, suggestions) {
  return groq.askFollowUp(question, examScores, preferences, suggestions);
}

export async function getScholarships(college, preferences) {
  return groq.getScholarships(college, preferences);
}

export async function askChatbot(messages, examScores, preferences) {
  return groq.askChatbot(messages, examScores, preferences);
}
