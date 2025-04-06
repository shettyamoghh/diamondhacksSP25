"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#000000,#471A00_34%,#FF6B00_65%,#FF9500_100%)] px-4">
      <div className="w-full max-w-md text-center text-white space-y-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            {mode === "login"
              ? "Log in to access your personalized study roadmap."
              : "Sign up to start planning smarter and learning faster."}
          </p>
        </div>

        <div className="w-full bg-black rounded-xl p-8 shadow-[0_0_20px_#FF6B00]">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-2 rounded-md transition ${
                mode === "login"
                  ? "bg-[#FF6B00] text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-4 py-2 rounded-md transition ${
                mode === "signup"
                  ? "bg-[#FF6B00] text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-4 text-left">
            {mode === "signup" && (
              <div>
                <label className="block text-sm mb-1 text-white">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1 text-white">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF6B00] text-black font-semibold py-2 rounded-lg mt-4 hover:opacity-90 transition"
            >
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          {mode === "login" ? (
            <p className="text-center text-white/60 mt-4 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-white underline hover:text-[#FF6B00]"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-center text-white/60 mt-4 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-white underline hover:text-[#FF6B00]"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
