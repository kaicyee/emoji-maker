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

  const handleLike = async (id: number, liked: boolean) => {
    try {
      const response = await fetch('/api/emoji/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emojiId: id, like: liked }),
      });

      if (response.ok) {
        setEmojis(prevEmojis =>
          prevEmojis.map(emoji =>
            emoji.id === id
              ? { ...emoji, likes_count: liked ? emoji.likes_count + 1 : Math.max(0, emoji.likes_count - 1) }
              : emoji
          )
        );
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Emoji Generator</h1>
      <EmojiGenerator addEmoji={addEmoji} />
      <div className="w-full mt-12">
        <EmojiGrid emojis={emojis} onLike={handleLike} />
      </div>
    </main>
  );
}
