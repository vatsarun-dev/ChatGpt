import { api } from "../../auth/service/authService.js";

export const getConversationsApi = () => api.get("/person1/conversations");
export const getMessagesApi = (conversationId) =>
  api.get(`/person1/conversations/${conversationId}/messages`);

export async function streamChatApi({ message, conversationId, onConversationId, onText }) {
  const response = await fetch(`${api.defaults.baseURL}/person1/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversationId } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Could not send the message");
  }

  const newConversationId = response.headers.get("X-Conversation-Id");
  if (newConversationId) onConversationId(newConversationId);
  if (!response.body) throw new Error("The server did not return a chat stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const readEvents = (events) => {
    for (const event of events) {
      const text = event
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).replace(/^ /, ""))
        .join("\n");
      if (text) onText(text);
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";
    readEvents(events);
    if (done) break;
  }
  if (buffer) readEvents([buffer]);
}
