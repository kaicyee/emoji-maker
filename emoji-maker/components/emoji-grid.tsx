'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Download } from 'lucide-react';

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
}

interface EmojiGridProps {
  emojis: Emoji[];
  onLike: (id: number, liked: boolean) => void;
}

export default function EmojiGrid({ emojis, onLike }: EmojiGridProps) {
  const [likedEmojis, setLikedEmojis] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedEmojis(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        onLike(id, false);
      } else {
        newSet.add(id);
        onLike(id, true);
      }
      return newSet;
    });
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">
          <div className="relative w-full h-48 mb-2">
            <Image
              src={emoji.image_url}
              alt={emoji.prompt}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-sm truncate w-full text-center">{emoji.prompt}</p>
          <p className="text-xs text-gray-500">Likes: {emoji.likes_count + (likedEmojis.has(emoji.id) ? 1 : 0)}</p>
          <div className="flex space-x-4 mt-2">
            <button 
              onClick={() => toggleLike(emoji.id)}
              className={`p-1 rounded-full ${likedEmojis.has(emoji.id) ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart size={20} fill={likedEmojis.has(emoji.id) ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => handleDownload(emoji.image_url, emoji.prompt)}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
