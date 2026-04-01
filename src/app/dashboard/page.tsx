"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LeetCodeStats {
  username: string;
  ranking: number;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  lastUpdated?: string;
  recentProblems?: Array<{
    title: string;
    difficulty: string;
    solvedAt: string;
  }>;
}

interface User {
  id: string;
  email: string;
  name: string;
  leetcodeUsername: string;
  notifyMail: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
        fetchStats();
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leetcode/stats");
      
      if (response.data.success) {
        setStats(response.data.data);
        setCached(response.data.cached);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      setError(error.response?.data?.message || "Failed to fetch LeetCode stats");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await axios.post("/api/leetcode/sync");
      if (response.data.success) {
        await fetchStats();
        alert(`Synced successfully! ${response.data.data?.newProblemsCount || 0} new problems found.`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Failed to sync data");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/";
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync LeetCode Data"}
          </button>
        </div>
      </div>
    );
  }

  const safeStats = {
    easy: stats?.easy ?? 0,
    medium: stats?.medium ?? 0,
    hard: stats?.hard ?? 0,
    totalSolved: stats?.totalSolved ?? 0,
    ranking: stats?.ranking ?? 0,
    streak: stats?.streak ?? 0,
    username: stats?.username ?? user?.leetcodeUsername ?? "Unknown",
  };

  const total = safeStats.easy + safeStats.medium + safeStats.hard;
  const easyPercent = total > 0 ? (safeStats.easy / total) * 100 : 0;
  const mediumPercent = total > 0 ? (safeStats.medium / total) * 100 : 0;
  const hardPercent = total > 0 ? (safeStats.hard / total) * 100 : 0;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const easyStroke = (easyPercent / 100) * circumference;
  const mediumStroke = (mediumPercent / 100) * circumference;
  const hardStroke = (hardPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🚀</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                LeetOTracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 hidden sm:block">{user?.email}</div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cache indicator */}
      {cached && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-75 z-50">
          ⚡ Cached
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  {user?.name || "Coder"}!
                </span>
              </h2>
              <p className="text-gray-600 mt-1">Your LeetCode journey at a glance</p>
              <p className="text-sm text-gray-500 mt-1">
                LeetCode: <span className="font-medium text-gray-700">{safeStats.username}</span>
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center space-x-2"
            >
              {syncing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">Current Streak</p>
                <p className="text-5xl font-bold mt-2">{safeStats.streak}</p>
                <p className="text-orange-100 text-sm mt-2">days</p>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">Global Ranking</p>
                <p className="text-5xl font-bold mt-2">#{safeStats.ranking}</p>
                <p className="text-purple-100 text-sm mt-2">worldwide</p>
              </div>
              <div className="text-5xl">🏆</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Total Solved</p>
                <p className="text-5xl font-bold mt-2">{safeStats.totalSolved}</p>
                <p className="text-green-100 text-sm mt-2">problems</p>
              </div>
              <div className="text-5xl">📚</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Problem Distribution</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r={radius} stroke="#e5e7eb" strokeWidth="20" fill="none" />
                <circle cx="120" cy="120" r={radius} stroke="#22c55e" strokeWidth="20" fill="none" strokeDasharray={`${easyStroke} ${circumference}`} strokeLinecap="round" />
                <circle cx="120" cy="120" r={radius} stroke="#facc15" strokeWidth="20" fill="none" strokeDasharray={`${mediumStroke} ${circumference}`} strokeDashoffset={-easyStroke} strokeLinecap="round" />
                <circle cx="120" cy="120" r={radius} stroke="#ef4444" strokeWidth="20" fill="none" strokeDasharray={`${hardStroke} ${circumference}`} strokeDashoffset={-(easyStroke + mediumStroke)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{safeStats.totalSolved}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Easy</span></div>
                <div className="font-bold text-green-600">{safeStats.easy}</div>
                <div className="text-gray-500 text-sm">{easyPercent.toFixed(1)}%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span>Medium</span></div>
                <div className="font-bold text-yellow-600">{safeStats.medium}</div>
                <div className="text-gray-500 text-sm">{mediumPercent.toFixed(1)}%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Hard</span></div>
                <div className="font-bold text-red-600">{safeStats.hard}</div>
                <div className="text-gray-500 text-sm">{hardPercent.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Problems */}
        {stats?.recentProblems && stats.recentProblems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Problems</h3>
            <div className="space-y-2">
              {stats.recentProblems.slice(0, 5).map((problem, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{problem.title}</p>
                    <p className="text-xs text-gray-500">{new Date(problem.solvedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    problem.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                    problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>{problem.difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}