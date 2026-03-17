import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginPanel } from "@bedrock_org/passport";
import "@bedrock_org/passport/dist/style.css";

function Stars() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 0) return;
    for (let i = 0; i < 120; i++) {
      const star = document.createElement("div");
      const big = Math.random() > 0.85;
      star.style.cssText = `
        position:absolute; width:${big ? 3 : 2}px; height:${big ? 3 : 2}px;
        background:#fff; border-radius:50%;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        opacity:${(0.3 + Math.random() * 0.7).toFixed(2)};
        ${big ? 'box-shadow:0 0 6px rgba(255,255,255,0.4);' : ''}
      `;
      el.appendChild(star);
    }
  }, []);
  return <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />;
}

function Nebula() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{
      background: `
        radial-gradient(ellipse 60% 50% at 20% 30%, rgba(88,28,135,0.15), transparent),
        radial-gradient(ellipse 50% 60% at 80% 60%, rgba(20,90,120,0.12), transparent),
        radial-gradient(ellipse 40% 40% at 50% 80%, rgba(168,85,247,0.08), transparent)
      `
    }} />
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Quokka Station logo">
      <circle cx="18" cy="18" r="16" stroke="#f0c040" strokeWidth="1.5" opacity="0.6" />
      <path d="M18 4 L30 11 L30 25 L18 32 L6 25 L6 11 Z" stroke="#f0c040" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="18" cy="17" r="7" stroke="#f0c040" strokeWidth="2.5" fill="none" />
      <line x1="22" y1="21" x2="27" y2="26" stroke="#f0c040" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="3" r="1.5" fill="#40d0d0" />
      <circle cx="18" cy="33" r="1.5" fill="#40d0d0" />
    </svg>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#1a1d3a] border border-[#2a2d50] text-[#8888aa] hover:text-white flex items-center justify-center text-sm" data-testid="button-close-login">
          ✕
        </button>
        <LoginPanel
          title="Sign in to Quokka Station"
          walletButtonText="Connect Wallet"
          showConnectWallet={true}
          separatorText="OR"
          features={{
            enableWalletConnect: true,
            enableAppleLogin: false,
            enableGoogleLogin: true,
            enableEmailLogin: true,
          }}
          titleClass="text-lg font-bold text-[#f0c040]"
          panelClass="p-6 rounded-xl max-w-[420px] bg-[#0f1120] border border-[#2a2d50]"
          buttonClass="hover:border-[#f0c040]"
          separatorTextClass="bg-[#0f1120] text-[#555577]"
          separatorClass="bg-[#2a2d50]"
          linkRowClass="justify-center"
          headerClass="justify-center"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoggedIn, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-[#e0dff0] relative">
      <Stars />
      <Nebula />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-[#0a0b14]/85 backdrop-blur-xl border-b border-[#2a2d50]">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <div className="font-orbitron text-sm font-bold tracking-[0.15em] uppercase text-[#f0c040] leading-tight">Quokka Station</div>
                <div className="hidden sm:block font-orbitron text-xs font-normal tracking-[0.25em] uppercase text-[#8888aa]">Central Command</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#40d0d0] font-medium hidden sm:inline" data-testid="text-username">
                    {user?.displayName || user?.name || "Agent"}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-xs text-[#8888aa] hover:text-[#e0dff0] px-3 py-1.5 border border-[#2a2d50] rounded-full transition-colors"
                    data-testid="button-signout"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-xs text-[#f0c040] hover:text-[#ffd966] px-3 py-1.5 border border-[#f0c040]/30 rounded-full transition-colors font-orbitron tracking-wider"
                  data-testid="button-signin"
                >
                  Sign In
                </button>
              )}
              <div className="flex items-center gap-2 text-xs text-[#40d0d0] bg-[#40d0d0]/[0.08] border border-[#40d0d0]/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-[#40d0d0] rounded-full" />
                <span className="hidden sm:inline">Systems Online</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero */}
          <section className="min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-6 py-16 relative overflow-hidden">
            <div className="relative z-10 max-w-[800px]">
              <div className="inline-flex items-center gap-2 font-orbitron text-xs font-medium tracking-[0.2em] uppercase text-[#40d0d0] bg-[#40d0d0]/[0.06] border border-[#40d0d0]/[0.15] px-4 py-2 rounded-full mb-6">
                ◆ Classified Access ◆
              </div>
              <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[0.08em] uppercase text-[#f0c040] mb-6" style={{ textShadow: "0 0 60px rgba(240,192,64,0.3), 0 0 120px rgba(240,192,64,0.15)" }}>
                Quokka Station
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#f0c040] to-transparent mx-auto mb-8" />
              <p className="text-base sm:text-lg font-light text-[#8888aa] leading-relaxed max-w-[600px] mx-auto">
                Welcome, Agent. You have entered the central command hub for all QUOKKA operations. Review your team. Study the mission logs. Stay sharp out there.
              </p>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#2a2d50] to-transparent" />
            <div className="max-w-[960px] mx-auto text-center">
              <p className="font-orbitron text-xs font-medium tracking-[0.3em] uppercase text-[#40d0d0] mb-4">Our Mission</p>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-[#f0c040] tracking-[0.05em] mb-8">Why We Roll Together</h2>
              <p className="text-base text-[#e0dff0] leading-relaxed max-w-[65ch] mx-auto mb-6">
                QUOKKA isn't just a squad — it's a <strong className="text-[#f0c040] font-semibold">family of agents</strong> who explore worlds, survive disasters, build cities, and have each other's backs no matter what. Whether we're crafting bases in Bedrock, racing through Robloxia, or saving elves in Forest 99, we show up as a <strong className="text-[#f0c040] font-semibold">team</strong>.
              </p>
              <p className="text-base text-[#e0dff0] leading-relaxed max-w-[65ch] mx-auto mb-10">
                Every mission makes us stronger. Every agent matters. We're here to <strong className="text-[#f0c040] font-semibold">have fun, be creative, and level up together</strong> — because the best adventures are the ones you share with your crew.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                {[
                  { icon: "🛡️", title: "Teamwork", desc: "No agent left behind. We win together or we respawn together." },
                  { icon: "🚀", title: "Exploration", desc: "New dimensions, hidden caves, mystery towers — if it's out there, we're finding it." },
                  { icon: "🏗️", title: "Creativity", desc: "From ziggurats to taco trucks, we build whatever we can imagine." },
                  { icon: "⭐", title: "Fun First", desc: "Games are for having a blast. If we're not laughing, we're doing it wrong." },
                ].map((v) => (
                  <div key={v.title} className="bg-[#0f1120] border border-[#2a2d50] rounded-lg p-6 text-center hover:border-[#f0c040] hover:shadow-[0_0_20px_rgba(240,192,64,0.15)] transition-all duration-300">
                    <span className="text-2xl block mb-3">{v.icon}</span>
                    <p className="font-orbitron text-sm font-semibold text-[#f0c040] tracking-[0.08em] uppercase mb-2">{v.title}</p>
                    <p className="text-xs text-[#e0dff0]/70 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quokka Coin */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#2a2d50] to-transparent" />
            <div className="max-w-[960px] mx-auto text-center">
              <p className="font-orbitron text-xs font-medium tracking-[0.3em] uppercase text-[#40d0d0] mb-4">Community Token</p>
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-[#f0c040] tracking-[0.05em] mb-8">Quokka Coin</h2>
              <p className="text-base text-[#e0dff0] leading-relaxed max-w-[65ch] mx-auto">
                Quokka Coin was built with one mission in mind: <strong className="text-[#f0c040] font-semibold">education</strong>. We're leveling up our real-world skills by exploring the mechanics of crypto together, using this coin as a hands-on training tool for our crew. Think of it as a community badge — the only reason to grab some is to support the Quokka Station and fund our shared adventures. To be crystal clear: <strong className="text-[#f0c040] font-semibold">this is not a speculative investment</strong>. If you're looking to "moon" or treat this like a financial gamble, this isn't the mission for you, and you definitely shouldn't buy in. We're here to learn, build, and grow as a family, not to play the market.
              </p>
            </div>
          </section>

          {/* Navigation Cards */}
          <section className="py-12 sm:py-20 px-4 sm:px-6 pb-16 sm:pb-32">
            <div className="max-w-[960px] mx-auto">
              <p className="font-orbitron text-xs font-medium tracking-[0.3em] uppercase text-[#40d0d0] mb-8 text-center">Access Points</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a href="https://sites.google.com/view/agent-profiles" target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center no-underline bg-[#0f1120] border border-[#2a2d50] rounded-xl p-8 sm:p-10 hover:border-[#40d0d0] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(64,208,208,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  data-testid="link-agent-profiles"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#40d0d0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-5 bg-[#40d0d0]/[0.08] border border-[#40d0d0]/[0.15]">🧑‍🚀</div>
                  <h3 className="font-orbitron text-lg font-bold tracking-[0.08em] uppercase text-[#40d0d0] mb-3">Agent Profiles</h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed mb-5">Review the full roster — 24 operatives and their roles, gear, and legendary achievements.</p>
                  <span className="inline-flex items-center gap-2 font-orbitron text-xs font-semibold tracking-[0.15em] uppercase text-[#40d0d0] group-hover:gap-3 transition-all">View Roster →</span>
                </a>
                <a href="https://sites.google.com/view/quokkamissionarchives2026" target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center no-underline bg-[#0f1120] border border-[#2a2d50] rounded-xl p-8 sm:p-10 hover:border-[#a855f7] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  data-testid="link-mission-archives"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#a855f7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-5 bg-[#a855f7]/[0.08] border border-[#a855f7]/[0.15]">📋</div>
                  <h3 className="font-orbitron text-lg font-bold tracking-[0.08em] uppercase text-[#a855f7] mb-3">Mission Archives</h3>
                  <p className="text-sm text-[#8888aa] leading-relaxed mb-5">Browse the complete log of QUOKKA ops — from Penthouse New Year to The Eternal Citadel.</p>
                  <span className="inline-flex items-center gap-2 font-orbitron text-xs font-semibold tracking-[0.15em] uppercase text-[#a855f7] group-hover:gap-3 transition-all">Open Archives →</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative py-8 px-4 sm:px-6 text-center border-t border-[#2a2d50] bg-[#0a0b14]/60">
          <div className="max-w-[960px] mx-auto">
            <p className="font-orbitron text-xs font-semibold tracking-[0.15em] uppercase text-[#f0c040] mb-2">Quokka Station</p>
            <p className="text-xs text-[#8888aa]">Stay sharp. Stay together. Stay quokka.</p>
          </div>
        </footer>
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
