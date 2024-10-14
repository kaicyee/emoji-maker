'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
}

interface EmojiGeneratorProps {
  addEmoji: (emoji: Emoji) => void;
}

export default function EmojiGenerator({ addEmoji }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/emoji/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate emoji');
      }

      const data: Emoji = await response.json();
      addEmoji(data);
      setPrompt('');
    } catch (error) {
      console.error('Error generating emoji:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt for your emoji"
        className="w-full"
      />
      <Button type="submit" disabled={isLoading || !prompt}>
        {isLoading ? 'Generating...' : 'Generate Emoji'}
      </Button>
    </form>
  );
}