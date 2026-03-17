import { BedrockPassportProvider } from "@bedrock_org/passport";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, type ErrorInfo, type ReactNode } from "react";

const wagmiQueryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Error boundary to catch Bedrock SDK crashes
class BedrockErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Bedrock SDK error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface Props {
  children: React.ReactNode;
}

export default function BedrockProvider({ children }: Props) {
  const tenantId = import.meta.env.VITE_TENANT_ID;
  const subscriptionKey = import.meta.env.VITE_SUBSCRIPTION_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.bedrockpassport.com";
  const authCallbackUrl = import.meta.env.VITE_AUTH_CALLBACK_URL || "/auth/callback";
  const defaultChainId = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID ?? 1);
  const walletConnectId = import.meta.env.VITE_WALLET_CONNECT_ID;

  // If no tenant/subscription key, render children without Bedrock
  if (!tenantId || !subscriptionKey) {
    return <>{children}</>;
  }

  const bedrockProps: any = {
    baseUrl,
    authCallbackUrl,
    tenantId,
    subscriptionKey,
    defaultChainId,
    isBeta: import.meta.env.VITE_PASSPORT_BETA === "true",
  };

  // Only include walletConnectId if it's set (empty value crashes the SDK)
  if (walletConnectId) {
    bedrockProps.walletConnectId = walletConnectId;
  }

  return (
    <BedrockErrorBoundary fallback={<>{children}</>}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={wagmiQueryClient}>
          <BedrockPassportProvider {...bedrockProps}>
            {children}
          </BedrockPassportProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BedrockErrorBoundary>
  );
}
