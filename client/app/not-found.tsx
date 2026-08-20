import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="noise-overlay flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono-x text-accent2">404</p>
      <h1 className="mt-4 font-display text-6xl leading-none tracking-tight sm:text-8xl">
        Lost in the lab
      </h1>
      <p className="mt-6 max-w-md text-muted">
        This page doesn&apos;t exist. Maybe it was moved, or never made it out of
        the notebook.
      </p>
      <div className="mt-10">
        <Button href="/" icon>
          Back home
        </Button>
      </div>
    </section>
  );
}
