"use client";
import { User, PenLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthorCard({ author }) {
    if (!author) return null;

    const hasProfilePhoto = author.profilePhoto && author.profilePhoto.trim() !== '';
    const hasBio = author.bio && author.bio.trim() !== '';
    const displayName = author.displayName || 'Anonymous';
    const initial = displayName[0]?.toUpperCase() || 'A';

    return (
        <div className="mt-12 relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <p className="section-label mb-5">About the author</p>
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-shrink-0">
                    {hasProfilePhoto ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                            <Image
                                src={author.profilePhoto}
                                alt={displayName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                            <span className="text-xl font-bold text-primary">{initial}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-foreground mb-1">{displayName}</h4>
                    {hasBio ? (
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                            {author.bio}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Contributor at RuntimeRiver — sharing practical engineering insights and tutorials.
                        </p>
                    )}
                    <Link
                        href="/dashboard/posts/new"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:underline"
                    >
                        <PenLine className="w-3.5 h-3.5" />
                        Write your own article
                    </Link>
                </div>
            </div>
        </div>
    );
}
