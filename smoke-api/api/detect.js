export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "仅支持POST" });
  }
  try {
    const { image } = req.body;
    const MS_TOKEN = process.env.MS_TOKEN;
    const MODEL_ID = "iic/cv_tinynas_object-detection_damoyolo_cigarette";

    const resp = await fetch("https://modelscope.cn/api/v1/models/" + MODEL_ID + "/infer", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          image: image
        }
      })
    });
    const result = await resp.json();
    let hasSmoke = false;
    if (result.output && result.output.boxes) {
      for (const box of result.output.boxes) {
        if (box.label === "cigarette") {
          hasSmoke = true;
          break;
        }
      }
    }
    return res.json({
      success: true,
      hasSmoke: hasSmoke,
      raw: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "识别失败", err: err.message });
  }
}
