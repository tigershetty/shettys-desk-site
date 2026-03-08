interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export default function TextShimmer({
  children,
  className = "",
  duration = 2.5,
}: TextShimmerProps) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-muted-foreground via-primary to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer ${className}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </span>
  );
}
