import type { TabKey } from "@/lib/navigation";
import { mainTabs } from "@/lib/navigation";
import { Card } from "@/components/ui/card";

type EmptyViewContent = {
  title: string;
  desc: string;
};

const emptyViews: Record<Exclude<TabKey, "home">, EmptyViewContent> = {
  generate: {
    title: "生成中心",
    desc: "后续会放上传照片、人设生成、发售计划和事件型朋友圈入口。",
  },
  calendar: {
    title: "内容日历",
    desc: "后续会按日期展示待发、已复制、已下载、已发布的朋友圈内容。",
  },
  materials: {
    title: "素材库",
    desc: "后续会保存产品介绍、客户案例、好评反馈、金句观点和发售素材。",
  },
  profile: {
    title: "我的人设",
    desc: "后续会管理人设档案、个人形象库、默认生成设置和账户信息。",
  },
};

export function EmptyView({ tab }: { tab: Exclude<TabKey, "home"> }) {
  const view = emptyViews[tab];
  const tabConfig = mainTabs.find((item) => item.key === tab);
  const Icon = tabConfig?.icon;

  return (
    <div className="flex min-h-[70vh] items-center">
      <Card className="w-full text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-muted">
          {Icon ? <Icon className="size-7 text-foreground" /> : null}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground">{view.title}</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{view.desc}</p>
      </Card>
    </div>
  );
}
