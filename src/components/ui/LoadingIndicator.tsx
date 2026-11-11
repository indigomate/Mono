import { AnimatedBrandMark } from "./AnimatedBrandMark";
/** Feedback for actual workspace loading. */
export function LoadingIndicator({
  label = "Opening your GOMONO conversation…",
}: {
  label?: string;
}) {
  return (
    <div className="gomono-loader" role="status">
      <AnimatedBrandMark />
      <span>{label}</span>
    </div>
  );
}
