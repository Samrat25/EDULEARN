import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { searchWikipedia, getArticleContent, getFullArticleContent, createRoadmapFromArticle, type WikipediaArticle, type WikipediaSearchResult, type RoadmapData, type WikipediaSection } from "../services/wikipedia";
import { Search, Download, Network, ArrowRight } from "lucide-react";
import LoadingButton from "./LoadingButton";
import ForceGraph2D from "react-force-graph-2d";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function MindmapGenerator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<WikipediaArticle | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { theme } = useTheme();
  
  // Determine arrow color based on theme
  const getArrowColor = () => {
    return theme === 'dark' ? "#ffffff" : "#000000";
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (graphRef.current) {
        const width = graphRef.current.clientWidth;
        setDimensions({
          width: width,
          height: Math.max(500, window.innerHeight * 0.6)
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchWikipedia(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Failed to search Wikipedia. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (pageid: number) => {
    try {
      setIsLoading(true);
      setSearchResults([]);
      
      // Get the full article content including sections
      const articleData = await getFullArticleContent(pageid);
      
      // Create a simplified article object for state
      const article: WikipediaArticle = {
        title: articleData.title,
        extract: articleData.extract,
        pageid: pageid,
        images: articleData.images
      };
      
      setSelectedArticle(article);
      
      // Create roadmap data from the article and its sections
      const data = createRoadmapFromArticle(article, articleData.sections);
      setRoadmapData(data);
      
      toast.success("Roadmap created successfully!");
    } catch (error) {
      console.error("Error getting article:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMindmap = async () => {
    if (!graphRef.current) return;
    
    try {
      toast.info("Preparing download...");
      const dataUrl = await htmlToImage.toPng(graphRef.current, { quality: 0.95 });
      saveAs(dataUrl, `${selectedArticle?.title || 'roadmap'}.png`);
      toast.success("Roadmap downloaded successfully!");
    } catch (error) {
      console.error("Error downloading mindmap:", error);
      toast.error("Failed to download. Please try again.");
    }
  };

  const handleNodeClick = async (node: any) => {
    if (node.type === 'topic' && node.pageid) {
      try {
        toast.info(`Loading information about ${node.name}...`);
        await handleSelectResult(node.pageid);
      } catch (error) {
        console.error("Error loading related topic:", error);
        toast.error("Failed to load topic. Please try again.");
      }
    }
  };

  const renderNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    // Adjust font size based on node value and scale
    const fontSize = Math.max(14, (node.val || 8) * 1.2) / globalScale;
    ctx.font = `${fontSize}px Inter`;
    
    // Calculate text dimensions
    const textWidth = ctx.measureText(label).width;
    const padding = fontSize * 0.7;
    const bckgDimensions = [textWidth + padding * 2, fontSize + padding];
    
    // Draw background with rounded corners
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const cornerRadius = 4 / globalScale;
    
    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(node.x - bckgDimensions[0] / 2 + cornerRadius, node.y - bckgDimensions[1] / 2);
    ctx.lineTo(node.x + bckgDimensions[0] / 2 - cornerRadius, node.y - bckgDimensions[1] / 2);
    ctx.quadraticCurveTo(node.x + bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, node.x + bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 + cornerRadius);
    ctx.lineTo(node.x + bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2 - cornerRadius);
    ctx.quadraticCurveTo(node.x + bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2, node.x + bckgDimensions[0] / 2 - cornerRadius, node.y + bckgDimensions[1] / 2);
    ctx.lineTo(node.x - bckgDimensions[0] / 2 + cornerRadius, node.y + bckgDimensions[1] / 2);
    ctx.quadraticCurveTo(node.x - bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2, node.x - bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2 - cornerRadius);
    ctx.lineTo(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 + cornerRadius);
    ctx.quadraticCurveTo(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, node.x - bckgDimensions[0] / 2 + cornerRadius, node.y - bckgDimensions[1] / 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw node circle
    const nodeSize = 5 / globalScale;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = node.color || '#9333ea';
    ctx.fill();
    
    // Draw the text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(label, node.x, node.y);
  };

  return (
    <div className="container py-6 max-w-6xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Knowledge Roadmap Generator</h1>
      
      <div className="relative mb-6">
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter a topic to create a roadmap..."
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
      
      {isLoading ? (
        <Card className="animate-pulse p-12 text-center">
          <Network className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
          <h3 className="text-xl font-medium">Generating your knowledge roadmap...</h3>
          <p className="text-muted-foreground mt-2">
            Analyzing content and creating connections between topics.
          </p>
        </Card>
      ) : roadmapData ? (
        <Card className="animate-scale-in shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedArticle?.title}</CardTitle>
                <CardDescription className="max-w-3xl">
                  {selectedArticle?.extract.substring(0, 200)}...
                  <span className="text-primary font-medium ml-1">Click on nodes to explore related topics</span>
                </CardDescription>
              </div>
              <Network className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden rounded-md">
            <div ref={graphRef} className="w-full">
              <ForceGraph2D
                graphData={roadmapData}
                width={dimensions.width}
                height={dimensions.height}
                nodeLabel={(node: any) => node.name}
                nodeCanvasObject={renderNode}
                nodeRelSize={6}
                onNodeClick={handleNodeClick}
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={1}
                linkWidth={(link: any) => (link.value || 1) * 1.5}
                linkColor={() => getArrowColor()}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => getArrowColor()}
                cooldownTime={3000}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.1}
                onEngineStop={() => console.log("Graph physics stabilized")}
                backgroundColor={"transparent"}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1" /> 
                Click on any node to explore that topic
              </span>
            </div>
            <LoadingButton onClick={downloadMindmap}>
              <Download className="mr-2 h-4 w-4" />
              Download Roadmap
            </LoadingButton>
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Network className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-center">Create a Knowledge Roadmap</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              Search for any topic and create an interactive roadmap that helps you
              navigate through related concepts and ideas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
