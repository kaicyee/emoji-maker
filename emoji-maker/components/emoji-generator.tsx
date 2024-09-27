'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedEmoji, setGeneratedEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateEmoji = async () => {
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
      if (data.success) {
        setGeneratedEmoji(data.emoji);
      } else {
        console.error('Failed to generate emoji:', data.error);
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
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
        <Button onClick={generateEmoji} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
        </Button>
      </div>
      {generatedEmoji && (
        <div className="flex justify-center">
          <Image src={generatedEmoji} alt="Generated Emoji" width={200} height={200} />
        </div>
      )}
    </Card>
  );
}