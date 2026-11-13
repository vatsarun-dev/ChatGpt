import { ChatOpenRouter } from "@langchain/openrouter";
const smallModel = new ChatOpenRouter({
  model: "anthropic/claude-sonnet-4.5",
  temperature: 0.7,
  apiKey: process.env.OPENROUTER_API_KEY,
});
