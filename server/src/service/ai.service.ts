import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent, HumanMessage, AIMessage } from "langchain";
import type { Message } from "../types/chat.ts";
import { createUpdateMemoryTool } from "../service/ai/tool.ts";
import ContextRepo from "../repository/context.repo.ts";
import env from "../config/env.ts";

const contextRepo = new ContextRepo();
const MAX_HISTORY_MESSAGES = 20;

const smallModel = new ChatOpenRouter({
  model: env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
  temperature: 0.7,
  apiKey: env.OPENROUTER_API_KEY,
  maxTokens: 2048,
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
      .map((part) => (typeof part === "string" ? part : "text" in part ? part.text : ""))
      .join("")
    : String(response.content);
  const title = content.trim().replace(/^['"`]+|['"`]+$/g, "").slice(0, 30);
  return title || message.trim().slice(0, 30) || "New conversation";
}

/**
 * Stream an assistant reply with preloaded user memory from MongoDB so no
 * extra getMemory LLM round-trip is needed before tokens start streaming.
 */
export async function getStream({
  messages,
  userId,
}: {
  messages: Array<Pick<Message, "author" | "content">>;
  userId: string;
}) {
  const savedContext = await contextRepo.readonlyContext(userId);
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  const agent = createAgent({
    model: smallModel,
    tools: createUpdateMemoryTool(userId),
    systemPrompt: `You are a helpful assistant with persistent memory for the authenticated user.

Saved user memory:
${savedContext}

Memory rules:
1. Use the saved user memory above whenever relevant without calling any tool to fetch it.
2. When the user tells you a stable personal fact, preference, goal, or ongoing project that may help in future conversations, call updateMemory before answering. Combine the new fact with all still-useful facts from the saved user memory above so existing facts are preserved.
3. Do not save passwords, authentication secrets, payment credentials, or similarly sensitive information. Do not claim that information was saved unless the updateMemory tool succeeds.
4. Treat the saved context as personal information belonging only to this authenticated user.`,
  });

  const stream = await agent.stream(
    {
      messages: recentMessages.map((message) => {
        if (message.author == "ai") return new AIMessage(message.content);
        else return new HumanMessage(message.content);
      }),
    },
    { streamMode: "messages" },
  );
  return stream;
}
