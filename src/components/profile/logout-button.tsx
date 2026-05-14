"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogout() {
    setMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "退出登录失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {message ? <p className="rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">{message}</p> : null}
      <Button className="w-full" variant="secondary" onClick={handleLogout} disabled={isSubmitting}>
        {isSubmitting ? "退出中..." : "退出登录"}
      </Button>
    </div>
  );
}
