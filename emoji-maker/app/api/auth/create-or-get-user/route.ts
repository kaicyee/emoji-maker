import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user exists in 'profiles' table
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // If user doesn't exist, create a new profile
    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        credits: 3,
        tier: 'free'
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error in create-or-get-user route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}