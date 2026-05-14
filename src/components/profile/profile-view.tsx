import { UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "@/components/profile/logout-button";
import { getSupabaseConfig } from "@/lib/config/supabase";
import { createClient } from "@/lib/supabase/server";

export async function ProfileView() {
  const config = getSupabaseConfig();
  let email = "未连接 Supabase";

  if (config) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "未获取到账户邮箱";
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2 pt-2">
        <p className="text-sm text-muted-foreground">我的</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">账户与人设资产</h1>
        <p className="text-sm leading-6 text-zinc-600">Phase 2 先接账号和会话，人设档案在 Phase 3 填。</p>
      </header>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-3xl bg-muted">
            <UserRound className="size-6 text-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">当前账号</p>
            <p className="truncate text-base font-semibold text-foreground">{email}</p>
          </div>
        </div>
      </Card>

      {config ? <LogoutButton /> : null}
    </div>
  );
}
