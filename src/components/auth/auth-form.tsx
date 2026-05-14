"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/config/app-mode";
import { getSupabaseConfig } from "@/lib/config/supabase";
import { getSafeRedirectPath } from "@/lib/navigation-security";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
  buttonText: string;
};

export function AuthForm({ mode, buttonText }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = Boolean(getSupabaseConfig());
  const canUseDemoMode = isDemoMode() && !isConfigured;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (canUseDemoMode) {
      router.push(getSafeRedirectPath(searchParams.get("next")));
      router.refresh();
      return;
    }

    if (!isConfigured) {
      setMessage("Supabase 环境变量未配置，暂时不能登录或注册。");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const credentials = { email, password };
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      const nextPath = getSafeRedirectPath(searchParams.get("next"));
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "认证失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>邮箱</span>
        <input
          className="min-h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="演示模式无需填写"
          required={!canUseDemoMode}
          disabled={canUseDemoMode}
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span>密码</span>
        <input
          className="min-h-11 w-full rounded-2xl border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="演示模式无需填写"
          minLength={canUseDemoMode ? undefined : 6}
          required={!canUseDemoMode}
          disabled={canUseDemoMode}
        />
      </label>

      {message ? <p className="rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">{message}</p> : null}

      {canUseDemoMode ? (
        <p className="rounded-2xl bg-zinc-100 p-3 text-xs leading-5 text-zinc-600">
          当前为演示模式，不需要注册登录，点击按钮直接进入工作台。
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isSubmitting || (!isConfigured && !canUseDemoMode)}>
        {isSubmitting ? "处理中..." : canUseDemoMode ? "进入演示工作台" : buttonText}
      </Button>
    </form>
  );
}
