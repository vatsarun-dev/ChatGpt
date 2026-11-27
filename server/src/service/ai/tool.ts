import { tool } from "langchain";
import { z } from "zod";

import ContextRepo from "../../repository/context.repo.ts";
import { getSearchFromWeb } from "../web.service.ts";

/** Bind both memory tools to the authenticated user. */
export function createMemoryTools(userId: string) {
  const contextRepo = new ContextRepo();
  const getMemory = tool(
    async (_input, config) =>
      contextRepo.readonlyContext(
        String(config?.configurable?.userId ?? userId),
      ),
    {
      name: "getMemory",
      description:
        "Read the authenticated user's saved long-term facts and preferences before answering.",
      schema: z.object({}),
    },
  );

  const updateMemory = tool(
    async ({ description }: { description: string }, config) =>
      contextRepo.createContext({
        userId: String(config?.configurable?.userId ?? userId),
        description,
      }),
    {
      name: "updateMemory",
      description:
        "Save the authenticated user's useful long-term facts and preferences. Include existing useful context in the new summary so it is preserved.",
      schema: z.object({
        description: z.string().min(1).describe("The concise context to save"),
      }),
    },
  );

  return [getMemory, updateMemory];
}

export const getAcessInternet = tool(
  async ({ query }: { query: string }) => getSearchFromWeb({ query }),
  {
    name: "getAcessInternet",
    description:
      "Search the web for current events, live data, or facts not already known.",
    schema: z.object({
      query: z.string().min(1).describe("The web search query"),
    }),
  },
);
