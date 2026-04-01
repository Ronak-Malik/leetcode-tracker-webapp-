"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setIsAuthenticated(true);
        router.push("/dashboard");
      }
    } catch (error) {
      // Not authenticated, stay on landing page
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900">
      {/* HERO */}
      <section className="px-6 pt-28 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 blur-3xl opacity-50 -z-10" />

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            LeetOtracker
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
          Turn your LeetCode grind into structured growth.
          Get AI-powered reviews, smart revision plans,
          and detailed performance analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            className="bg-black hover:bg-gray-800 text-white px-10 py-4 
                       rounded-2xl text-lg font-semibold shadow-xl 
                       transition-all duration-300"
          >
            Get Started 🚀
          </button>
          
          <button
            onClick={handleLogin}
            className="bg-white hover:bg-gray-50 text-gray-800 px-10 py-4 
                       rounded-2xl text-lg font-semibold shadow-lg 
                       border border-gray-200 transition-all duration-300"
          >
            Sign In
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          New here? Click "Get Started" to create your account
        </p>
      </section>

      {/* FEATURE GRID */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">📊 Problem Breakdown</h3>
            <p className="text-gray-600">
              See attempts, accepted solutions, and struggle status.
              Instantly know where you're stuck.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">📈 Acceptance Analytics</h3>
            <p className="text-gray-600">
              Visual acceptance rate tracking with progress bars
              and performance metrics.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">🧠 AI Review & Revision</h3>
            <p className="text-gray-600">
              Personalized AI insights based on your coding
              strengths and weaknesses.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">📚 Topic Insights</h3>
            <p className="text-gray-600">
              Know exactly which topics you’re covering —
              Arrays, DP, Stack, HashMap and more.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">📬 Weekly Reports</h3>
            <p className="text-gray-600">
              Automated performance reports delivered to your inbox.
              Stay accountable.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-3">🚀 Built for Serious Coders</h3>
            <p className="opacity-90">
              Stop random solving. Start structured growth.
              Level up your DSA journey.
            </p>
          </div>
        </div>
      </section>

      {/* PREVIEW STYLE SECTION */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-extrabold mb-4">
            See Your Growth Clearly
          </h2>
          <p className="text-gray-600 text-lg">
            Beautiful dashboards. Clear analytics. AI guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="bg-[#F5F5F7] p-10 rounded-3xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-lg mb-3">📊 Performance Summary</h4>
            <p className="text-gray-600">
              Easy, Medium, Hard breakdown with structured reports
              and acceptance tracking.
            </p>
          </div>

          <div className="bg-[#F5F5F7] p-10 rounded-3xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-lg mb-3">🧠 AI Powered Plan</h4>
            <p className="text-gray-600">
              Strong areas. Weak areas. Actionable next steps.
              No guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-4xl font-extrabold mb-6">
          Ready to Upgrade Your Coding Journey?
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            className="bg-white text-black px-10 py-4 
                       rounded-2xl text-lg font-semibold 
                       shadow-xl hover:scale-105 transition"
          >
            Create Free Account
          </button>
          
          <button
            onClick={handleLogin}
            className="bg-transparent border-2 border-white text-white px-10 py-4 
                       rounded-2xl text-lg font-semibold 
                       hover:bg-white hover:text-black transition"
          >
            Sign In
          </button>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm bg-[#F5F5F7]">
        © {new Date().getFullYear()} LeetOtracker • Built for ambitious developers 🚀
      </footer>
    </div>
  );
}