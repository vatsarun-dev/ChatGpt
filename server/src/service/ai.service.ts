import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent, HumanMessage, AIMessage } from "langchain";
import type { Message } from "../types/chat.ts";
import { createMemoryTools } from "../service/ai/tool.ts";
import env from "../config/env.ts";
const smallModel = new ChatOpenRouter({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free",
  temperature: 1,
  apiKey: env.OPENROUTER_API_KEY,
  maxTokens: 4096,
});

export async function getConversationTitle({
  message,
}: {
  message: string;
}): Promise<string> {
  // Ask for plain text: OpenRouter free models do not all support the
  // structured response format LangChain otherwise requests here.
  const response = await smallModel.invoke([
    new HumanMessage(
      `Give this conversation a concise title of at most 30 characters. Return only the title:\n${message}`,
    ),
  ]);
  const content = Array.isArray(response.content)
    ? response.content
        .map((part) =>
          typeof part === "string" ? part : "text" in part ? part.text : "",
        )
        .join("")
    : String(response.content);
  const title = content
    .trim()
    .replace(/^['"`]+|['"`]+$/g, "")
    .slice(0, 30);
  return title || message.trim().slice(0, 30) || "New conversation";
}
/**
 *
 * @param param0 to generate stream this function is used
 * @returns
 */
export async function getStream({
  messages,
  userId,
}: {
  messages: Message[];
  userId: string;
}) {
  const agent = createAgent({
    model: smallModel,
    tools: createMemoryTools(userId),
    systemPrompt: `You are a helpful assistant with persistent memory for the authenticated user.

Memory rules:
1. Before answering each user message, call getMemory silently in the background. If no context is found, continue normally.
2. NEVER repeat, list, or mention the user's saved background facts (such as their college, year, CGPA, job, or preferences) unless the user specifically asks about them or they are directly required to answer the question.
3. For greetings or casual openers, only greet the user naturally using their first name if known (for example: "Hi Arun! How are you?" or "Hello Arun! How can I help you today?"), without bringing up any other saved details.
4. When the user tells you a stable personal fact, preference, goal, or ongoing project that may help in future conversations, call updateMemory before answering. Do not wait for the user to say "remember this" when the information is clearly useful long term.
5. updateMemory replaces the saved context. First combine the new fact with all still-useful facts from getMemory, then send the complete concise context. Do not discard existing useful facts.
6. Do not save passwords, authentication secrets, payment credentials, or similarly sensitive information. Do not claim that information was saved unless the updateMemory tool succeeds.
7. Treat the saved context as private personal information belonging only to this authenticated user.`,
  });

  const stream = await agent.stream(
    {
      messages: messages.map((message) => {
        if (message.author == "ai") return new AIMessage(message.content);
        else return new HumanMessage(message.content);
      }),
    },
    {
      streamMode: "messages",
      configurable: {
        userId: userId,
      },
    },
  );
  return stream;
}
