import { tool } from "langchain";
import { z } from "zod";

import ContextRepo from "../../repository/context.repo.ts";

/** Bind the memory update tool to the authenticated user. */
export function createUpdateMemoryTool(userId: string) {
  const contextRepo = new ContextRepo();

  const updateMemory = tool(
    async ({ description }) => {
      await contextRepo.createContext({ userId, description });
      return "Saved user context.";
    },
    {
      name: "updateMemory",
      description:
        "Save the authenticated user's useful long-term facts and preferences. Include existing useful context in the new summary so it is preserved.",
      schema: z.object({
        description: z.string().min(1).describe("The concise context to save"),
      }),
    },
  );

  return [updateMemory];
}
