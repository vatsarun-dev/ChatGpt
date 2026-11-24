import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowUp,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Plus,
  LogOut,
} from "lucide-react";
import logo from "../../../../assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logOut } from "../../../auth/state/authReducers.jsx";
import { logoutApi } from "../../../auth/service/authService.js";
import {
  getConversationsApi,
  getMessagesApi,
  streamChatApi,
} from "../../service/chatService.js";

const Home = () => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const historyRequestRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await getConversationsApi();
      setConversations(data.conversations);
    } catch (err) {
      const status = err.response?.status
        ? ` (HTTP ${err.response.status})`
        : "";
      setError(
        `${err.response?.data?.message || err.message || "Could not load chat history"}${status}`,
      );
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const startNewChat = () => {
    historyRequestRef.current += 1;
    setLoadingConversation(false);
    setConversationId(null);
    setMessages([]);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Clear the local session even if the server cannot be reached.
    } finally {
      dispatch(logOut());
      navigate("/");
    }
  };

  const openConversation = async (id) => {
    const requestId = ++historyRequestRef.current;
    setLoadingConversation(true);
    setError("");
    try {
      const { data } = await getMessagesApi(id);
      if (requestId === historyRequestRef.current) {
        setConversationId(id);
        setMessages(
          data.messages.map((item) => ({
            id: item._id,
            author: item.author,
            content: item.content,
          })),
        );
        setSidebarOpen(false);
      }
    } catch {
      if (requestId === historyRequestRef.current) {
        setError("Could not load this conversation.");
      }
    } finally {
      if (requestId === historyRequestRef.current) {
        setLoadingConversation(false);
      }
    }
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || sending) return;

    setMessage("");
    setError("");
    setSending(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), author: "user", content: text },
      { id: crypto.randomUUID(), author: "ai", content: "" },
    ]);

    try {
      await streamChatApi({
        message: text,
        conversationId,
        onConversationId: (id) => setConversationId(id),
        onText: (chunk) => {
          setMessages((current) => {
            const updated = [...current];
            const last = updated[updated.length - 1];
            if (last?.author === "ai") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
        },
      });
      await loadConversations();
    } catch (err) {
      setError(err.message || "The response stream was interrupted.");
      setMessages((current) => {
        const last = current[current.length - 1];
        return last?.author === "ai" && !last.content
          ? current.slice(0, -1)
          : current;
      });
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Create a React authentication system",
    "Give me unique AI project ideas",
    "Teach me how neural networks work",
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#0d0d0d] transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-white/[0.06] lg:hidden"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:px-1">
            <img src={logo} alt="ChatGPT" className="h-9 w-9" />
            <span className="text-sm font-semibold text-zinc-200">ChatGPT</span>
          </div>
          <button
            onClick={startNewChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-white/[0.06]"
            title="New chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 pt-2">
          <button
            onClick={startNewChat}
            className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.07]"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        <div className="scrollbar-hidden mt-5 flex-1 overflow-y-auto px-3 sm:mt-6">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
            Recent
          </p>
          <div className="space-y-1">
            {conversations.map((item) => (
              <button
                key={item._id}
                onClick={() => openConversation(item._id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/[0.05] ${conversationId === item._id ? "bg-white/[0.07] text-zinc-100" : "text-zinc-400"}`}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-zinc-600" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
            {!conversations.length && (
              <p className="px-3 py-2 text-xs text-zinc-600">
                Your chats will appear here.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.07] p-3">
          <div className="flex items-center gap-3 p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold">
              {user?.name?.slice(0, 2).toUpperCase() || "ME"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-200">
                {user?.name || "Your account"}
              </p>
              <p className="truncate text-xs text-zinc-600">
                {user?.email || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.07] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.06] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src={logo} alt="" className="h-8 w-8" />
          <span className="text-sm font-medium text-zinc-300">ChatGPT</span>
        </header>

        <section className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-8 pb-2 sm:px-6">
          {loadingConversation && messages.length === 0 ? (
            <p className="mx-auto max-w-2xl pt-8 text-center text-sm text-zinc-500">
              Loading conversation…
            </p>
          ) : messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center pb-12 ">
              <img src={logo} alt="ChatGPT" className="mb-2 h-14 w-14" />
              <h1 className="text-center text-2xl font-semibold sm:text-3xl">
                How can I help you?
              </h1>
              <p className="mt-2 text-center text-sm text-zinc-600">
                Ask anything, explore ideas, write code, or solve problems
                together.
              </p>
              <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMessage(suggestion)}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-left text-sm text-zinc-400 hover:bg-white/[0.05]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-7 pb-32">
              {messages.map((item, index) => {
                const isStreaming =
                  sending &&
                  index === messages.length - 1 &&
                  item.author === "ai";
                return (
                  <article
                    key={item.id}
                    className={
                      item.author === "user"
                        ? "ml-auto max-w-[85%] rounded-3xl bg-[#1c1c1c] px-5 py-3 text-sm leading-7 text-zinc-100"
                        : "flex gap-3 text-sm leading-7 text-zinc-200"
                    }
                  >
                    {item.author === "ai" ? (
                      <>
                        <img
                          src={logo}
                          alt="Assistant"
                          className="mt-1 h-7 w-7 shrink-0"
                        />
                        <div className="markdown-content min-w-0 flex-1">
                          <ReactMarkdown>
                            {item.content || (isStreaming ? " " : "")}
                          </ReactMarkdown>
                          {isStreaming && (
                            <span
                              className="streaming-cursor"
                              aria-label="Assistant is responding"
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      item.content
                    )}
                  </article>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
          {error && (
            <p className="mx-auto mt-3 max-w-3xl text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        <div className="bg-gradient-to-t from-[#080808] via-[#080808] to-transparent px-3 pb-4 pt-3 sm:px-6 sm:pb-6">
          <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={submitMessage}>
              <div className="rounded-2xl border border-white/[0.1] bg-[#151515] p-2 shadow-2xl shadow-black/50 focus-within:border-white/[0.17]">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitMessage(event);
                    }
                  }}
                  rows={1}
                  placeholder="Message ChatGPT..."
                  className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-zinc-600"
                />
                <div className="flex justify-end px-1 pb-0.5">
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-zinc-600"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
            <p className="mt-2 text-center text-[10px] text-zinc-700 sm:text-xs">
              AI can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
