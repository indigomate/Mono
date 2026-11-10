import type { ReactNode } from "react";
import { ClerkProvider, SignInButton, UserButton, useAuth } from "@clerk/react";

function AccountBar() {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <div className="account-bar">
      <span>MONO · Demo workspace</span>
      {!isLoaded ? (
        <span>Loading account…</span>
      ) : isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button className="outline">Sign in</button>
        </SignInButton>
      )}
    </div>
  );
}

export function Authentication({ children }: { children: ReactNode }) {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
  if (!key) return children;
  return (
    <ClerkProvider publishableKey={key}>
      <AccountBar />
      {children}
    </ClerkProvider>
  );
}
