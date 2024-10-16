'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Download } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
  is_liked?: boolean;
}

interface EmojiGridProps {
  emojis: Emoji[];
  setEmojis: React.Dispatch<React.SetStateAction<Emoji[]>>;
}

export default function EmojiGrid({ emojis, setEmojis }: EmojiGridProps) {
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchLikeStatuses();
    }
  }, [userId, emojis]);

  const fetchLikeStatuses = async () => {
    const updatedEmojis = await Promise.all(
      emojis.map(async (emoji) => {
        const response = await fetch(`/api/emoji/like-status?emojiId=${emoji.id}`);
        if (response.ok) {
          const { is_liked } = await response.json();
          return { ...emoji, is_liked };
        }
        return emoji;
      })
    );
    setEmojis(updatedEmojis);
  };

  const toggleLike = async (id: number) => {
    try {
      const response = await fetch('/api/emoji/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emojiId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const { likes_count, is_liked } = await response.json();

      setEmojis(prevEmojis =>
        prevEmojis.map(emoji =>
          emoji.id === id ? { ...emoji, likes_count, is_liked } : emoji
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">
          <Image src={emoji.image_url} alt={emoji.prompt} width={200} height={200} />
          <p className="mt-2 text-center">{emoji.prompt}</p>
          <p className="text-xs text-gray-500">Likes: {emoji.likes_count}</p>
          <div className="flex space-x-4 mt-2">
            <button 
              onClick={() => toggleLike(emoji.id)}
              className={`p-1 rounded-full ${emoji.is_liked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart size={20} fill={emoji.is_liked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700">
              <Download size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
