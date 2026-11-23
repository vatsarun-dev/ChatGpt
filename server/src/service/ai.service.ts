import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent, HumanMessage, AIMessage } from "langchain";
import { z } from "zod";
import type { Message } from "../types/chat.ts";
import { createMemoryTools } from "../service/ai/tool.ts";
import env from "../config/env.ts";
const smallModel = new ChatOpenRouter({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free ",
  temperature: 1,
  apiKey: env.OPENROUTER_API_KEY,
  maxTokens: 4096,
});

export async function getConversationTitle({
  message,
}: {
  message: string;
}): Promise<string> {
  const agent = createAgent({
    model: smallModel,
    responseFormat: z.object({
      title: z
        .string()
        .max(30)
        .describe("The title of the converstation, max 30 character"),
    }),
    systemPrompt: `You are a helpful assistant that provides concise and informative responses. Please provide a title for the conversation based on the user's prompt.`,
  });

  const response = await agent.invoke({
    messages: [new HumanMessage(message)],
  });
  return response.structuredResponse.title;
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
}): Promise<ReadableStream> {
  const agent = createAgent({
    model: smallModel,
    tools: createMemoryTools(userId),
    systemPrompt: `You are a helpful assistant with persistent memory for the authenticated user.

Memory rules:
1. Before answering each user message, call getMemory. Use the returned facts and preferences when relevant. If no context is found, continue normally.
2. When the user tells you a stable personal fact, preference, goal, or ongoing project that may help in future conversations, call updateMemory before answering. Do not wait for the user to say "remember this" when the information is clearly useful long term.
3. updateMemory replaces the saved context. First combine the new fact with all still-useful facts from getMemory, then send the complete concise context. Do not discard existing useful facts.
4. Do not save passwords, authentication secrets, payment credentials, or similarly sensitive information. Do not claim that information was saved unless the updateMemory tool succeeds.
5. Treat the saved context as personal information belonging only to this authenticated user.`,
  });

  const stream = await agent.stream(
    {
      messages: messages.map((message) => {
        if (message.author == "ai") return new AIMessage(message.content);
        else return new HumanMessage(message.content);
      }),
    },
    { streamMode: "messages" },
  );
  return stream;
}
