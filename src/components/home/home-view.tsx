import { ArrowRight, CalendarCheck, ImageUp, PenLine, Rocket, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const quickActions = [
  { title: "上传照片生成朋友圈", desc: "识别场景，生成文案和配图", icon: ImageUp },
  { title: "根据人设生成朋友圈", desc: "两句话文案 + 人设配图", icon: UserRound },
  { title: "创建发售计划", desc: "1 天、3 天、7 天节奏", icon: Rocket },
  { title: "创建 7/30 天运营计划", desc: "长期信任资产内容日历", icon: CalendarCheck },
];

export function HomeView() {
  return (
    <div className="space-y-5">
      <header className="space-y-2 pt-2">
        <p className="text-sm text-muted-foreground">今天</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">朋友圈运营工作台</h1>
        <p className="text-sm leading-6 text-zinc-600">
          先建立人设，再生成文案和配图。别每天临时憋，朋友圈不是许愿池。
        </p>
      </header>

      <Card className="bg-primary text-primary-foreground">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-300">今日待发</p>
            <p className="mt-2 text-4xl font-bold">0 条</p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">先完成 Phase 1 骨架，后续接入真实日历数据。</p>
          </div>
          <PenLine className="size-9 text-zinc-300" />
        </div>
        <Button className="mt-5 w-full bg-card text-card-foreground">立即生成</Button>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">快捷入口</h2>
          <span className="text-xs text-muted-foreground">MVP 核心流程</span>
        </div>
        <div className="grid gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="flex items-center gap-3 p-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight className="size-4 text-zinc-400" />
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
