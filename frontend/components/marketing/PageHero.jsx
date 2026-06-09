"use client";
import { motion } from "framer-motion";

export default function PageHero({
    label,
    title,
    description,
    children,
    className = "",
}) {
    return (
        <section className={`relative pt-24 pb-12 md:pb-16 border-b border-border bg-card/50 ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
            <div className="container relative mx-auto px-4 md:px-6 max-w-screen-xl">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl"
                >
                    {label && (
                        <p className="section-label mb-4">{label}</p>
                    )}
                    <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-foreground leading-[1.1] mb-4">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    )}
                    {children && (
                        <div className="mt-8 flex flex-wrap gap-3">{children}</div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
