# MannMitra Backend API (Google Gemini Powered)

Backend service for MannMitra peer-support chatbot and content recommendation system powered by Google Gemini.

## Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

## Locked Mood List
The supported moods in the system are locked to match the frontend schema:
`anxious | low | stressed | lonely | wants_humor | neutral`

## Content Categories
`yoga | books | music | spiritual | humor`

---

## API Endpoints

### 1. Chat Classification & Conversation
**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "messages": [
    { "role": "user", "text": "I've been feeling anxious" },
    { "role": "assistant", "text": "That sounds tough. What's on your mind?" }
  ]
}
```

**Response:**
```json
{
  "reply": "Feeling anxious can be overwhelming. Let's take things one step at a time.",
  "mood": "anxious",
  "confidence": 0.92,
  "ready_to_route": true,
  "crisis": false
}
```

*Note: If a crisis signal is detected, the endpoint immediately short-circuits and returns:*
```json
{
  "reply": "",
  "mood": null,
  "confidence": 0,
  "ready_to_route": false,
  "crisis": true
}
```

### 2. Content Resources
**Endpoint:** `GET /api/content?mood=low`

**Response:**
```json
{
  "mood": "low",
  "content": {
    "yoga": [],
    "books": [],
    "music": [],
    "spiritual": [],
    "humor": []
  }
}
```

---

## Running and Testing

```bash
# Start server
npm run dev

# Run test suites
npm test
```
