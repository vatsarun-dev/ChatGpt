import React, { useState } from "react";
import {
  Menu,
  Plus,
  Search,
  MessageSquare,
  Settings,
  User,
  ChevronDown,
  Paperclip,
  Globe,
  ArrowUp,
  Sparkles,
  MoreHorizontal,
  PanelLeftClose,
} from "lucide-react";
import logo from "../../../../assets/logo.svg";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");

  const conversations = [
    "Build a React authentication system",
    "Explain LangChain simply",
    "My AI project architecture",
    "MongoDB aggregation pipeline",
    "How does JWT work?",
    "Prepare for technical interview",
  ];

  const suggestions = [
    {
      icon: "✦",
      title: "Explain something",
      text: "Explain quantum computing in simple terms",
    },
    {
      icon: "⌘",
      title: "Write code",
      text: "Create a React authentication system",
    },
    {
      icon: "◇",
      title: "Brainstorm ideas",
      text: "Give me some unique AI project ideas",
    },
    {
      icon: "↗",
      title: "Learn something",
      text: "Teach me how neural networks work",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log("Message:", message);

    // Your API / Redux action goes here
    // dispatch(sendMessage(message));

    setMessage("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808] text-white">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#0d0d0d] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 lg:px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <span className="text-sm font-bold">N</span>
            </div>

            <span className="text-sm font-semibold text-zinc-200">Neural</span>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
            title="New chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-2">
          <button className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-white">
            <Plus className="h-4 w-4" />
            New chat
            <span className="ml-auto text-xs text-zinc-600">⌘ K</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300">
            <Search className="h-4 w-4" />
            Search chats
            <span className="ml-auto text-xs text-zinc-700">⌘ F</span>
          </button>
        </div>

        {/* Conversations */}
        <div className="mt-5 flex-1 overflow-y-auto px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
            Recent
          </p>

          <div className="space-y-1">
            {conversations.map((conversation, index) => (
              <button
                key={index}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-200"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400" />

                <span className="truncate">{conversation}</span>

                <MoreHorizontal className="ml-auto hidden h-4 w-4 shrink-0 text-zinc-600 group-hover:block" />
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-white/[0.07] p-3">
          <button className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800 text-xs font-semibold">
              AV
            </div>

            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-zinc-200">
                Arun Vats
              </p>

              <p className="text-xs text-zinc-600">Free plan</p>
            </div>

            <Settings className="h-4 w-4 text-zinc-600" />
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= MAIN ================= */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Model Selector */}
            <button className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]">
              <div className="mb-0 flex justify-center">
                <img src={logo} alt="ChatGPT Logo" className="h-9 w-9" />
              </div>

              <span>ChatGpt</span>

              <ChevronDown className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-400" />
            </button>
          </div>

          {/* Profile */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.1]">
            AV
          </button>
        </header>

        {/* ================= CHAT AREA ================= */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Empty State */}
          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-28">
            {/* AI Logo */}
            <div className="mb-0 flex justify-center">
              <img src={logo} alt="ChatGPT Logo" className="h-15 w-15gt" />
            </div>

            <h1 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How can I help you?
            </h1>

            <p className="mt-2 max-w-md text-center text-sm leading-6 text-zinc-600">
              Ask anything, explore ideas, write code, or solve problems
              together.
            </p>

            {/* Suggestions */}
            <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(item.text)}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-white/[0.13] hover:bg-white/[0.05]"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sm text-zinc-300">
                    {item.icon}
                  </div>

                  <p className="text-sm font-medium text-zinc-300 transition group-hover:text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-zinc-600">
                    {item.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ================= MESSAGE COMPOSER ================= */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#080808] via-[#080808] to-transparent px-3 pb-4 pt-12 sm:px-6 sm:pb-6">
            <div className="mx-auto w-full max-w-3xl">
              <form onSubmit={handleSubmit}>
                <div className="rounded-2xl border border-white/[0.1] bg-[#151515] p-2 shadow-2xl shadow-black/50 transition focus-within:border-white/[0.17]">
                  {/* Textarea */}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    rows={1}
                    placeholder="Message Neural..."
                    className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-zinc-600"
                  />

                  {/* Composer Bottom */}
                  <div className="flex items-center justify-between px-1 pb-0.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.07] hover:text-zinc-300"
                        title="Attach file"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="hidden h-8 items-center gap-2 rounded-lg px-2 text-xs text-zinc-500 transition hover:bg-white/[0.07] hover:text-zinc-300 sm:flex"
                      >
                        <Globe className="h-4 w-4" />
                        Web search
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-zinc-600"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>

              <p className="mt-2 text-center text-[10px] text-zinc-700 sm:text-xs">
                Neural AI can make mistakes. Check important information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
