import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const emojiId = searchParams.get('emojiId');

  if (!emojiId) {
    return NextResponse.json({ error: 'Missing emojiId' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('user_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('emoji_id', emojiId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({ is_liked: !!data });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json({ error: 'Failed to fetch like status' }, { status: 500 });
  }
}