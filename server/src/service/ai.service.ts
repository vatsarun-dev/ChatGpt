import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent, HumanMessage } from "langchain";
import { z } from "zod";
const smallModel = new ChatOpenRouter({
  model: "anthropic/claude-sonnet-4.5",
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
