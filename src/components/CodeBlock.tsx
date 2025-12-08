import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export const CodeBlock = ({ code, language = "python", title, className }: CodeBlockProps) => {
  return (
    <div className={cn("rounded-xl overflow-hidden border border-border", className)}>
      {title && (
        <div className="px-4 py-2 bg-secondary/70 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-warning/60" />
            <span className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">{title}</span>
        </div>
      )}
      <pre className="p-4 bg-card/50 overflow-x-auto">
        <code className="text-xs font-mono text-foreground/90 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
};
