import { NextRequest, NextResponse } from "next/server";

type ImageRequestBody = {
  prompt?: string;
};

const rawImageBaseUrl = process.env.IMAGE_API_URL ?? process.env.IMAGE_COMPATIBLE_BASE_URL ?? "https://www.fmgo.top";
const IMAGE_API_URL = rawImageBaseUrl.endsWith("/images/generations")
  ? rawImageBaseUrl
  : `${rawImageBaseUrl.replace(/\/$/, "")}/v1/images/generations`;
const IMAGE_API_KEY = process.env.IMAGE_API_KEY ?? process.env.IMAGE_COMPATIBLE_API_KEY;
const IMAGE_MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ImageRequestBody;
  const prompt = createImagePrompt(body.prompt ?? "");

  if (!prompt.trim()) {
    return NextResponse.json({ error: "请输入要生成配图的内容。" }, { status: 400 });
  }

  if (!IMAGE_API_KEY) {
    return NextResponse.json({
      prompt,
      provider: "local-prompt-only",
      note: "当前未配置图片模型 Key，先返回可复制到图片模型的提示词。",
    });
  }

  try {
    const response = await fetch(IMAGE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IMAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        size: "1024x1024",
        n: 1,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: "图片生成失败。", detail, prompt }, { status: response.status });
    }

    const data = await response.json();
    const firstImage = data.data?.[0];
    const imageUrl = firstImage?.url;
    const base64 = firstImage?.b64_json;

    return NextResponse.json({
      imageUrl,
      imageBase64: base64 ? `data:image/png;base64,${base64}` : undefined,
      prompt,
      provider: IMAGE_MODEL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "图片生成服务暂时不可用。",
        detail: error instanceof Error ? error.message : "unknown error",
        prompt,
      },
      { status: 500 },
    );
  }
}

function createImagePrompt(source: string) {
  const text = source.trim();
  if (!text) return "";

  return `为一条微信朋友圈内容生成一张适合手机端发布的配图。画面要真实、自然、有生活感和信任感，不要像硬广海报，不要夸张营销字体。\n\n内容依据：\n${text}\n\n图片要求：\n- 竖版或方图构图，适合微信朋友圈\n- 真实生活/工作场景质感，干净、温暖、可信\n- 可以有轻微商业氛围，但不要有强推销感\n- 不要生成虚假聊天记录、虚假付款截图、虚假客户反馈\n- 如果需要文字，只使用少量中文短句，避免大段文字\n- 风格：高级但不冷、真实但不随便、能辅助建立信任`; 
}
