'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface EmojiGeneratorProps {
  addEmoji: (emoji: string) => void;
}

const EmojiGenerator: React.FC<EmojiGeneratorProps> = ({ addEmoji }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedEmoji, setGeneratedEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateEmoji = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log('API Response:', data);
      if (data.success && Array.isArray(data.emoji) && data.emoji.length > 0) {
        console.log('Setting emoji URL:', data.emoji[0]);
        setGeneratedEmoji(data.emoji[0]);
        addEmoji(data.emoji[0]);
      } else {
        console.error('Failed to generate emoji:', data.error || 'No emoji URL returned');
        setGeneratedEmoji(null);
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
      setGeneratedEmoji(null);
    }
    setIsLoading(false);
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Enter a prompt for your emoji..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerateEmoji} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
        </Button>
      </div>
      {generatedEmoji ? (
        <div className="flex justify-center">
          <Image src={generatedEmoji} alt="Generated Emoji" width={200} height={200} />
        </div>
      ) : (
        <p>No emoji generated yet.</p> // Optional placeholder text
      )}
    </Card>
  );
};

export default EmojiGenerator;