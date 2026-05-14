import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "@/lib/config/supabase";

export async function createClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase 环境变量未配置，无法创建服务端客户端。");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components 不能写 Cookie；src/proxy.ts 会负责刷新会话。
        }
      },
    },
  });
}
