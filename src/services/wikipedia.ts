export interface WikipediaSearchResult {
    title: string;
    pageid: number;
    snippet: string;
  }
  
  export interface WikipediaArticle {
    title: string;
    extract: string;
    pageid: number;
    images: string[];
  }
  
  export interface WikipediaImage {
    title: string;
    url: string;
  }
  
  export async function searchWikipedia(query: string): Promise<WikipediaSearchResult[]> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          query
        )}&format=json&origin=*&srlimit=5`
      );
  
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.query.search.map((result: any) => ({
        title: result.title,
        pageid: result.pageid,
        snippet: result.snippet.replace(/<\/?span[^>]*>/g, ""),
      }));
    } catch (error) {
      console.error("Error searching Wikipedia:", error);
      return [];
    }
  }
  
  export async function getArticleContent(pageid: number): Promise<WikipediaArticle> {
    try {
      // Get the article content
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageid}&format=json&origin=*`
      );
  
      if (!contentResponse.ok) {
        throw new Error(`Wikipedia API error: ${contentResponse.statusText}`);
      }
  
      const contentData = await contentResponse.json();
      const page = contentData.query.pages[pageid];
      const title = page.title;
      const extract = page.extract;
  
      // Get images for the article
      const imagesResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=images&pageids=${pageid}&format=json&origin=*&imlimit=5`
      );
  
      if (!imagesResponse.ok) {
        throw new Error(`Wikipedia API error: ${imagesResponse.statusText}`);
      }
  
      const imagesData = await imagesResponse.json();
      const imageTitles = 
        imagesData.query.pages[pageid]?.images
          ?.filter((img: any) => !img.title.includes("Commons-logo") && !img.title.includes("Red Pencil Icon"))
          ?.map((img: any) => img.title) || [];
  
      // Get actual image URLs
      const images = await Promise.all(
        imageTitles.slice(0, 3).map(async (imageTitle: string) => {
          try {
            const imageInfoResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                imageTitle
              )}&prop=imageinfo&iiprop=url&format=json&origin=*`
            );
  
            if (!imageInfoResponse.ok) {
              throw new Error(`Wikipedia API error: ${imageInfoResponse.statusText}`);
            }
  
            const imageInfoData = await imageInfoResponse.json();
            const pages = imageInfoData.query.pages;
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;
            
            return imageUrl;
          } catch (error) {
            console.error("Error getting image URL:", error);
            return null;
          }
        })
      );
  
      const filteredImages = images.filter((url): url is string => url !== null);
  
      return {
        title,
        extract,
        pageid,
        images: filteredImages,
      };
    } catch (error) {
      console.error("Error getting Wikipedia article content:", error);
      return {
        title: "Error retrieving content",
        extract: "Sorry, there was an error retrieving the content from Wikipedia.",
        pageid,
        images: [],
      };
    }
  }
  
  export interface WikipediaSection {
    id: string;
    title: string;
    content: string;
    level: number;
    pageid?: number;
  }
  
  export async function getFullArticleContent(pageid: number): Promise<{
    title: string;
    extract: string;
    sections: WikipediaSection[];
    images: string[];
  }> {
    try {
      // Get the article content with sections
      const contentResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&pageids=${pageid}&prop=text|sections&format=json&origin=*`
      );
  
      if (!contentResponse.ok) {
        throw new Error(`Wikipedia API error: ${contentResponse.statusText}`);
      }
  
      const contentData = await contentResponse.json();
      const page = contentData.parse;
      const title = page.title;
      
      // For simplicity, we'll use the intro API to get a clean extract
      const introResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageid}&format=json&origin=*`
      );
      
      if (!introResponse.ok) {
        throw new Error(`Wikipedia API error: ${introResponse.statusText}`);
      }
      
      const introData = await introResponse.json();
      const extract = introData.query.pages[pageid].extract;
      
      // Extract sections (simplified for our use case)
      const sections = page.sections
        .filter((section: any) => section.line && section.index !== 0) // Filter out the intro section
        .slice(0, 8) // Limit to 8 sections for cleaner visualization
        .map((section: any) => {
          // Clean section titles by removing any HTML or API-specific formatting
          const cleanTitle = section.line
            .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
            .replace(/\[\d+\]/g, ""); // Remove citation references like [1], [2], etc.
            
          return {
            id: `section_${section.index}`,
            title: cleanTitle,
            content: `Section content for ${cleanTitle}`,
            level: section.level,
            pageid: undefined
          };
        });
      
      // Get images for the article (same as in getArticleContent)
      const imagesResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=images&pageids=${pageid}&format=json&origin=*&imlimit=5`
      );
  
      if (!imagesResponse.ok) {
        throw new Error(`Wikipedia API error: ${imagesResponse.statusText}`);
      }
  
      const imagesData = await imagesResponse.json();
      const imageTitles = 
        imagesData.query.pages[pageid]?.images
          ?.filter((img: any) => !img.title.includes("Commons-logo") && !img.title.includes("Red Pencil Icon"))
          ?.map((img: any) => img.title) || [];
  
      // Get actual image URLs
      const images = await Promise.all(
        imageTitles.slice(0, 3).map(async (imageTitle: string) => {
          try {
            const imageInfoResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                imageTitle
              )}&prop=imageinfo&iiprop=url&format=json&origin=*`
            );
  
            if (!imageInfoResponse.ok) {
              throw new Error(`Wikipedia API error: ${imageInfoResponse.statusText}`);
            }
  
            const imageInfoData = await imageInfoResponse.json();
            const pages = imageInfoData.query.pages;
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;
            
            return imageUrl;
          } catch (error) {
            console.error("Error getting image URL:", error);
            return null;
          }
        })
      );
  
      const filteredImages = images.filter((url): url is string => url !== null);
      
      // Get related topics for roadmap connections
      const relatedResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=10&gplnamespace=0&pageids=${pageid}&prop=info&inprop=url&format=json&origin=*`
      );
      
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        
        // If we got related topics, add them as sections
        if (relatedData.query && relatedData.query.pages) {
          const relatedPages = Object.values(relatedData.query.pages) as any[];
          const relatedSections = relatedPages
            .slice(0, 5) // Limit to 5 related topics
            .map((page: any, index: number) => {
              // Clean related page titles as well
              const cleanTitle = page.title
                .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                .replace(/\[\d+\]/g, ""); // Remove citation references
                
              return {
                id: `related_${index}`,
                title: cleanTitle,
                content: `Related topic: ${cleanTitle}`,
                level: 2,
                pageid: page.pageid
              };
            });
          
          // Add related topics as sections
          sections.push(...relatedSections);
        }
      }
  
      return {
        title,
        extract,
        sections,
        images: filteredImages,
      };
    } catch (error) {
      console.error("Error getting full Wikipedia article content:", error);
      return {
        title: "Error retrieving content",
        extract: "Sorry, there was an error retrieving the content from Wikipedia.",
        sections: [],
        images: [],
      };
    }
  }
  
  export function extractKeywords(text: string): string[] {
    // Basic extraction of potential keywords
    // Remove common words and keep only significant terms
    const commonWords = new Set([
      "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
      "by", "about", "as", "of", "is", "are", "was", "were", "be", "been", "being",
      "have", "has", "had", "do", "does", "did", "can", "could", "will", "would",
      "shall", "should", "may", "might", "must", "that", "which", "who", "whom",
      "whose", "what", "whatever", "when", "where", "how", "this", "these", "those"
    ]);
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 20);
  }
  
  export interface GraphNode {
    id: string;
    name: string;
    val?: number;
    group?: number;
  }
  
  export interface GraphLink {
    source: string;
    target: string;
    value?: number;
  }
  
  export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
  }
  
  export interface RoadmapNode extends GraphNode {
    type?: 'main' | 'section' | 'topic';
    color?: string;
    pageid?: number;
  }
  
  export interface RoadmapLink extends GraphLink {
    type?: 'section' | 'related';
  }
  
  export interface RoadmapData {
    nodes: RoadmapNode[];
    links: RoadmapLink[];
  }
  
  export function createGraphDataFromArticle(article: WikipediaArticle): GraphData {
    const keywords = extractKeywords(article.extract);
    
    // Create main node for the article
    const nodes: GraphNode[] = [
      { id: "main", name: article.title, val: 10, group: 1 },
    ];
    
    // Create nodes for keywords
    keywords.forEach((keyword, idx) => {
      nodes.push({
        id: `keyword-${idx}`,
        name: keyword,
        val: 5,
        group: 2
      });
    });
    
    // Create connections
    const links: GraphLink[] = [];
    keywords.forEach((_, idx) => {
      links.push({
        source: "main",
        target: `keyword-${idx}`,
        value: 2
      });
    });
    
    // Create some connections between keywords
    for (let i = 0; i < keywords.length; i++) {
      // Connect some keywords to each other to create a more interesting graph
      const numConnections = Math.min(3, keywords.length - 1);
      const connectedIndices = new Set<number>();
      
      while (connectedIndices.size < numConnections) {
        const targetIdx = Math.floor(Math.random() * keywords.length);
        if (targetIdx !== i && !connectedIndices.has(targetIdx)) {
          connectedIndices.add(targetIdx);
          links.push({
            source: `keyword-${i}`,
            target: `keyword-${targetIdx}`,
            value: 1
          });
        }
      }
    }
    
    return { nodes, links };
  }
  
  export function createRoadmapFromArticle(article: WikipediaArticle, sections: WikipediaSection[]): RoadmapData {
    // Create a consistent color palette for nodes
    const colors = {
      main: "#7c3aed",     // Main topic (purple)
      section: "#2563eb",  // Regular section (blue)
      related: "#059669",  // Related topic (green)
    };
  
    // Process article title - remove any HTML or API-specific formatting
    const cleanTitle = article.title
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
      .replace(/\[\d+\]/g, ""); // Remove citation references
  
    // Create main node for the article
    const nodes: RoadmapNode[] = [
      { 
        id: "main", 
        name: cleanTitle, 
        val: 15,
        color: colors.main,
        type: 'main'
      },
    ];
    
    // Create nodes for sections
    const sectionNodes: RoadmapNode[] = sections.map((section, idx) => {
      // Check if this is a related topic (has pageid)
      const isRelatedTopic = section.pageid !== undefined;
      
      // Clean section title
      const cleanSectionTitle = section.title
        .replace(/<\/?[^>]+(>|$)/g, "")  // Remove HTML tags
        .replace(/\[\d+\]/g, ""); // Remove citation references
      
      return {
        id: section.id,
        name: cleanSectionTitle,
        val: isRelatedTopic ? 10 : 8,
        color: isRelatedTopic ? colors.related : colors.section,
        type: isRelatedTopic ? 'topic' : 'section',
        pageid: isRelatedTopic ? section.pageid : undefined
      };
    });
    
    nodes.push(...sectionNodes);
    
    // Create connections in a roadmap style
    const links: RoadmapLink[] = [];
    
    // Connect main node to first-level sections
    const firstLevelSections = sections.filter(s => s.level === 1 || s.id.includes('related'));
    firstLevelSections.forEach((section) => {
      links.push({
        source: "main",
        target: section.id,
        value: 3,
        type: section.id.includes('related') ? 'related' : 'section'
      });
    });
    
    // Connect sections based on hierarchy
    for (let i = 0; i < sections.length; i++) {
      const currentSection = sections[i];
      
      // Skip related topics in hierarchy connections
      if (currentSection.id.includes('related')) continue;
      
      // Find child sections (sections at the next level)
      const childSections = sections.filter(
        s => s.level === currentSection.level + 1 && 
        sections.indexOf(s) > i &&
        !s.id.includes('related')
      );
      
      // Connect to child sections
      childSections.slice(0, 2).forEach(childSection => {
        links.push({
          source: currentSection.id,
          target: childSection.id,
          value: 2,
          type: 'section'
        });
      });
      
      // Connect some sections at the same level
      const sameLevelSections = sections.filter(
        s => s.level === currentSection.level && 
        s.id !== currentSection.id &&
        sections.indexOf(s) > i &&
        !s.id.includes('related')
      );
      
      sameLevelSections.slice(0, 1).forEach(siblingSection => {
        links.push({
          source: currentSection.id,
          target: siblingSection.id,
          value: 1,
          type: 'section'
        });
      });
    }
    
    // Add connections between related topics
    const relatedTopics = sections.filter(s => s.id.includes('related'));
    for (let i = 0; i < relatedTopics.length; i++) {
      for (let j = i + 1; j < relatedTopics.length; j++) {
        // Connect some related topics to each other (but not all)
        if (Math.random() > 0.5) {
          links.push({
            source: relatedTopics[i].id,
            target: relatedTopics[j].id,
            value: 1,
            type: 'related'
          });
        }
      }
    }
    
    return { nodes, links };
  }
  