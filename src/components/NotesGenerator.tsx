import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { searchWikipedia, getArticleContent, type WikipediaArticle, type WikipediaSearchResult } from "../services/wikipedia";
import { Search, Download, BookOpen } from "lucide-react";
import LoadingButton from "./LoadingButton";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

export default function NotesGenerator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<WikipediaArticle | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchWikipedia(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (pageid: number) => {
    try {
      const article = await getArticleContent(pageid);
      setSelectedResult(article);
      setSearchResults([]);
    } catch (error) {
      console.error("Error getting article:", error);
    }
  };

  const downloadAsImage = async () => {
    if (!selectedResult) return;
    
    const notesElement = document.getElementById("notes-content");
    if (!notesElement) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(notesElement, { quality: 0.95 });
      saveAs(dataUrl, `${selectedResult.title}-notes.png`);
    } catch (error) {
      console.error("Error downloading notes as image:", error);
    }
  };
  
  const downloadAsText = () => {
    if (!selectedResult) return;
    
    const blob = new Blob([`# ${selectedResult.title}\n\n${selectedResult.extract}`], {
      type: "text/plain;charset=utf-8"
    });
    
    saveAs(blob, `${selectedResult.title}-notes.txt`);
  };

  return (
    <div className="container py-6 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Notes Generator</h1>
      
      <div className="relative mb-6">
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter a topic to search on Wikipedia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            className="ml-2" 
            disabled={isSearching}
          >
            {isSearching ? 
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 animate-pulse" />
                Searching...
              </div> 
              : 
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search
              </div>
            }
          </Button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-md">
            <ul>
              {searchResults.map((result) => (
                <li
                  key={result.pageid}
                  onClick={() => handleSelectResult(result.pageid)}
                  className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                >
                  <p className="font-medium">{result.title}</p>
                  <p 
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: result.snippet }}
                  ></p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {selectedResult ? (
        <Card className="animate-scale-in shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedResult.title}</CardTitle>
                <CardDescription>Generated notes from Wikipedia</CardDescription>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent id="notes-content" className="prose dark:prose-invert max-w-none">
            {selectedResult.images.length > 0 && (
              <div className="mb-6 flex justify-center">
                <img
                  src={selectedResult.images[0]}
                  alt={selectedResult.title}
                  className="max-h-64 rounded-lg shadow-sm"
                />
              </div>
            )}
            
            <h1>{selectedResult.title}</h1>
            {selectedResult.extract.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            
            {selectedResult.images.slice(1).length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {selectedResult.images.slice(1).map((img, idx) => (
                  <div key={idx} className="flex justify-center">
                    <img
                      src={img}
                      alt={`${selectedResult.title} - image ${idx + 1}`}
                      className="max-h-40 rounded-lg shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <LoadingButton
              onClick={async () => {
                await downloadAsImage();
              }}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download as Image
            </LoadingButton>
            <LoadingButton
              onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 500));
                downloadAsText();
              }}
              variant="default"
            >
              <Download className="mr-2 h-4 w-4" />
              Download as Text
            </LoadingButton>
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-center">Search for a topic to generate notes</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              Enter any topic in the search box above and select a result to generate
              comprehensive notes based on Wikipedia content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
