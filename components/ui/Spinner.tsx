export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-label={label}
    >
      {/* Animated ring */}
      <div className="relative flex size-14 items-center justify-center">
        {/* Outer glow */}
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        {/* Spinning arc */}
        <svg
          className="size-14 animate-spin text-primary"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="28"
            cy="28"
            r="22"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="5"
          />
          <path
            d="M28 6 a22 22 0 0 1 22 22"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        {/* Centre dot */}
        <span className="absolute size-3 rounded-full bg-primary shadow-md shadow-primary/40" />
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-bounce rounded-full bg-primary/60"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
