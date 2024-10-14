import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Fetch all emojis from the 'emojis' table
    const { data, error } = await supabase
      .from('emojis')
      .select('id, image_url, prompt, likes_count, creator_user_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Fetched emojis:', data); // Add this line for debugging

    // Step 2: Return the fetched emojis
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching emojis:', error);
    return NextResponse.json({ error: 'Error fetching emojis' }, { status: 500 });
  }
}
