import { ChatOpenRouter } from "@langchain/openrouter";
import { createAgent } from "langchain";
import { z } from "zod";
const smallModel = new ChatOpenRouter({
  model: "anthropic/claude-sonnet-4.5",
  temperature: 0.7,
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function getConversationTitle(conversation: string): Promise<string> { 
    const agent= createAgent({
        tools: [smallModel],
        agentType: "chat-zero-shot-react-description",
        responseFormat: z.object({

        }
    });
}
