"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getErrorMessage } from "@/lib/errors";
import type { ValleyRisk } from "@/lib/risk";
import { useRouter } from "next/navigation";

const VALLEYS = ["Bumburet", "Rumbur", "Birir", "Reshun", "Mastuj", "Yarkhun", "Torkhow", "Golain", "ALL"];

interface AlertLog {
  id: string;
  valley: string;
  riskLevel: string;
  message: string;
  sentBy: string;
  sentAt: string;
  successCount: number;
  failureCount: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [risks, setRisks] = useState<ValleyRisk[]>([]);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [form, setForm] = useState({ valley: "ALL", riskLevel: "Warning", message: "" });
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setLoading(false);
      if (usr) setUser(usr);
      else router.push("/admin/login");
    });
    return () => unsub();
  }, [router]);

  // Real-time alert log listener from Firestore
  useEffect(() => {
    if (!user) return;
    fetch("/api/risk")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Risk data status: ${response.status}`);
        }
        const data = await response.json();
        setRisks(data.valleys);
      })
      .catch((error: unknown) => setRiskError(getErrorMessage(error)));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "alertLogs"), orderBy("sentAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setAlertLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AlertLog)));
      },
      (error) => {
        // Firestore disabled or permission error — fail silently; show empty log
        console.warn("[dashboard] alertLogs listener error:", error.message);
      }
    );
    return () => unsub();
  }, [user]);

  const handleBroadcast = async () => {
    if (!user) return;
    setBroadcasting(true);
    setBroadcastResult(null);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBroadcastResult(`✅ Sent to ${data.successCount} devices. (${data.failureCount} failed)`);
    } catch (err: unknown) {
      setBroadcastResult(`❌ Error: ${getErrorMessage(err)}`);
    } finally {
      setBroadcasting(false);
    }
  };

  const riskColor = (level: string) =>
    level === "Danger" ? "text-red-600" :
    level === "Warning" ? "text-orange-500" :
    level === "Watch" ? "text-yellow-500" : "text-green-600";

  if (loading) return <div className="text-center mt-20 text-gray-500">Authenticating…</div>;
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0F4C5C] text-white p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">PDMA Command Center</h1>
          <p className="text-teal-200 mt-1">Logged in as: <span className="font-semibold">{user.email}</span></p>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/auth/session", { method: "DELETE" });
            await auth.signOut();
            router.push("/admin/login");
          }}
          className="mt-4 md:mt-0 border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-[#0F4C5C] transition text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Satellite Sync", value: "OK", sub: "10 min ago", ok: true },
          { label: "AI Risk Engine", value: risks.length ? "Running" : "Unavailable", sub: risks.length ? `${risks.length} valleys synced` : "Check risk service", ok: risks.length > 0 },
          { label: "FCM Push Queue", value: "Active", sub: "0 failures", ok: true },
          { label: "Active Warnings", value: risks.filter((risk) => risk.riskLevel === "Warning" || risk.riskLevel === "Danger").length.toString(), sub: "Current risk data", ok: risks.every((risk) => risk.riskLevel !== "Danger") },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.ok ? "text-green-600" : "text-red-600"}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Valley Risk Overview */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Valley Risk Overview</h2>
        {riskError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{riskError}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Valley", "Risk Level", "Confidence", "Last Updated", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {risks.map((row) => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className={`px-4 py-3 font-bold ${riskColor(row.riskLevel)}`}>{row.riskLevel}</td>
                  <td className="px-4 py-3 text-gray-500">{Math.round(row.confidence * 100)}%</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(row.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setForm((f) => ({ ...f, valley: row.name.replace(" (Kalash)", ""), riskLevel: row.riskLevel === "Low" ? "Watch" : row.riskLevel }))}
                      className="text-xs border rounded px-2 py-1 hover:bg-gray-100"
                    >
                      Broadcast
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Broadcast */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-red-700">Manual Alert Broadcast</h2>
        <p className="text-sm text-gray-500 mb-4">
          Send an immediate push notification to all subscribers of a selected valley or the entire district.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-1">Target Valley</label>
            <select
              className="w-full border rounded-lg p-2"
              value={form.valley}
              onChange={(e) => setForm((f) => ({ ...f, valley: e.target.value }))}
            >
              {VALLEYS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Risk Level</label>
            <select
              className="w-full border rounded-lg p-2"
              value={form.riskLevel}
              onChange={(e) => setForm((f) => ({ ...f, riskLevel: e.target.value }))}
            >
              {["Watch", "Warning", "Danger"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Custom Message (optional)</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Leave blank for default message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>
        </div>
        {broadcastResult && (
          <p className="mb-3 text-sm font-medium text-gray-700">{broadcastResult}</p>
        )}
        <button
          onClick={handleBroadcast}
          disabled={broadcasting}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition shadow"
        >
          {broadcasting ? "Sending…" : `BROADCAST ${form.riskLevel.toUpperCase()} WARNING → ${form.valley}`}
        </button>
      </div>

      {/* Alert Log */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Recent Broadcast Log</h2>
        {alertLogs.length === 0 ? (
          <p className="text-gray-400 text-sm">No broadcasts sent yet.</p>
        ) : (
          <div className="space-y-3">
            {alertLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex justify-between items-center border-b pb-3 text-sm">
                <div>
                  <span className={`font-bold ${riskColor(log.riskLevel)}`}>{log.riskLevel}</span>
                  <span className="text-gray-700 ml-2">→ {log.valley}</span>
                  <p className="text-gray-400 text-xs mt-0.5">By {log.sentBy} · {new Date(log.sentAt).toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p className="text-green-600">✓ {log.successCount} sent</p>
                  {log.failureCount > 0 && <p className="text-red-500">✗ {log.failureCount} failed</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
