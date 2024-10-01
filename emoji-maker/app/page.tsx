'use client';

import React, { useState } from 'react';
import EmojiGenerator from '../components/emoji-generator';
import EmojiGrid from '../components/emoji-grid';

export default function Home() {
  const [emojis, setEmojis] = useState<string[]>([]);

  const addEmoji = (newEmoji: string) => {
    setEmojis(prevEmojis => [...prevEmojis, newEmoji]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Emoji Generator</h1>
      <EmojiGenerator addEmoji={addEmoji} />
      <EmojiGrid emojis={emojis} />
    </main>
  );
}
