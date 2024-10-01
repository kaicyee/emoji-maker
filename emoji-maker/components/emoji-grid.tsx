'use client';

import React from 'react';
import Image from 'next/image';

interface EmojiGridProps {
  emojis: string[];
}

const EmojiGrid: React.FC<EmojiGridProps> = ({ emojis }) => {
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
        </div>
      ))}
    </div>
  );
};

export default EmojiGrid;