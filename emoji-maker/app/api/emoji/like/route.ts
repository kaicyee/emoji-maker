import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emojiId } = await request.json();

  try {
    // Check if the user has already liked this emoji
    const { data: existingLike, error: likeError } = await supabase
      .from('user_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('emoji_id', emojiId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') throw likeError;

    let is_liked: boolean;
    let likes_count: number;

    if (existingLike) {
      // Unlike
      await supabase
        .from('user_likes')
        .delete()
        .eq('user_id', userId)
        .eq('emoji_id', emojiId);

      const { data: updatedEmoji } = await supabase.rpc('decrement_likes', { p_emoji_id: emojiId });
      likes_count = updatedEmoji.likes_count;
      is_liked = false;
    } else {
      // Like
      await supabase
        .from('user_likes')
        .insert({ user_id: userId, emoji_id: emojiId });

      const { data: updatedEmoji } = await supabase.rpc('increment_likes', { p_emoji_id: emojiId });
      likes_count = updatedEmoji.likes_count;
      is_liked = true;
    }

    return NextResponse.json({ success: true, likes_count, is_liked });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
