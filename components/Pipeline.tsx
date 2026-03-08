const steps = [
  "Curiosity",
  "Research",
  "Synthesize",
  "Visualize",
  "Publish",
  "Reflect",
];

export default function Pipeline() {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center sm:flex-1">
          <div className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground">
            {step}
          </div>
          {i < steps.length - 1 && (
            <span className="hidden px-2 text-primary sm:block">
              &rarr;
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
