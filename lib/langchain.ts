import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const outputParser = new StringOutputParser();

const explainPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL instructor. Explain the following SQL query in a clear and detailed manner. 
Break down each clause and explain what it does. Use simple language suitable for learners.

SQL Query:
{query}

Provide your explanation in markdown format with sections for each clause.
`);

const debugPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL debugger. The user wrote a SQL query that produced an error or incorrect results.

User's Query:
{query}

Error Message:
{error}

Expected Output Description:
{expected}

Analyze the query, identify the issue, explain what went wrong, and provide a corrected version.
Format your response in markdown with these sections:
## Issue Found
## Explanation
## Corrected Query
`);

const hintPrompt = PromptTemplate.fromTemplate(`
You are a SQL instructor providing progressive hints. The student is working on this problem:

Problem: {problem}

Hint Level: {level}/3

For level 1: Give a gentle nudge about the approach.
For level 2: Suggest the key SQL concepts/clauses needed.
For level 3: Provide a near-complete solution outline without the full answer.

Provide ONLY the hint for the requested level. Keep it concise.
`);

const chatPrompt = PromptTemplate.fromTemplate(`
You are DataTrail AI, a friendly and knowledgeable SQL tutor. Help the user learn SQL concepts, 
answer questions, and provide examples. Keep responses concise but thorough.

Previous context: {context}

User message: {message}

Respond in markdown format. Include SQL code examples when relevant.
`);

const optimizePrompt = PromptTemplate.fromTemplate(`
You are a SQL performance optimization expert. Analyze the following query and suggest improvements.

SQL Query:
{query}

Provide your analysis in markdown with:
## Performance Analysis
## Suggested Optimizations
## Optimized Query
`);

const nl2sqlPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL architect. Convert the following natural language request into a valid, optimized SQL query.
Use the provided table schema for context.

Table Schema:
{schema}

User Request:
{request}

Problem Context:
{problem}

Return ONLY the SQL query, with no markdown formatting or explanation.
`);

const analyzeDataPrompt = PromptTemplate.fromTemplate(`
You are a data analyst expert. Analyze the following CSV dataset and provide a structured summary.

Table Name: {tableName}
Columns: {columns}
Sample Rows (first 5):
{sampleRows}

Respond in this EXACT JSON format (no markdown, no code fences, just raw JSON):
{{
  "summary": "A 2-3 sentence overview of what this dataset represents",
  "columns": [
    {{
      "name": "column_name",
      "type": "string|number|date|boolean",
      "description": "Brief description of what this column contains"
    }}
  ],
  "relationships": ["Description of any relationships or patterns between columns"],
  "insights": ["2-3 interesting observations about the data"]
}}
`);

const generateQuestionsPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL instructor. Based on the following dataset, generate SQL practice questions.

Table Name: {tableName}
Schema: {schema}
Data Summary: {summary}
Sample Rows:
{sampleRows}

Generate exactly 6 practice questions at varying difficulty levels.
Respond in this EXACT JSON format (no markdown, no code fences, just raw JSON):
[
  {{
    "id": 1,
    "title": "Short question title",
    "description": "Detailed description of what the user needs to query",
    "difficulty": "easy|medium|hard",
    "hint": "A helpful hint for solving this",
    "approach": "The SQL concept needed (e.g., WHERE clause, GROUP BY, JOIN)"
  }}
]

Rules:
- Include 2 easy, 2 medium, and 2 hard questions
- Questions should be progressively challenging
- Use only the columns that exist in the provided schema
- The table name in questions must be: {tableName}
`);

export const explainChain = explainPrompt.pipe(model).pipe(outputParser);
export const debugChain = debugPrompt.pipe(model).pipe(outputParser);
export const hintChain = hintPrompt.pipe(model).pipe(outputParser);
export const chatChain = chatPrompt.pipe(model).pipe(outputParser);
export const optimizeChain = optimizePrompt.pipe(model).pipe(outputParser);
export const nl2sqlChain = nl2sqlPrompt.pipe(model).pipe(outputParser);
export const analyzeDataChain = analyzeDataPrompt.pipe(model).pipe(outputParser);
export const generateQuestionsChain = generateQuestionsPrompt.pipe(model).pipe(outputParser);
