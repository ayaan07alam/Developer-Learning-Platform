// components/TutorialCard.js
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cardVariants = {
  hover: {
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const TutorialCard = ({ title, description, link }) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      whileHover="hover"
      className={cn(
        "relative block p-8 rounded-3xl overflow-hidden group border border-border/50",
        "bg-card/50 backdrop-blur-sm dark:bg-card/20",
        "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground group-hover:from-primary group-hover:to-accent transition-all duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>
        <span className="text-xs font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
          Start Learning →
        </span>
      </div>
    </motion.a>
  );
};

export default TutorialCard;
