import { CalendarDays, Home, Library, Sparkles, UserRound } from "lucide-react";

export type TabKey = "home" | "generate" | "calendar" | "materials" | "profile";

export type MainTab = {
  key: TabKey;
  label: string;
  href: string;
  icon: typeof Home;
};

export const mainTabs = [
  { key: "home", label: "首页", href: "/", icon: Home },
  { key: "generate", label: "生成", href: "/generate", icon: Sparkles },
  { key: "calendar", label: "日历", href: "/calendar", icon: CalendarDays },
  { key: "materials", label: "素材", href: "/materials", icon: Library },
  { key: "profile", label: "我的", href: "/profile", icon: UserRound },
] as const satisfies readonly MainTab[];

export function getTabByHref(pathname: string) {
  return mainTabs.find((tab) => tab.href === pathname) ?? mainTabs[0];
}
