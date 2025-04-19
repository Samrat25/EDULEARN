import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function LoadingButton({
  onClick,
  children,
  className,
  variant = "default",
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2;
          // When we reach 90%, we'll wait for the actual operation to complete
          return newProgress < 90 ? newProgress : 90;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLoading, progress]);

  const handleClick = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      await onClick();
      // When operation completes, quickly go to 100%
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant={variant}
        className={cn("relative overflow-hidden transition-all", className)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary">
            <div className="h-1 w-full bg-primary-foreground/20 absolute bottom-0 left-0">
              <div
                className="h-full bg-primary-foreground transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
      </Button>
      {isLoading && (
        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs font-medium">
          {progress}%
        </span>
      )}
    </div>
  );
}
