
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Network } from "lucide-react";

export function MindMapGenerator() {
  const [topic, setTopic] = useState('');
  const [mindMap, setMindMap] = useState('');

  const handleGenerateMindMap = () => {
    // Implementation for mind map generation would go here
    const generatedMindMap = `Mind map for ${topic}:\n\nCenter: ${topic}\n- Branch 1\n  - Sub-topic 1\n  - Sub-topic 2\n- Branch 2\n  - Sub-topic 3\n  - Sub-topic 4`;
    setMindMap(generatedMindMap);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Network className="h-5 w-5" />
          <span className="sr-only">Generate Mind Map</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Mind Map</DialogTitle>
          <DialogDescription>
            Enter a topic to generate an interactive mind map.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter topic (e.g., Ancient Rome)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleGenerateMindMap} disabled={!topic.trim()}>
            Generate Mind Map
          </Button>
          {mindMap && (
            <Textarea
              value={mindMap}
              readOnly
              className="h-[200px]"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
