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
import { BookText } from "lucide-react";

export function NotesGenerator() {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const handleGenerateNotes = () => {
    // Implementation for notes generation would go here
    const generatedNotes = `Sample notes for ${topic}:\n\n1. Key Point 1\n2. Key Point 2\n3. Key Point 3`;
    setNotes(generatedNotes);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <BookText className="h-5 w-5" />
          <span className="sr-only">Generate Notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Study Notes</DialogTitle>
          <DialogDescription>
            Enter a topic to generate comprehensive study notes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter topic (e.g., Photosynthesis)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleGenerateNotes} disabled={!topic.trim()}>
            Generate Notes
          </Button>
          {notes && (
            <Textarea
              value={notes}
              readOnly
              className="h-[200px]"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
