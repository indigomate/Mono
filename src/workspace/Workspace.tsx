import { CustomerConversation } from "../conversation/CustomerConversation";
import { ProviderConversation } from "../conversation/ProviderConversation";
import { WorkspaceShell, WorkspaceChooser } from "./WorkspaceShell";
import {
  providerViews,
  type View,
  type ProviderView,
  type CustomerView,
  type Navigate,
} from "./navigation";
import "./workspace.css";
import "./roles.css";
import "../conversation/conversation.css";
export type { View } from "./navigation";
export function Workspace({
  view,
  navigate,
  entry,
  onEntryConsumed,
}: {
  entry?: { role: "customer" | "provider"; text: string } | null;
  onEntryConsumed?: () => void;
  view: View;
  navigate: Navigate;
}) {
  if (view === "workspaces") return <WorkspaceChooser navigate={navigate} />;
  const provider = providerViews.includes(view);
  return (
    <WorkspaceShell
      role={provider ? "provider" : "customer"}
      view={view}
      navigate={navigate}
    >
      {provider ? (
        <ProviderConversation
          view={view as ProviderView}
          entry={entry?.role === "provider" ? entry.text : undefined}
          onEntryConsumed={onEntryConsumed}
        />
      ) : (
        <CustomerConversation
          view={view as CustomerView}
          navigate={navigate}
          entry={entry?.role === "customer" ? entry.text : undefined}
          onEntryConsumed={onEntryConsumed}
        />
      )}
    </WorkspaceShell>
  );
}
