import { Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

type AuthMode = "login" | "register";

const modeCopy: Record<AuthMode, { title: string; desc: string; button: string; switchText: string; switchHref: string }> = {
  login: {
    title: "登录账户",
    desc: "登录后才能访问你的朋友圈内容、日历和人设资产。",
    button: "登录",
    switchText: "还没有账号？去注册",
    switchHref: "/register",
  },
  register: {
    title: "创建账户",
    desc: "先用邮箱创建账号，后面所有人设和内容都跟着你走。",
    button: "注册",
    switchText: "已有账号？去登录",
    switchHref: "/login",
  },
};

export function AuthCard({ mode }: { mode: AuthMode }) {
  const copy = modeCopy[mode];

  return (
    <Card className="w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{copy.desc}</p>
      </div>

      <Suspense fallback={<p className="mt-6 text-center text-sm text-muted-foreground">表单加载中...</p>}>
        <AuthForm mode={mode} buttonText={copy.button} />
      </Suspense>

      <Link className="mt-5 block text-center text-sm font-semibold text-foreground" href={copy.switchHref}>
        {copy.switchText}
      </Link>
    </Card>
  );
}
