import { Mail, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

const INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@dmdlab.example",
    href: "mailto:hello@dmdlab.example",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "MUST Campus, Uganda",
    href: undefined,
  },
  {
    icon: Clock,
    label: "Visiting",
    value: "Mon–Fri · 9:00–17:00",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        index="06"
        eyebrow="Reach the lab"
        title={
          <>
            Let&apos;s <em className="text-accent2">Talk</em>
          </>
        }
        lead="Collaborations, student inquiries, media — all welcome. Tell us what you have in mind."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            {INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-mono-x text-xs text-muted">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-display text-xl tracking-tight transition-colors hover:text-accent2"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-display text-xl tracking-tight">{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono-x text-xs text-muted">Office hours</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Lab meetings are held every Friday at 14:00 in the AI wing, room
                B204. Visitors are welcome — email ahead so we can plan for you.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-blob border border-line bg-surface p-7 sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
