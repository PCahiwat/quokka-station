import { useEffect } from "react";
import { useBedrockPassport } from "@bedrock_org/passport";

export default function AuthCallback() {
  let loginCallback: any;
  try {
    const passport = useBedrockPassport();
    loginCallback = passport.loginCallback;
  } catch {
    // Bedrock not available
  }

  useEffect(() => {
    // Tokens may be in the main URL query string (from server redirect)
    // or in the hash portion — check both
    const mainParams = new URLSearchParams(window.location.search);
    const token = mainParams.get("token");
    const refreshToken = mainParams.get("refreshToken");

    if (token && refreshToken && loginCallback) {
      loginCallback(token, refreshToken).then((success: boolean) => {
        if (success) {
          window.location.href = window.location.origin + window.location.pathname + "#/";
        }
      });
    } else {
      // No tokens found, redirect home after a moment
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + "#/";
      }, 2000);
    }
  }, [loginCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b14]">
      <div className="text-center">
        <div className="text-[#f0c040] font-orbitron text-lg mb-2">AUTHENTICATING</div>
        <div className="text-[#8888aa] text-sm">Verifying your credentials, Agent...</div>
      </div>
    </div>
  );
}
