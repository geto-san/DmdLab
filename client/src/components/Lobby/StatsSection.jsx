import React, { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Users } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { resolveIcon } from "../../utils/icons";

function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const DEFAULT_STATS = {
  stats: [
    { iconName: 'users', label: "Researchers", value: 12, suffix: "" },
    { iconName: 'bookopen', label: "Publications", value: 47, suffix: "" },
    { iconName: 'flaskconical', label: "Projects", value: 5, suffix: "" },
    { iconName: 'dollarsign', label: "Funding", value: 2.3, suffix: "M" },
  ],
};

const StatsSection = () => {
  const { data } = useContent('stats', DEFAULT_STATS);
  const stats = data.stats || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-border-main mb-24">
      {stats.map((stat, i) => {
        const Icon = resolveIcon(stat.iconName, Users);
        return (
          <div key={i} className="text-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-brand-primary/5 text-brand-primary mb-6 group-hover:scale-110 transition-transform accent-soften border border-brand-primary/10">
              <Icon size={26} />
            </div>
            <div className="text-4xl font-extrabold text-text-main tracking-tighter mb-2">
              {stat.suffix === "M" ? (
                <span>${stat.value}M</span>
              ) : (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              )}
            </div>
            <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.25em]">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;
