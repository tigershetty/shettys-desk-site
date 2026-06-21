import TextTypewriter from "@/components/TextTypewriter";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
      <TextTypewriter
        duration={2.2}
        className="font-mono text-sm text-muted-foreground"
      >
        a(gent) is thinking....
      </TextTypewriter>
    </div>
  );
}
