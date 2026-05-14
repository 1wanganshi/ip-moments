import { NextRequest, NextResponse } from "next/server";
import { MOMENTS_COPYWRITER_SYSTEM_PROMPT } from "@/lib/prompts/moments-copywriter";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages?: ChatMessage[];
  mode?: string;
  imageName?: string | null;
};

const rawBaseUrl = process.env.OPENAI_API_URL ?? process.env.OPENAI_COMPATIBLE_BASE_URL ?? "https://coderxiaoc.com";
const OPENAI_API_URL = rawBaseUrl.endsWith("/chat/completions")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/chat/completions`;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? process.env.OPENAI_COMPATIBLE_API_KEY ?? "sk-ea5756298b01c1174344e292e3bf5c8434dafcc90b27173192171f86c04c5cdf";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? process.env.OPENAI_TEXT_MODEL ?? "gpt-5.5";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  const messages = body.messages?.filter((message) => message.content.trim()) ?? [];

  if (!messages.length) {
    return NextResponse.json({ error: "请输入要生成的内容。" }, { status: 400 });
  }

  const latest = messages[messages.length - 1]?.content ?? "";

  if (!OPENAI_API_KEY) {
    return NextResponse.json({
      reply: createFallbackReply(latest, body.mode, body.imageName),
      provider: "local-fallback",
    });
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.75,
        messages: [
          { role: "system", content: MOMENTS_COPYWRITER_SYSTEM_PROMPT },
          {
            role: "system",
            content: `当前工作模式：${body.mode ?? "auto"}。${body.imageName ? `用户上传了图片：${body.imageName}，如果无法看到图片内容，不要编造图片细节，先按用户文字描述处理。` : ""}`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "AI 服务暂时不可用。", detail: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      reply: reply || createFallbackReply(latest, body.mode, body.imageName),
      provider: OPENAI_MODEL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "生成失败，请稍后重试。",
        detail: error instanceof Error ? error.message : "unknown error",
      },
      { status: 500 },
    );
  }
}

function createFallbackReply(input: string, mode = "auto", imageName?: string | null) {
  const imageHint = imageName ? `\n\n我看到你上传了图片「${imageName}」。当前演示模式不能真正识图，所以先按你的文字描述来写。` : "";

  if (mode === "diagnose") {
    return `### 1. 发圈判断\n这条更适合先走「信任感 + 轻转化」路线，不建议一上来就硬卖。重点不是证明你多厉害，而是让客户觉得：这个人懂我、靠谱、可以聊。${imageHint}\n\n### 2. 推荐切入角度\n- **真实场景型**：从客户正在经历的问题切入。\n- **专业建议型**：给一个简单但有用的判断标准。\n- **轻互动型**：让客户愿意评论或私聊。\n\n### 3. 朋友圈成稿\n**标题：很多成交，不是输在产品，而是输在表达**\n\n有时候不是客户不需要，\n是他还没看懂：\n这件事跟他有什么关系。\n\n朋友圈最怕的，不是写得不够华丽。\n而是每一条都像在“通知别人我要卖东西”。\n\n真正容易让人愿意靠近的内容，\n通常会先让客户感觉到：\n你知道他的处境，\n也真的有办法帮他少走一点弯路。\n\n所以这条我更建议别急着成交，\n先把“为什么值得信任”讲清楚。\n\n**自评区建议：**\n如果你也有一条朋友圈不知道该怎么发，可以发我，我帮你看适合走信任型还是成交型。\n\n### 4. 发后动作\n有人点赞/评论后，可以私聊一句：\n“我刚看你也关注这个问题，你最近是不是也在想朋友圈怎么发更自然一点？”`;
  }

  if (mode === "series") {
    return `### 发售朋友圈节奏建议\n这类内容适合按「铺垫—造势—故事—价值—见证—答疑—收官」来发，不要一天内全讲完。${imageHint}\n\n1. **铺垫期**：讲目标客户现在的痛点。\n2. **造势期**：告诉大家你要准备一个解决方案。\n3. **故事期**：讲你为什么做这件事。\n4. **价值期**：拆解产品/服务能帮用户解决什么。\n5. **见证期**：放真实反馈或过程变化。\n6. **答疑期**：回应价格、时间、适不适合等顾虑。\n7. **收官期**：提醒名额/时间节点，给明确动作。\n\n### 示例第一条\n**标题：很多人不是不努力，是一直用错了发朋友圈的方式**\n\n我最近发现一个特别明显的问题：\n很多人明明产品不差，服务也认真，\n但朋友圈一发出来，客户就是没反应。\n\n不是因为客户都不买了，\n而是你的内容没有先建立信任。\n\n客户看完只知道你在卖，\n却不知道为什么该相信你、为什么现在该找你。\n\n接下来我会连续拆几条：\n一条朋友圈到底怎么写，\n才不像硬广，又能承接咨询。\n\n想看的可以先点个赞，\n我后面直接发案例。`;
  }

  return `### 1. 发圈判断\n这条可以走「专业可信 + 轻咨询」路线：先把客户的真实处境说出来，再给一个简单判断，最后轻轻承接私聊。${imageHint}\n\n### 2. 当前假设\n以下先按【目标是吸引咨询 / 语气真诚口语 / 不强硬成交】来写。\n\n### 3. 推荐切入角度\n- **痛点成交型**：适合想引发咨询。\n- **故事共鸣型**：适合素材有经历、有转折。\n- **专业价值型**：适合建立你“懂行”的感觉。\n\n### 4. 朋友圈成稿\n\n**版本A｜专业可信版**\n\n**标题：朋友圈不是发得越多越好，而是要发得让人愿意信你**\n\n很多人发朋友圈，\n最大的问题不是没内容。\n\n而是每一条都在说“我有什么”，\n却很少说清楚：\n客户看完能得到什么。\n\n客户不会因为一句“我很专业”就信任你，\n他更在意的是：\n你能不能看懂他的问题，\n能不能给他一个靠谱的判断，\n能不能让他少走一点弯路。\n\n所以朋友圈想要带来咨询，\n先别急着卖。\n\n先让人看见你的理解、方法和真实状态。\n信任起来了，成交才不会那么费劲。\n\n**自评区建议：**\n如果你也不知道自己的朋友圈适合怎么发，可以把素材发我，我帮你判断适合走信任型、价值型还是成交型。\n\n**版本B｜轻松聊天版**\n\n**标题：别把朋友圈发成广告栏**\n\n说实话，\n朋友圈最怕的不是卖东西。\n\n最怕的是——\n每一条都只让人感觉：你又要卖我了。\n\n好的朋友圈，应该先让人觉得你真实、靠谱、懂他。\n然后他才会愿意继续看，甚至主动来问。\n\n所以一条内容不用讲太多。\n抓住一个点，说清楚一个场景，给一个有用的建议。\n\n这样反而更容易被记住。\n\n**自评区建议：**\n你最近有哪条朋友圈不知道怎么写？评论区丢关键词，我帮你拆角度。\n\n### 5. 发圈执行建议\n- **配图**：优先用真实工作场景、聊天反馈、手写笔记、生活状态图。\n- **时间**：早上 8:00-9:30，或晚上 20:30-22:30。\n- **评论区**：可以补一句“如果你想要，我可以发你一个朋友圈结构模板”。\n- **私聊承接**：有人互动后，不要直接报价，先问“你现在更想解决内容没方向，还是发了没人问？”`;
}
