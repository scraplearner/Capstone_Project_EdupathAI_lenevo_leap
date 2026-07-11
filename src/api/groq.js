export const SYSTEM_PROMPT = `You are EduPathAI, an expert Indian college admission counselor. You have deep knowledge of all major Indian entrance exams and college admissions.
CRITICAL RULE ON ELIGIBILITY: You must ONLY suggest colleges that the student is strictly eligible for based on the EXAM SCORES they provided. 
- If they provide 'JEE Main' but NOT 'JEE Advanced', you are FORBIDDEN from suggesting any IIT.
- If they provide a state exam like 'MHT-CET', you must prioritize Maharashtra colleges that accept MHT-CET.
- If they provide 'NEET UG', only suggest medical/dental colleges.
- Never assume a student can take an exam they didn't list.

When a student provides their exam scores and preferences, suggest the best colleges ranked by fit. Return as many valid options as possible.
IMPORTANT: Always respond with valid JSON only, no extra text before or after the JSON.`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getCollegeSuggestions(examScores, preferences) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found in environment variables (.env file).");

  const userMessage = `
    My exam scores: ${JSON.stringify(examScores)}
    My preferences: ${JSON.stringify(preferences)}
    Please suggest the best colleges for me.
    IMPORTANT: Provide as many relevant colleges as you can find that fit these criteria (up to 30 if possible). DO NOT LIMIT TO 5-8. Provide an exhaustive list.
    Return ONLY a JSON array of college objects with these exact fields:
    name (string), location (string), branch (string), annualFees (string like "₹1.5 Lakh"), 
    avgPlacement (string like "₹8 LPA"), nirfRank (string), admissionChance (string - exactly "High" or "Medium" or "Low"), 
    examRoute (string), reason (string - one line explanation),
    type (string - e.g., "Private", "Government", "Government-Aided", etc.),
    university (string - the affiliated university),
    acceptedExam (string - the specific exam from the student's input that qualifies them for this college).
    Return ONLY the JSON array, no markdown, no explanation.
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  try {
    // Groq JSON mode might wrap array in an object like {"colleges": [...]}
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    // Attempt to extract array if wrapped
    for (const key in parsed) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
    return parsed; // Fallback
  } catch (e) {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }
}

export async function getApplicationGuidance(colleges, examScores, preferences) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found in environment variables (.env file).");

  const userMessage = `
    Student selected the following colleges: ${JSON.stringify(colleges.map(c => ({ name: c.name, branch: c.branch, location: c.location, exam: c.examRoute })))}
    Student category: ${preferences.category}
    
    Please provide exhaustive admission guidance for EACH of the selected colleges separately.
    Return ONLY a JSON object with a single key "guidanceList" which is an array. Each object in the array MUST correspond to one of the requested colleges and have these EXACT fields:
    collegeName (string),
    seats (string - approximate seats for the specified category/course),
    fees (string - detailed fee structure for selected course and alternative courses),
    govNotices (array of strings - relevant government admission notices),
    collegeNotices (array of strings - college-specific notices/updates),
    mistakes (array of strings - common mistakes to avoid during this specific application),
    portals (array of strings - official portal URLs),
    govScholarships (array of strings - eligible government scholarships),
    privateScholarships (array of strings - eligible private organization scholarships),
    collegeScholarships (array of strings - scholarships provided by the college itself),
    nationalDocuments (array of strings - documents required by national portals like JoSAA/MCC),
    stateDocuments (array of strings - documents required by state counseling portals),
    collegeDocuments (array of strings - physical documents to be carried to the college for admission)
    
    Return ONLY the JSON object, no markdown, no explanation.
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function askFollowUp(question, examScores, preferences, suggestions) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found in environment variables (.env file).");

  const userMessage = `
    Context - Student's exam scores: ${JSON.stringify(examScores)}
    Student's preferences: ${JSON.stringify(preferences)}
    Colleges already suggested: ${JSON.stringify(suggestions.map(s => s.name))}
    
    Student's follow-up question: ${question}
    
    Please answer this question helpfully. Keep the answer short (2-4 sentences). Return just plain text, no JSON.
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function getScholarships(college, preferences) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found in environment variables (.env file).");

  const userMessage = `
    Student category: ${preferences.category}
    Student budget: ${preferences.budget}
    Student location: ${preferences.location}
    Target College: ${college.name}
    
    Please suggest 3-4 specific scholarships this student might be eligible for in India (e.g., state government scholarships, central scholarships, institutional, or private like Reliance/Tata).
    Return ONLY a JSON array of objects with these exact fields:
    name (string), amount (string), deadline (string), eligibility (string), link (string - put a general URL if exact isn't known)
    Return ONLY the JSON array, no markdown, no explanation.
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    for (const key in parsed) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
    return parsed;
  } catch (e) {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }
}

export async function askChatbot(messages, examScores, preferences) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not found in environment variables (.env file).");

  const systemMessage = `
    You are EduPathAI, a 24/7 AI Counselor for Indian students.
    Student Context:
    Exam Scores: ${JSON.stringify(examScores)}
    Preferences: ${JSON.stringify(preferences)}
    
    Answer the student's questions concisely (2-4 sentences) and warmly. 
    Use the provided context if relevant, but answer general college/exam questions as well.
  `;

  // Filter messages to only include role and content, mapping 'ai' to 'assistant'
  const apiMessages = messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : msg.role,
    content: msg.content
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemMessage },
        ...apiMessages
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
