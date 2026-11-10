import { CustomerWorkspace } from "./CustomerWorkspace";
import { ProviderWorkspace } from "./ProviderWorkspace";
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
        <ProviderWorkspace view={view as ProviderView} navigate={navigate} />
      ) : (
        <CustomerWorkspace view={view as CustomerView} navigate={navigate} />
      )}
    </WorkspaceShell>
  );
}
