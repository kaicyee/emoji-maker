import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateEmoji(prompt: string): Promise<string> {
  const input = {
    prompt: prompt,
    apply_watermark: false
  };

  const output = await replicate.run(
    "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    { input }
  );

  return output as string;
}
