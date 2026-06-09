import Link from "next/link";
import { BookOpen, Rocket, Users, ArrowRight } from "lucide-react";
import PageHero from "@/components/marketing/PageHero";

export const metadata = {
  title: 'About Us',
  description: 'Learn more about RuntimeRiver — the open developer platform for technical articles, code execution, and free developer tools.',
  openGraph: {
    title: 'About Us - RuntimeRiver',
    description: 'Learn about our mission, values, and team at RuntimeRiver.',
    images: ['https://runtimeriver.com/about-og-image.jpg'],
  },
  twitter: {
    title: 'About Us - RuntimeRiver',
    description: 'Learn about our mission, values, and team at RuntimeRiver.',
    images: ['https://runtimeriver.com/about-twitter-image.jpg'],
  }
};

const values = [
  {
    icon: BookOpen,
    title: "Depth over noise",
    description: "We publish tutorials and guides that engineers actually use — practical, well-structured, and built to last beyond a trending headline.",
  },
  {
    icon: Rocket,
    title: "Ship while you learn",
    description: "Run code in the browser, format files instantly, and apply what you read without switching between a dozen tabs.",
  },
  {
    icon: Users,
    title: "Open by design",
    description: "Anyone can read, contribute, and grow here. RuntimeRiver is a community platform — not a closed content farm.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title="Where developers read, write, and build"
        description="RuntimeRiver is an open platform for technical publishing, in-browser code execution, and free developer utilities — built for engineers who care about craft."
      >
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Explore articles
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
        >
          Join the community
        </Link>
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="max-w-3xl mb-14">
            <p className="section-label mb-3">Our mission</p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-4 text-balance">
              Make high-quality engineering knowledge accessible to everyone
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The best technical content should be free to read, easy to discover, and rewarding to create.
              We combine an editorial blog, a contributor platform, and practical tools so developers can
              learn faster and share what they know.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-premium p-6 md:p-7">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl text-center">
          <p className="section-label mb-3">Get involved</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            Ready to contribute?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            Share a tutorial, publish your first article, or explore our free developer tools.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/posts/new" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Start writing
            </Link>
            <Link href="/tools" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">
              Browse tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
