# Brain.md — AI Prompt / Token Contract

Version: 1.0

Central source of truth for all server-side AI prompts. Server code MUST import
these templates from here (never inline long prompts). Update the version below
whenever any template, field, or policy changes.

## 1. Role Prompt Templates (short, reuse verbatim)

### Image analysis
```
Analyze this emergency image. Reply EXACTLY:
TITLE: <brief title>
CATEGORY: <one from category list>
DESCRIPTION: <one concise sentence>
```

### Video analysis
```
Analyze this emergency video. Reply EXACTLY:
TITLE: <brief title>
CATEGORY: <one from category list>
DESCRIPTION: <one concise sentence>
```

### Content classification (text)
```
Classify this incident text. Reply EXACTLY:
CATEGORY: <one from category list>
SEVERITY: <low|medium|high>
```

### Report generation
```
From these facts write a police report. Reply EXACTLY:
TITLE: <brief title>
DESCRIPTION: <2-3 factual sentences>
STATUS: <PENDING|IN_PROGRESS|RESOLVED|DISMISSED>
```

## 2. Category List (canonical, reuse in every prompt)

```
Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape,
Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery,
Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking,
Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency,
Natural Disaster, Violence, Other
```

## 3. Canonical Response Shape (normalized output)

Always return a flat object. Missing fields default to `""`:

```
{ "title": "", "category": "", "description": "" }
```

Parsing rule: regex the `TITLE:` / `CATEGORY:` / `DESCRIPTION:` fields;
strip surrounding whitespace; ignore any extra text the model emits.

Example expected raw model output:

```
TITLE: Road accident near bus stand
CATEGORY: Violence
DESCRIPTION: Two vehicles collided at 6pm; two injured, police informed.
```

## 4. Fallback / Resilience Policy (rate limits, 5xx)

1. Primary provider: `aiConfig.primary_provider` (Gemini).
2. On rate-limit, quota-exhausted, or 5xx -> immediately try `aiConfig.fallback_provider` (OpenAI) once.
3. Both unavailable -> return placeholder `{ aiFailed: true, title: "", category: "", description: "" }` to UI; do NOT block or throw.
4. Per-provider circuit breaker: after 3 consecutive failures, skip that provider for 60s backoff.
5. Always log: provider tried, error kind, duration. Never log the media payload.

## 5. Prompt Builders (import these)

- `buildImagePrompt()` -> Image analysis template
- `buildVideoPrompt()` -> Video analysis template
- `buildClassificationPrompt(text)` -> Content classification template
- `buildReportPrompt(facts)` -> Report generation template
- `CATEGORY_LIST` -> canonical category string

## 6. Versioning

- Bump `Version:` at top of this file on any prompt/policy change.
- Keep prompts <= 2 sentences of instructions; let the canonical shape carry the format.
