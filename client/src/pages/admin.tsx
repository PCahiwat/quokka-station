import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { Link } from "wouter";

export default function Admin() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("GET", "/api/admin/users", undefined);
      const data = await res.json();
      setUsers(data);
      setAuthenticated(true);
    } catch (err: any) {
      setError("Invalid admin secret");
    }
    setLoading(false);
  };

  // Override apiRequest to include header
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data);
      setAuthenticated(true);
    } catch {
      setError("Invalid admin secret");
    }
    setLoading(false);
  };

  const truncateAddr = (addr: string | null) => {
    if (!addr) return "—";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0b14] text-[#e0dff0] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-orbitron text-xl font-bold text-[#f0c040] tracking-wider uppercase mb-2" data-testid="text-admin-title">Admin Dashboard</h1>
            <p className="text-sm text-[#8888aa]">Enter admin secret to continue</p>
          </div>
          <div className="bg-[#0f1120] border border-[#2a2d50] rounded-xl p-6">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Admin secret"
              className="w-full bg-[#1a1d3a] border border-[#2a2d50] rounded-lg px-4 py-3 text-sm text-[#e0dff0] placeholder:text-[#555577] focus:border-[#f0c040] focus:outline-none mb-4"
              data-testid="input-admin-secret"
            />
            {error && <p className="text-xs text-red-400 mb-3" data-testid="text-error">{error}</p>}
            <button
              onClick={fetchUsers}
              disabled={loading || !secret}
              className="w-full bg-[#f0c040] hover:bg-[#ffd966] text-[#0a0b14] font-orbitron text-sm font-bold tracking-wider uppercase py-3 rounded-lg transition-colors disabled:opacity-50"
              data-testid="button-admin-login"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-[#8888aa] hover:text-[#40d0d0] transition-colors">← Back to Station</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-[#e0dff0]">
      {/* Admin Header */}
      <header className="px-4 sm:px-6 py-4 bg-[#0a0b14]/85 backdrop-blur-xl border-b border-[#2a2d50]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-sm font-bold tracking-[0.15em] uppercase text-[#f0c040]" data-testid="text-dashboard-title">Admin Dashboard</h1>
            <p className="text-xs text-[#8888aa]">Quokka Station Command</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers} className="text-xs text-[#40d0d0] hover:text-[#66e0e0] px-3 py-1.5 border border-[#40d0d0]/20 rounded-full transition-colors" data-testid="button-refresh">
              Refresh
            </button>
            <Link href="/" className="text-xs text-[#8888aa] hover:text-[#e0dff0] px-3 py-1.5 border border-[#2a2d50] rounded-full transition-colors">
              ← Station
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f1120] border border-[#2a2d50] rounded-lg p-4">
            <p className="text-xs text-[#8888aa] mb-1">Total Users</p>
            <p className="font-orbitron text-xl font-bold text-[#f0c040]" data-testid="text-total-users">{users.length}</p>
          </div>
          <div className="bg-[#0f1120] border border-[#2a2d50] rounded-lg p-4">
            <p className="text-xs text-[#8888aa] mb-1">With Wallets</p>
            <p className="font-orbitron text-xl font-bold text-[#40d0d0]" data-testid="text-with-wallets">{users.filter((u) => u.ethAddress).length}</p>
          </div>
          <div className="bg-[#0f1120] border border-[#2a2d50] rounded-lg p-4">
            <p className="text-xs text-[#8888aa] mb-1">Google Auth</p>
            <p className="font-orbitron text-xl font-bold text-[#a855f7]">{users.filter((u) => u.provider === "google").length}</p>
          </div>
          <div className="bg-[#0f1120] border border-[#2a2d50] rounded-lg p-4">
            <p className="text-xs text-[#8888aa] mb-1">Email Auth</p>
            <p className="font-orbitron text-xl font-bold text-[#e0dff0]">{users.filter((u) => u.provider === "email").length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0f1120] border border-[#2a2d50] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2a2d50]">
            <h2 className="font-orbitron text-sm font-bold text-[#f0c040] tracking-wider uppercase">Registered Agents</h2>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#555577] text-sm">No agents registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2d50]">
                    <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-[#8888aa] tracking-wider uppercase">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-[#8888aa] tracking-wider uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-[#8888aa] tracking-wider uppercase">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-[#8888aa] tracking-wider uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-orbitron font-medium text-[#8888aa] tracking-wider uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#1e2040] hover:bg-[#151730] transition-colors" data-testid={`row-user-${u.id}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.picture ? (
                            <img src={u.picture} alt="" className="w-8 h-8 rounded-full border border-[#2a2d50]" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#1a1d3a] border border-[#2a2d50] flex items-center justify-center text-xs text-[#8888aa]">
                              {(u.name || u.displayName || "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#e0dff0]">{u.name || u.displayName || "—"}</p>
                            {u.displayName && u.name && u.displayName !== u.name && (
                              <p className="text-xs text-[#555577]">@{u.displayName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8888aa]">{u.email || "—"}</td>
                      <td className="px-6 py-4">
                        {u.ethAddress ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-[#40d0d0] bg-[#40d0d0]/[0.08] border border-[#40d0d0]/20 px-2 py-1 rounded" title={u.ethAddress}>
                            {truncateAddr(u.ethAddress)}
                          </span>
                        ) : (
                          <span className="text-xs text-[#555577]">No wallet</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          u.provider === "google" ? "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20" :
                          u.provider === "email" ? "bg-[#f0c040]/10 text-[#f0c040] border border-[#f0c040]/20" :
                          "bg-[#40d0d0]/10 text-[#40d0d0] border border-[#40d0d0]/20"
                        }`}>
                          {u.provider || "wallet"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#555577]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
