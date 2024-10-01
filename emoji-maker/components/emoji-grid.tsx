'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Download } from 'lucide-react';

interface EmojiGridProps {
  emojis: string[];
}

const EmojiGrid: React.FC<EmojiGridProps> = ({ emojis }) => {
  const [likes, setLikes] = useState<{ [key: number]: number }>({});

  const handleDownload = (emojiUrl: string, index: number) => {
    fetch(emojiUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `emoji-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading emoji:', error));
  };

  const handleLike = (index: number) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [index]: (prevLikes[index] || 0) + 1
    }));
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {emojis.map((emoji, index) => (
        <div key={index} className="w-[200px] h-[200px] relative border border-gray-300 p-1">
          <Image 
            src={emoji} 
            alt={`Emoji ${index + 1}`} 
            layout="fill" 
            objectFit="contain"
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button onClick={() => handleDownload(emoji, index)} className="p-1 bg-white rounded-full shadow-md">
              <Download size={20} />
            </button>
            <button onClick={() => handleLike(index)} className="p-1 bg-white rounded-full shadow-md">
              <Heart size={20} fill={likes[index] ? 'red' : 'none'} color={likes[index] ? 'red' : 'black'} />
              {likes[index] > 0 && <span className="ml-1">{likes[index]}</span>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmojiGrid;