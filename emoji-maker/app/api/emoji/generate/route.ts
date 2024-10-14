import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Replicate from 'replicate';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await request.json();

  try {
    console.log('Generating emoji with prompt:', prompt);

    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: "A TOK emoji of " + prompt,
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 50,
        }
      }
    );

    console.log('Replicate output:', output);

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0];

      // Download the image
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const fileName = `${userId}/${Date.now()}.png`;
      const { data, error: uploadError } = await supabase.storage
        .from('emojis')
        .upload(fileName, buffer, {
          contentType: 'image/png',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('emojis')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Save to Supabase Database
      const { data: emojiData, error: dbError } = await supabase
        .from('emojis')
        .insert({
          image_url: publicUrl,
          prompt: prompt,
          creator_user_id: userId,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return NextResponse.json(emojiData);
    } else {
      throw new Error('No image generated');
    }
  } catch (error) {
    console.error('Error generating and uploading emoji:', error);
    return NextResponse.json({ error: 'Failed to generate and upload emoji' }, { status: 500 });
  }
}
