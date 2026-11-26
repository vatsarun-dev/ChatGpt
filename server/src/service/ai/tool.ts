import { tool } from "langchain";
import { z } from "zod";

import ContextRepo from "../../repository/context.repo.ts";
import { config } from "dotenv";

/** Bind both memory tools to the authenticated user. */
export function createMemoryTools(userId: string) {
  const contextRepo = new ContextRepo();
  const getMemory = tool(
    async ({}, config) =>
      contextRepo.readonlyContext(config?.configurable?.userId),
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
        userId: config?.configurable?.userId,
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
