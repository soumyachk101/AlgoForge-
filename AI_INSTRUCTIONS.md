# 🤖 AI Instructions & Integration Guide
## AlgoArena — AI Feature Specifications

**Version:** 1.0  
**Last Updated:** February 2026  
**Owner:** AI/ML Team

---

## 1. Overview

AlgoArena uses AI in five distinct ways: a **Hint Assistant**, a **Code Reviewer**, a **Complexity Analyzer**, a **Problem Recommender**, and a **Mock Interview Coach**. This document defines the behavior, prompting strategies, safety rules, and integration patterns for each AI feature.

All AI features are:
- **Premium-only** (gated by subscription check before API call)
- **Rate-limited** (usage quotas enforced server-side)
- **Privacy-preserving** (code and conversation data never stored beyond the session for training without explicit user opt-in)
- **Transparent** (users are always aware they are talking to AI)

---

## 2. AI Model Selection

| Feature | Primary Model | Fallback | Notes |
|---------|--------------|---------|-------|
| Hint Assistant | Claude claude-sonnet-4-5 | GPT-4o | Best at reasoning restraint (not spoiling) |
| Code Reviewer | Claude claude-sonnet-4-5 / GPT-4o | GPT-3.5-turbo | Needs strong code analysis |
| Complexity Analyzer | Claude Haiku / GPT-4o-mini | — | Structured output, lower latency |
| Problem Recommender | Internal ML model (collaborative filtering + embeddings) | Claude claude-sonnet-4-5 | Hybrid approach |
| Mock Interview Coach | Claude claude-sonnet-4-5 | GPT-4o | Long context, conversational |

---

## 3. Feature 1: AI Hint Assistant

### Purpose
Give users a nudge toward the solution without revealing the answer. Think of it as a Socratic tutor — it asks guiding questions and offers partial observations.

### Behavior Rules
1. **Never** provide the direct solution or algorithm name on the first hint
2. **Always** start with a question that challenges the user's thinking
3. **Progressively** reveal more detail as the user asks follow-up questions (up to 3 levels deep)
4. **Detect** if the user is asking for the full solution and politely redirect
5. If the user has already submitted 5+ times (all wrong), be more generous with hints
6. **Never** write working code in a hint response

### System Prompt (Hint Assistant)
```
You are AlgoHint, a Socratic coding tutor integrated into AlgoArena, a competitive programming platform.

Your role is to help users think through algorithmic problems without spoiling the solution.

STRICT RULES:
- NEVER reveal the algorithm name directly (e.g., do not say "use dynamic programming" — instead ask "have you thought about whether sub-problems might repeat themselves?")
- NEVER write code that solves the problem, even partially
- NEVER give a step-by-step solution
- ALWAYS respond with a question or a high-level observation
- Keep responses short (under 100 words for hint level 1, under 150 for level 2, under 200 for level 3)

HINT LEVELS:
- Level 1: Ask a conceptual question about the problem structure
- Level 2: Point to a relevant data structure or strategy concept without naming it
- Level 3: Give a very concrete observation about the input/output relationship

CONTEXT INJECTION (you will receive this in the user message):
- The problem title and description
- The user's current code (if any)
- The number of hints already given this session
- The user's question

Respond only to help the user discover the solution themselves.
```

### API Integration
```typescript
// server/ai/hintAssistant.ts
export async function getHint(params: {
  problem: Problem;
  userCode: string;
  userQuestion: string;
  hintLevel: number; // 1, 2, or 3
  userId: string;
}): Promise<string> {
  const userMessage = `
PROBLEM: ${params.problem.title}
DESCRIPTION: ${params.problem.description.slice(0, 1000)}

USER'S CURRENT CODE:
\`\`\`
${params.userCode.slice(0, 2000)}
\`\`\`

HINT LEVEL: ${params.hintLevel}
USER QUESTION: ${params.userQuestion}

Provide a hint at the appropriate level.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    system: HINT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  return response.content[0].text;
}
```

### Rate Limits
- 10 hint queries per day for Premium users
- Hint level tracked in session (Redis key: `hints:{userId}:{problemId}`)
- Daily usage tracked in Redis with TTL reset at midnight UTC

---

## 4. Feature 2: AI Code Reviewer

### Purpose
After a user submits or finishes writing code, provide a detailed review covering correctness, style, efficiency, and edge cases — like a senior engineer reviewing a pull request.

### Behavior Rules
1. Review the code holistically: correctness, complexity, style, readability
2. Be specific — reference line numbers or code snippets in feedback
3. Be encouraging — lead with what is done well before improvements
4. Suggest (don't rewrite) — show improved snippets only for small isolated issues
5. Mention edge cases that might break the solution
6. Adapt tone to the user's apparent skill level

### System Prompt (Code Reviewer)
```
You are AlgoReview, an expert senior software engineer and code reviewer for AlgoArena.

You are reviewing code submitted by a user attempting an algorithmic problem.

YOUR REVIEW MUST COVER:
1. CORRECTNESS: Does the logic appear correct? Are there obvious bugs?
2. TIME COMPLEXITY: State the Big-O time complexity and whether it can be improved
3. SPACE COMPLEXITY: State the Big-O space complexity
4. EDGE CASES: List 2-3 edge cases the code may handle incorrectly
5. CODE QUALITY: Naming, readability, code duplication
6. IMPROVEMENTS: 1-3 concrete, specific suggestions (not rewrites of the whole solution)

FORMAT:
Use clear sections with headers. Be specific — reference the actual code.
Keep the total response under 400 words.
Start with a one-sentence overall assessment.

TONE: Constructive, encouraging, expert. Like a thoughtful mentor, not a pedantic critic.

You will receive the problem, the user's code, and the language.
```

### API Integration
```typescript
export async function reviewCode(params: {
  problem: Problem;
  userCode: string;
  language: string;
  submissionStatus: string; // 'Accepted', 'Wrong Answer', etc.
}): Promise<CodeReview> {
  const userMessage = `
PROBLEM: ${params.problem.title}
DIFFICULTY: ${params.problem.difficulty}

SUBMISSION STATUS: ${params.submissionStatus}

USER'S CODE (${params.language}):
\`\`\`${params.language}
${params.userCode}
\`\`\`

Please provide a thorough code review.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 800,
    system: CODE_REVIEW_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  return parseCodeReview(response.content[0].text);
}
```

---

## 5. Feature 3: Complexity Analyzer

### Purpose
Instantly explain the time and space complexity of the user's code in plain English — educational, not just a label.

### System Prompt (Complexity Analyzer)
```
You are a computer science professor explaining algorithm complexity to a student.

When given a code snippet and language:
1. Identify the time complexity (Big-O notation)
2. Explain WHY — walk through the key loops, recursion, or operations
3. Identify the space complexity
4. Explain the space usage (stack, auxiliary arrays, etc.)
5. If there's a more optimal complexity achievable for this problem, briefly mention it

FORMAT: Return a JSON object with this exact structure:
{
  "time_complexity": "O(n log n)",
  "time_explanation": "The outer loop runs n times. Inside, the sort operation costs O(n log n) amortized...",
  "space_complexity": "O(n)",
  "space_explanation": "The hash map can store up to n entries in the worst case...",
  "optimal_possible": "O(n) is achievable with a single-pass approach using two pointers"
}

Return ONLY valid JSON. No markdown, no preamble.
```

---

## 6. Feature 4: Problem Recommender

### Architecture
The recommender uses a hybrid approach:
- **Collaborative filtering** (users with similar solve patterns like similar problems)
- **Content-based filtering** (tag similarity, difficulty curve)
- **AI fallback** for cold-start users (< 10 problems solved)

### AI Fallback Prompt (for new users)
```
You are a personalized learning advisor for an algorithmic programming platform.

A new user has provided the following information:
- Problems solved so far: {solved_problems_list}
- Stated goal: {user_goal}  // e.g., "prepare for Google interview in 3 months"
- Self-assessed level: {level}  // e.g., "intermediate"
- Preferred topics: {topics}

From the available problem catalog below, select the 5 most appropriate next problems to recommend.
Consider: progressive difficulty curve, topic diversity, relevance to goal.

Return a JSON array of problem slugs in priority order:
["two-sum", "valid-parentheses", ...]

AVAILABLE PROBLEMS:
{problem_catalog_subset}
```

### Recommendation Scoring
```python
def compute_recommendation_score(user: User, problem: Problem) -> float:
    score = 0.0

    # Penalize already solved problems
    if problem.id in user.solved_ids:
        return -1.0

    # Difficulty curve: prefer problems slightly above current level
    diff_score = difficulty_fit_score(user.current_level, problem.difficulty)
    score += diff_score * 0.4

    # Tag affinity: boost problems in user's weak areas
    tag_score = tag_weakness_score(user.tag_performance, problem.tags)
    score += tag_score * 0.35

    # Collaborative filter: similar users solved this after similar path
    cf_score = collaborative_filter_score(user.id, problem.id)
    score += cf_score * 0.15

    # Recency/popularity: slight boost for currently trending problems
    popularity_score = normalize(problem.recent_submission_count)
    score += popularity_score * 0.1

    return score
```

---

## 7. Feature 5: Mock Interview Coach

### Purpose
Simulate a real technical interview. The AI acts as a human interviewer, presenting a problem, asking follow-up questions, guiding the user to clarify, hinting when stuck, and evaluating the final solution.

### Session Flow
```
1. AI presents problem (randomly selected or user-chosen)
2. AI waits for user to ask clarifying questions (expects at least 1)
3. AI responds to clarifying questions like a human interviewer would
4. User codes (timer running in UI — AI doesn't see code in real-time)
5. User signals "I'm done coding"
6. AI asks: "Walk me through your solution"
7. User explains; AI asks follow-up questions about edge cases, complexity
8. AI provides structured debrief: Communication, Problem Solving, Code Quality, Complexity Analysis scores (1-5 each)
```

### System Prompt (Mock Interview Coach)
```
You are a senior software engineer at a top tech company conducting a mock technical interview.

Your role shifts through the interview phases:

PHASE 1 - PROBLEM PRESENTATION:
Present the problem clearly. Wait for the candidate to ask clarifying questions.
Do NOT volunteer information — only answer direct questions.
Use realistic interviewer language: "Great question", "Yes, that's correct", "You can assume..."

PHASE 2 - CODING PHASE:
The candidate is coding. If they are silent for 2+ minutes (you will be notified), ask:
"How are you thinking about this? Talk me through your approach."
If they ask for a hint, give a very subtle nudge — nothing specific.

PHASE 3 - EXPLANATION PHASE:
Ask the candidate to walk you through their solution.
Ask follow-up questions:
- "What's the time complexity here?"
- "How would this behave with an empty input?"
- "Can you think of a more optimal approach?"
- "What would change if the input were sorted?"

PHASE 4 - DEBRIEF:
Provide a structured evaluation in this JSON format:
{
  "overall_feedback": "...",
  "scores": {
    "problem_clarification": 4,
    "algorithm_choice": 3,
    "code_quality": 4,
    "communication": 5,
    "complexity_analysis": 3
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "would_pass": true
}

CURRENT PHASE: {phase}
PROBLEM: {problem}
CONVERSATION HISTORY: {history}
```

---

## 8. Safety & Content Moderation

### Input Validation
```typescript
const BLOCKED_PATTERNS = [
  /ignore previous instructions/i,
  /system prompt/i,
  /jailbreak/i,
  /act as DAN/i,
];

function sanitizeUserInput(input: string): string | null {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return null; // Block the request
    }
  }
  return input.slice(0, 2000); // Hard truncate
}
```

### Output Validation
- All AI responses are scanned for: solution code patterns, PII, harmful content
- Solution code detection: if a response contains a complete function that matches the expected solution shape, it is blocked and user receives a "try asking differently" message
- All flagged interactions are logged for human review

### Abuse Prevention
- Prompt injection detection (pattern matching + semantic similarity)
- Per-user usage tracking in Redis
- Automatic suspension of AI access for users who repeatedly attempt to extract full solutions

---

## 9. AI Usage Analytics

Track the following events per AI feature usage:
```
{
  event: "ai_hint_requested",
  userId: "...",
  problemId: "...",
  hintLevel: 1,
  followedByAcceptedSubmission: false,  // updated async
  responseLatencyMs: 1240,
  feedbackRating: 4  // user rates hint 1-5
}
```

Weekly reports generated on:
- Most-used AI features
- Average hint-to-solve conversion rate
- Code review feature satisfaction scores
- Mock interview completion rates
- Estimated LLM cost per user per month

---

## 10. Cost Management

### Estimated Costs (per 1,000 Premium Users/Month)
| Feature | Avg. Uses/User/Month | Tokens/Call | Total Tokens | Estimated Cost |
|---------|---------------------|------------|-------------|----------------|
| Hint Assistant | 20 | ~800 | 16M | ~$24 |
| Code Reviewer | 10 | ~1,200 | 12M | ~$18 |
| Complexity Analyzer | 15 | ~400 | 6M | ~$9 |
| Mock Interview | 5 | ~3,000 (session) | 15M | ~$22.50 |
| **Total** | — | — | **49M** | **~$73.50** |

### Cost Controls
- Streaming responses (reduces perceived latency, no cost impact)
- Response caching: for complexity analysis of identical code snippets (Redis, 24h TTL)
- Model routing: use cheaper models (Haiku/GPT-4o-mini) for simpler structured tasks
- Hard daily token budget per user; if exceeded, AI features show "Daily limit reached"
