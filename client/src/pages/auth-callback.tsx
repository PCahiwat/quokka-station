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
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken && loginCallback) {
      loginCallback(token, refreshToken).then((success: boolean) => {
        if (success) {
          // Redirect to home
          window.location.href = window.location.origin + window.location.pathname + "#/";
        }
      });
    } else {
      // No tokens, redirect home
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
