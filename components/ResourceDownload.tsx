import { Download, FileArchive, ShieldCheck } from "lucide-react";

export default function ResourceDownload() {
  return (
    <div className="border-l-4 border-secondary bg-white p-5">
      <div className="flex items-start gap-3">
        <FileArchive
          className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
          aria-hidden
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">
            The complete pack is ready.
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Download v1.1.0 as a ZIP. No email address, account, or newsletter
            signup is required.
          </p>
          <a
            href="/api/resources/demand-sensing-router/download"
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto sm:text-sm"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download the complete pack
          </a>
          <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
              aria-hidden
            />
            The archive is served directly by Shetty&apos;s Desk and contains
            synthetic sample data only.
          </p>
        </div>
      </div>
    </div>
  );
}
