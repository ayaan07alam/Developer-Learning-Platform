"use client";
import { User, Mail } from 'lucide-react';
import Image from 'next/image';

export default function AuthorCard({ author }) {
    if (!author) return null;

    const hasProfilePhoto = author.profilePhoto && author.profilePhoto.trim() !== '';
    const hasBio = author.bio && author.bio.trim() !== '';

    return (
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-center gap-4">
                {/* Avatar / Profile Photo */}
                <div className="flex-shrink-0">
                    {hasProfilePhoto ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                            <Image
                                src={author.profilePhoto}
                                alt={author.displayName || 'Author'}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{author.displayName || 'Anonymous'}</h4>
                    {hasBio && (
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                            {author.bio}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
