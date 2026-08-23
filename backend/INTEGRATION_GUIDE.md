# Chatbot Integration Guide (for A — Frontend)

Goal: the chatbot is a second entry point into the *same* content-pack
screen the manual mood picker already uses. Same mood strings, same
`/api/content` call, same downstream UI — just a different way of getting
there.

## The flow

1. User types in the chat UI.
2. Keep the full conversation in React state as an array:
   ```js
   const [messages, setMessages] = useState([]);
   // each item: { role: "user" | "assistant", text: "..." }
   ```
3. On each user message, append it locally, then POST the **entire**
   array so far to `/api/chat` (backend is stateless — no session ids,
   no cookies needed):
   ```js
   const res = await fetch("http://localhost:3001/api/chat", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ messages: updatedMessages }),
   });
   const data = await res.json();
   ```
4. Handle the response in this order:
   - **`data.crisis === true`** → do NOT show `data.reply` (it will be
     empty). Immediately render the same static crisis resource card
     used on the landing screen. Stop the normal chat flow here — don't
     let the user keep chatting past this point without the resource
     being visible.
   - **`data.ready_to_route === true`** → call your router/state change
     to switch to the content-pack screen, passing `data.mood` exactly
     as received (it already matches your locked mood enum). This is
     the same transition the manual picker triggers — reuse that
     existing code path rather than building a second one.
   - **Otherwise** → append `data.reply` to the message list as an
     `assistant` turn and keep the chat open for the next user message.

## Loading state
Each `/api/chat` call is a real LLM round-trip (can take 1-3 seconds).
Show a typing/loading indicator while awaiting the response — don't let
the input feel frozen with no feedback.

## Error handling
Any non-200 response, or `data.error === true`, means the Gemini call
failed server-side. `data.reply` will already contain a safe fallback
message ("Sorry, I'm having trouble connecting...") — just render it
as an assistant message and let the user try again. Don't treat this
as a crash; the crisis path is completely unaffected by this failure
mode since crisis detection runs before Gemini is ever called.

## What NOT to build on the frontend
- No mood classification logic — the backend already returns `mood`.
- No crisis keyword matching — the backend already returns `crisis`.
- No chat history persistence — a single browser session is enough,
  per project scope. Losing history on refresh is expected/fine.

## Quick reference — response shape
```json
{
  "reply": "string (empty if crisis: true)",
  "mood": "anxious | stressed | lonely | wants_humor | neutral | depressed | null",
  "confidence": 0.0,
  "ready_to_route": false,
  "crisis": false
}
```
