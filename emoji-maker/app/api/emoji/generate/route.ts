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

// At the top of the file, add this type definition
type ReplicateOutput = string[] | { [key: string]: any };

async function decreaseUserCredits(userId: string) {
  const { data, error } = await supabase.rpc('decrease_user_credits', { user_id: userId });
  if (error) throw error;
  return data;
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user has enough credits
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;
    if (user.credits < 1) {
      return NextResponse.json({ error: 'Not enough credits' }, { status: 403 });
    }

    const { prompt } = await request.json();

    console.log('Generating emoji with prompt:', prompt);

    // Update the type of output
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

    if (!output || (Array.isArray(output) && !output[0])) {
      throw new Error('Failed to generate emoji: No output from Replicate');
    }

    const imageUrl = Array.isArray(output) ? output[0] : output.image_url;

    // Step 4: Upload emoji to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('emojis')
      .upload(`${userId}/${Date.now()}.png`, await (await fetch(imageUrl)).blob(), {
        contentType: 'image/png'
      });

    if (uploadError) throw uploadError;

    // Step 5: Get public URL of uploaded emoji
    const { data: { publicUrl } } = supabase.storage
      .from('emojis')
      .getPublicUrl(uploadData.path);

    // Add emoji to 'emojis' table with creator_user_id
    const { data: emojiData, error: insertError } = await supabase
      .from('emojis')
      .insert({
        image_url: publicUrl,
        prompt,
        creator_user_id: userId
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Decrease user credits
    await decreaseUserCredits(userId);

    // Step 7: Return the created emoji data
    return NextResponse.json(emojiData);
  } catch (error) {
    console.error('Error generating and uploading emoji:', error);
    return NextResponse.json({ error: 'Error generating and uploading emoji' }, { status: 500 });
  }
}
