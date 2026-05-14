import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "@/lib/config/supabase";

export function createClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase 环境变量未配置，无法创建浏览器客户端。");
  }

  return createBrowserClient<Database>(config.url, config.anonKey);
}
