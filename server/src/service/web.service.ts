import { tavily } from "@tavily/core";
import env from "../config/env.ts";

const tvly = tavily({ apiKey: env.TVLY_API_KEY });

export async function getSearchFromWeb({
  query,
}: {
  query: string;
}): Promise<string> {
  const result = await tvly.search(query, {
    maxResults: 10,
    includeAnswer: true,
  });
  return result.answer || "No answer found";
}
