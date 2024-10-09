import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { emojiId, like } = await request.json();

  try {
    const { data, error } = await supabase
      .from('emojis')
      .update({ likes_count: like ? supabase.sql`likes_count + 1` : supabase.sql`likes_count - 1` })
      .eq('id', emojiId)
      .select()
      .single();

    if (error) throw error;

    // Update the user_likes table to keep track of user likes
    if (like) {
      await supabase.from('user_likes').insert({ user_id: userId, emoji_id: emojiId });
    } else {
      await supabase.from('user_likes').delete().match({ user_id: userId, emoji_id: emojiId });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Error updating likes' }, { status: 500 });
  }
}