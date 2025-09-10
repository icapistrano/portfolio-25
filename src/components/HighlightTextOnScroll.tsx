import { FC, useMemo, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

export const HighlightTextOnScroll: FC<{
  paragraphs: string[];
  className?: string;
}> = ({ paragraphs, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });

  const count = Math.max(paragraphs.length, 1);

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((p, i) => {
        // paragraph i owns [i/count, (i+1)/count] of the overall progress
        const paraProgress = useTransform(
          scrollYProgress,
          [i / count, (i + 1) / count],
          [0, 1],
          { clamp: true },
        );
        return (
          <SequencedWordParagraph key={i} text={p} progress={paraProgress} />
        );
      })}
    </div>
  );
};

const SequencedWordParagraph: FC<{
  text: string;
  progress: MotionValue<number>; // 0..1 for THIS paragraph only
  base?: string;
  highlight?: string;
  className?: string;
}> = ({ text, progress, base = "#4A4A4A", highlight = "#F4F4F5" }) => {
  // split but keep spaces
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordIdxs = tokens
    .map((t, i) => (!/^\s+$/.test(t) ? i : null))
    .filter((i): i is number => i !== null);
  const total = Math.max(wordIdxs.length, 1);

  return (
    <p>
      {tokens.map((t, i) => {
        if (/^\s+$/.test(t)) return <span key={`s-${i}`}>{t}</span>;

        const rank = wordIdxs.indexOf(i);
        const wStart = rank / total;
        const wEnd = (rank + 1) / total;

        // map this paragraph's 0..1 progress into this word's own window
        const color = useTransform(progress, [wStart, wEnd], [base, highlight]);
        const opacity = useTransform(progress, [wStart, wEnd], [0.5, 1]);

        return (
          <motion.span key={`w-${i}`} style={{ color, opacity }}>
            {t}
          </motion.span>
        );
      })}
    </p>
  );
};
