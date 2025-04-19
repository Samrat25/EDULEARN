declare module 'react-force-graph-2d' {
    import { ComponentType } from 'react';
  
    interface Node {
      id: string;
      name?: string;
      val?: number;
      group?: number;
      [key: string]: any;
    }
  
    interface Link {
      source: string | Node;
      target: string | Node;
      value?: number;
      [key: string]: any;
    }
  
    interface GraphData {
      nodes: Node[];
      links: Link[];
    }
  
    interface ForceGraph2DProps {
      graphData: GraphData;
      nodeLabel?: string | ((node: Node) => string);
      nodeAutoColorBy?: string | ((node: Node) => string);
      nodeRelSize?: number;
      linkWidth?: number | ((link: Link) => number);
      linkDirectionalParticles?: number | ((link: Link) => number);
      linkDirectionalParticleSpeed?: number | ((d: any) => number);
      cooldownTime?: number;
      onEngineStop?: () => void;
      width?: number;
      height?: number;
      backgroundColor?: string;
      [key: string]: any;
    }
  
    const ForceGraph2D: ComponentType<ForceGraph2DProps>;
    export default ForceGraph2D;
  }
  
  declare module 'file-saver' {
    export function saveAs(data: Blob | string, filename?: string): void;
  }
  
  declare module 'html-to-image' {
    export function toPng(node: HTMLElement, options?: Object): Promise<string>;
    export function toJpeg(node: HTMLElement, options?: Object): Promise<string>;
    export function toBlob(node: HTMLElement, options?: Object): Promise<Blob>;
    export function toPixelData(node: HTMLElement, options?: Object): Promise<Uint8ClampedArray>;
    export function toSvg(node: HTMLElement, options?: Object): Promise<string>;
    export function toCanvas(node: HTMLElement, options?: Object): Promise<HTMLCanvasElement>;
  }
  