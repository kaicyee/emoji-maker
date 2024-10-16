'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import EmojiGenerator from '../components/emoji-generator';
import EmojiGrid from '../components/emoji-grid';

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
  is_liked?: boolean;
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchEmojis();
    }
  }, [isLoaded, userId]);

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emoji/list');
      if (response.ok) {
        const data = await response.json();
        setEmojis(data);
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  const addEmoji = (newEmoji: Emoji) => {
    setEmojis(prevEmojis => [newEmoji, ...prevEmojis]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Emoji Generator</h1>
      <EmojiGenerator addEmoji={addEmoji} />
      <div className="w-full mt-12">
        <EmojiGrid emojis={emojis} setEmojis={setEmojis} />
      </div>
    </main>
  );
}
