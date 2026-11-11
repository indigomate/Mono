import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Turn } from "./model";

/** Presentation pacing only. Domain operations never wait for these timers. */
export function useReplySequence(turns: Turn[]) {
  const initial = useRef(
    new Set(turns.length > 1 ? turns.map((t) => t.id) : []),
  );
  const visible = useRef(new Set(initial.current));
  const tools = useRef(new Set(initial.current));
  const fresh = useRef(new Set<string>());
  const [frame, setFrame] = useState(0);
  const [pending, setPending] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useLayoutEffect(() => {
    const ids = new Set(turns.map((t) => t.id));
    visible.current = new Set([...visible.current].filter((id) => ids.has(id)));
    tools.current = new Set([...tools.current].filter((id) => ids.has(id)));
    fresh.current = new Set([...fresh.current].filter((id) => ids.has(id)));
    for (const turn of turns)
      if (turn.role === "user") visible.current.add(turn.id);
    const queue = turns.filter(
      (t) => !visible.current.has(t.id) || (t.tool && !tools.current.has(t.id)),
    );
    const timers: ReturnType<typeof setTimeout>[] = [];
    const publish = () => setFrame((value) => value + 1);
    setPending(queue.length > 0);
    publish();
    let offset = 0;
    for (const turn of queue) {
      const textReady = visible.current.has(turn.id);
      offset += textReady ? 0 : reduced ? 80 : 320;
      timers.push(
        setTimeout(() => {
          visible.current.add(turn.id);
          fresh.current.add(turn.id);
          publish();
        }, offset),
      );
      offset += turn.tool ? (reduced ? 40 : 180) : 0;
      timers.push(
        setTimeout(() => {
          tools.current.add(turn.id);
          publish();
        }, offset),
      );
    }
    if (queue.length) timers.push(setTimeout(() => setPending(false), offset));
    return () => timers.forEach(clearTimeout);
  }, [turns, reduced]);
  return {
    visible: visible.current,
    tools: tools.current,
    fresh: fresh.current,
    pending,
    frame,
    reduced,
  };
}
