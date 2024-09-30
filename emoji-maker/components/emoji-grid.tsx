'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';

type Emoji = {
  id: number;
  url: string;
  liked: boolean;
};

export default function EmojiGrid() {
  const [emojis, setEmojis] = useState<Emoji[]>([
    { id: 1, url: 'https://picsum.photos/200/200', liked: false },
    { id: 2, url: 'https://picsum.photos/201/201', liked: true },
    // Add more placeholder emojis as needed
  ]);

  const toggleLike = (id: number) => {
    setEmojis(emojis.map(emoji => 
      emoji.id === id ? { ...emoji, liked: !emoji.liked } : emoji
    ));
  };

  const downloadEmoji = (url: string) => {
    // TODO: Implement download functionality
    console.log('Downloading:', url);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="relative group">
          <Image src={emoji.url} alt="Emoji" width={200} height={200} className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => downloadEmoji(emoji.url)} className="text-white mr-2">
              <Download size={24} />
            </button>
            <button onClick={() => toggleLike(emoji.id)} className="text-white">
              <Heart size={24} fill={emoji.liked ? 'white' : 'none'} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}