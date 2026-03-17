import { useEffect, useRef } from "react";
import { useBedrockPassport } from "@bedrock_org/passport";

export default function AuthCallback() {
  let loginCallback: any;
  try {
    const passport = useBedrockPassport();
    loginCallback = passport.loginCallback;
  } catch {
    // Bedrock not available
  }

  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const mainParams = new URLSearchParams(window.location.search);
    const token = mainParams.get("token");
    const refreshToken = mainParams.get("refreshToken");

    if (token && refreshToken && loginCallback) {
      processedRef.current = true;
      loginCallback(token, refreshToken).then((success: boolean) => {
        if (success) {
          window.location.href = window.location.origin + window.location.pathname + "#/";
        }
      });
    } else if (!token || !refreshToken) {
      // No tokens at all — redirect home
      processedRef.current = true;
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + "#/";
      }, 2000);
    }
    // If tokens exist but loginCallback isn't ready yet, wait for next render
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
