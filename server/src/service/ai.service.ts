import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent, HumanMessage, AIMessage } from "langchain";
import { z } from "zod";
import type { Message } from "../types/chat.ts";
const smallModel = new ChatOpenRouter({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free",
  temperature: 0.7,
  apiKey: process.env.OPENROUTER_API_KEY,
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
}: {
  messages: Message[];
}): Promise<ReadableStream> {
  const stream = await smallModel.stream(
    messages.map((message) => {
      if (message.author == "ai") return new AIMessage(message.content);
      else return new HumanMessage(message.content);
    }),
  );
  return stream;
}
