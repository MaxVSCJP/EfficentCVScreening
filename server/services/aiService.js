import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function extractJsonFromText(text, scoringMatrix) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
### ROLE
You are a Senior Technical Recruiter and Data Analyst. Your task is to perform a high-precision evaluation of a Resume against a specific Scoring Matrix (SM).

### INPUT DATA
1. **Resume Text**: {{RESUME_TEXT}}
2. **Scoring Matrix (SM)**: {{SM_JSON}}

### EVALUATION CRITERIA & SCORING LOGIC
Calculate the following scores on a scale of 0 to 10 (10 being a perfect match):

1. **similarityScore**: 
   - Perform a semantic similarity analysis (acting as a vector comparison) between the Resume text and the Job Description in the SM. 
   - Assess how well the candidate's professional narrative aligns with the goals and responsibilities of the role.

2. **skillScore**: 
   - Identify skills in the resume that match the "skills" list in the SM.
   - You MUST apply the weights provided in the SM. (e.g., A match on a skill with weight 5 is significantly more valuable than a match on a skill with weight 1).
   - If the candidate lacks all weighted skills, the score is 0.

3. **workScore**: 
   - Match the candidate's job titles and years of experience against the SM requirements.
   - **Semantic Matching**: Treat "Senior Backend Developer" and "Senior Backend Engineer" as equivalent (10/10 match). Use industry-standard synonym logic.
   - **Experience Gap**: If the candidate has the correct title but only 3 years of experience when 5 are required, penalize the score proportionally.

4. **educationScore**: 
   - Compare the candidate's highest degree and field to the SM's requirements (Bsc, Msc, PhD).
   - **Field Flexibility**: Relate similar fields (e.g., "Software Engineering" matches "Computer Science").
   - If the candidate has a higher degree than required, score 10. If the degree is in a related field but a lower level than required, score lower.

5. **averageScore**: 
   - Calculate the mathematical mean of the four scores above.

### OUTPUT INSTRUCTIONS
Return ONLY a valid JSON object. Do not include any conversational filler, markdown formatting (unless specifically asked for a code block), or explanations.

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "skillScore": number,
  "workScore": number,
  "educationScore": number,
  "similarityScore": number,
  "averageScore": number
}

### INPUTS
RESUME_TEXT:
${text.slice(0, 15000)}

SM_JSON:
${JSON.stringify(scoringMatrix)}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const output = response.text();

  return JSON.parse(output);
}
