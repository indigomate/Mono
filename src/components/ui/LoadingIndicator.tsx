import { AnimatedBrandMark } from "./AnimatedBrandMark";
/** Used for real workspace loading and an explicitly labelled animation preview. */
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
