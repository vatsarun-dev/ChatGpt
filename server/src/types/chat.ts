export type messageResponse = {
  author: "ai" | "user";
  content: string;
  conversationId: string;
};
export type Message = messageResponse & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
