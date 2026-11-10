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
}: {
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
        <ProviderConversation view={view as ProviderView} />
      ) : (
        <CustomerConversation view={view as CustomerView} navigate={navigate} />
      )}
    </WorkspaceShell>
  );
}
