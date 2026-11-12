import { AnimatedBrandMark } from "./AnimatedBrandMark";
import { LoadingExperience } from "./LoadingExperience";
/** Feedback for actual workspace loading. */
export function LoadingIndicator({
  label = "Opening your GOMONO conversation…",
}: {
  label?: string;
}) {
  return (
    <div className="gomono-loader" role="status">
      <LoadingExperience variant="workspace" label="" announce={false} />
      <AnimatedBrandMark />
      <span>{label}</span>
    </div>
  );
}
