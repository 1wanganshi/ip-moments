import Link from "next/link";
import { ArrowRight, CalendarCheck, ImagePlus, PenLine, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  {
    title: "主要生成入口已放到首页",
    desc: "打开首页就能输入图片、主题、草稿和客户反馈。",
    icon: Sparkles,
  },
  {
    title: "这里保留为功能说明",
    desc: "后面可以放历史记录、模板库、批量生成或收藏内容。",
    icon: PenLine,
  },
  {
    title: "配图能力已接入后台",
    desc: "文案生成后可以继续生成适合朋友圈的配图。",
    icon: ImagePlus,
  },
  {
    title: "内容计划后续接日历",
    desc: "7天/30天内容节奏建议，后续更适合放到日历页。",
    icon: CalendarCheck,
  },
];

export function GenerateGuideView() {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm shadow-zinc-200/70">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          生成说明
        </div>
        <h1 className="text-2xl font-bold leading-tight text-foreground">内容生成现在从首页开始</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          这样用户一打开就能直接操作，不需要先理解复杂菜单。这里先保留为说明页，后续可以扩展为历史记录或模板库。
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
        >
          回到首页开始生成
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="flex items-center gap-3 p-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.desc}</p>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
