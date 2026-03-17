import { useBedrockPassport } from "@bedrock_org/passport";
import { useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  let passport: any = {};
  try {
    passport = useBedrockPassport();
  } catch {
    // Bedrock not initialized
  }

  const { user, isLoggedIn, signOut } = passport;
  const syncedRef = useRef(false);

  // Sync user to backend on login
  useEffect(() => {
    if (user && isLoggedIn && !syncedRef.current) {
      syncedRef.current = true;
      apiRequest("POST", "/api/users", {
        id: user.id,
        email: user.email || null,
        name: user.name || null,
        displayName: user.displayName || null,
        picture: user.picture || null,
        ethAddress: user.ethAddress || null,
        provider: user.provider || null,
        createdAt: user.createdAt || null,
      }).catch(console.error);
    }
  }, [user, isLoggedIn]);

  return {
    user: user || null,
    isLoggedIn: !!isLoggedIn,
    signOut: signOut || (() => {}),
  };
}
