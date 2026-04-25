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

const reviewPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL code reviewer. Review the user's submitted SQL query for a practice problem.

Problem: {problem}
Table Schema: {schema}
User's Query: {query}
Submission Result: {status}
Error (if any): {error}

Provide a concise code review in markdown with these sections:
## Verdict
One sentence: did it pass or fail and why.

## Code Quality
- Is the query readable and well-structured?
- Are there unnecessary clauses or redundant logic?

## Efficiency
- Could indexing, filtering order, or join strategy be improved?
- Any potential performance concerns at scale?

## Learning Tips
- 1-2 specific suggestions for the student to improve their SQL skills based on this query.

Keep the entire review under 200 words. Be encouraging but honest.
`);

const recommendPrompt = PromptTemplate.fromTemplate(`
You are an adaptive learning engine for a SQL practice platform. Based on the student's performance data, recommend the 3 best problems for them to attempt next.

Student Skill Profile (tag → percentage solved):
{skills}

Recent Submissions (last 10):
{recentSubmissions}

Total Problems Solved: {solvedCount}

Available Unsolved Problems (id, title, difficulty, tags):
{availableProblems}

Select exactly 3 problem IDs from the available list. Prioritize:
1. Topics where the student is weakest (lowest skill percentage)
2. Appropriate difficulty — if recent submissions show many failures, suggest easier problems; if mostly passing, push harder
3. Variety — don't recommend 3 problems with the same tag

Respond in this EXACT JSON format (no markdown, no code fences, just raw JSON):
[
  {{
    "id": "problem-uuid",
    "reason": "Brief reason for recommending this problem (under 15 words)"
  }}
]
`);

const generateProblemPrompt = PromptTemplate.fromTemplate(`
You are an expert SQL problem designer for a learning platform. Generate a new SQL practice problem.

Desired difficulty: {difficulty}
Desired topics/tags: {tags}

Example schemas from existing problems (for reference style):
{existingSchemas}

Create a complete problem with realistic data. Respond in this EXACT JSON format (no markdown, no code fences, just raw JSON):
{{
  "title": "Problem title (concise, descriptive)",
  "description": "Full problem description in markdown. Describe what the student needs to query, include context about the data.",
  "difficulty": "{difficulty}",
  "tags": ["tag1", "tag2"],
  "schema_json": {{
    "table_name": "column1 TYPE, column2 TYPE, ..."
  }},
  "sample_data_json": {{
    "table_name": [
      {{"column1": "value1", "column2": "value2"}},
      {{"column1": "value3", "column2": "value4"}}
    ]
  }},
  "expected_output_json": [
    {{"column1": "result1", "column2": "result2"}}
  ],
  "solution_query": "SELECT ... FROM ... WHERE ..."
}}

Rules:
- Use PostgreSQL syntax and types (TEXT, INTEGER, NUMERIC, DATE, TIMESTAMP, BOOLEAN)
- Include 5-10 rows of sample data per table
- The expected_output_json must be the exact result of running solution_query against the sample data
- Make the problem educational and progressively challenging for the chosen difficulty
- Easy: single table, basic WHERE/ORDER BY. Medium: JOINs, GROUP BY, HAVING. Hard: subqueries, window functions, CTEs.
`)

export const explainChain = explainPrompt.pipe(model).pipe(outputParser);
export const debugChain = debugPrompt.pipe(model).pipe(outputParser);
export const hintChain = hintPrompt.pipe(model).pipe(outputParser);
export const chatChain = chatPrompt.pipe(model).pipe(outputParser);
export const optimizeChain = optimizePrompt.pipe(model).pipe(outputParser);
export const nl2sqlChain = nl2sqlPrompt.pipe(model).pipe(outputParser);
export const analyzeDataChain = analyzeDataPrompt.pipe(model).pipe(outputParser);
export const generateQuestionsChain = generateQuestionsPrompt.pipe(model).pipe(outputParser);
export const reviewChain = reviewPrompt.pipe(model).pipe(outputParser);
export const recommendChain = recommendPrompt.pipe(model).pipe(outputParser);
export const generateProblemChain = generateProblemPrompt.pipe(model).pipe(outputParser);
