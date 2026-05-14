"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, Copy, ImagePlus, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COPYWRITER_MODE_LABELS, type CopywriterMode } from "@/lib/prompts/moments-copywriter";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const modeOptions: Array<{ value: CopywriterMode; desc: string }> = [
  { value: "quick", desc: "直接生成可发朋友圈" },
  { value: "diagnose", desc: "判断适不适合这样发" },
  { value: "rewrite", desc: "优化已有朋友圈草稿" },
  { value: "series", desc: "活动/发售一组内容" },
  { value: "life", desc: "生活日常建立信任" },
  { value: "sq", desc: "给客户解释的顾问话术" },
];

const starterPrompts = [
  "帮我写一条朋友圈，主题是：客户总觉得发朋友圈卖东西很尴尬。",
  "帮我判断这条文案会不会太硬，并改得更像真实朋友圈。",
  "我要做一个活动预热，帮我设计一组7天朋友圈节奏。",
];

export function CopywriterView() {
  const [mode, setMode] = useState<CopywriterMode>("quick");
  const [input, setInput] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "我是你的朋友圈自动成交文案教练。发我一张图、一个主题、一段草稿，或者直接说你想达成什么结果，我会帮你判断怎么发、写成可复制的朋友圈，并给发后承接建议。",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiMessages = useMemo(
    () => messages.filter((message) => message.id !== "welcome"),
    [messages],
  );

  async function handleSubmit(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const content = (preset ?? input).trim();

    if (!content || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: imageName ? `${content}\n\n[上传图片：${imageName}]` : content,
    };

    const nextMessages = [...apiMessages, userMessage];
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/copywriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, mode, imageName }),
      });
      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply ?? data.error ?? "生成失败了，你再试一次。",
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "网络开小差了。你可以先复制素材，我再帮你重新生成。",
        },
      ]);
    } finally {
      setIsLoading(false);
      setImageName(null);
    }
  }

  async function copyText(content: string) {
    await navigator.clipboard.writeText(content);
  }

  return (
    <div className="space-y-4 pb-4">
      <section className="rounded-[2rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-5 text-white shadow-lg shadow-zinc-300/70">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">
          <Sparkles className="h-3.5 w-3.5" />
          朋友圈自动成交文案系统
        </div>
        <h1 className="text-2xl font-bold leading-tight">把素材变成能建立信任、承接咨询的朋友圈</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          支持图片主题、草稿改写、活动发售、生活圈、SQ客户建议话术。默认写得像真实朋友圈，而不是硬广。
        </p>
      </section>

      <Card className="space-y-3 p-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">选择工作模式</h2>
          <span className="text-xs text-muted-foreground">当前：{COPYWRITER_MODE_LABELS[mode]}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                "rounded-2xl border p-3 text-left transition active:scale-[0.99]",
                mode === option.value
                  ? "border-zinc-900 bg-zinc-950 text-white"
                  : "border-border bg-white text-foreground",
              )}
            >
              <div className="text-sm font-semibold">{COPYWRITER_MODE_LABELS[option.value]}</div>
              <div className={cn("mt-1 text-xs", mode === option.value ? "text-zinc-300" : "text-muted-foreground")}>{option.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={cn("max-w-[82%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm", message.role === "user" ? "bg-zinc-950 text-white" : "border border-border bg-white text-foreground")}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === "assistant" && message.id !== "welcome" && (
                <button
                  type="button"
                  onClick={() => copyText(message.content)}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  <Copy className="h-3 w-3" />
                  复制结果
                </button>
              )}
            </div>
            {message.role === "user" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 shadow-sm">
                <UserRound className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            正在按朋友圈成交逻辑生成...
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="space-y-2">
          <p className="px-1 text-xs font-medium text-muted-foreground">试试这些开场：</p>
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSubmit(undefined, prompt)}
              className="block w-full rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm leading-5 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="sticky bottom-[76px] z-10 rounded-[1.75rem] border border-border bg-white p-2 shadow-xl shadow-zinc-300/70">
        {imageName && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <ImagePlus className="h-3.5 w-3.5" />
            已选择图片：{imageName}
            <button type="button" onClick={() => setImageName(null)} className="font-semibold text-foreground">移除</button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setImageName(event.target.files?.[0]?.name ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground"
            aria-label="上传图片"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={1}
            placeholder="发图片/主题/草稿/客户反馈，我帮你写朋友圈..."
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl bg-secondary px-4 py-3 text-sm leading-5 outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="mb-1 h-11 w-11 rounded-2xl p-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
