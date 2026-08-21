"use client";

type SliderProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  fill?: string;
  track?: string;
  thumb?: string;
  className?: string;
};

// Thin custom-styled range input used for the scrubber and volume controls.
export function Slider({
  value,
  max,
  onChange,
  ariaLabel,
  fill = "var(--accent2)",
  track = "var(--line)",
  thumb = "var(--accent2)",
  className = "",
}: Readonly<SliderProps>) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <input
      type="range"
      min={0}
      max={max || 1}
      step="any"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        background: `linear-gradient(to right, ${fill} ${pct}%, ${track} ${pct}%)`,
        ["--thumb-color" as string]: thumb,
      }}
      className={`h-1 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--thumb-color)] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--thumb-color)] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform hover:[&::-moz-range-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:scale-110 ${className}`}
    />
  );
}
