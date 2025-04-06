"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "signup") {
        // Call your register endpoint.
        // Note: Backend currently accepts only email and password.
        // To store the name, you'll need to update the backend.
        const res = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Registration failed");
        }
        alert("Registration successful! Please log in.");
        setMode("login");
      } else {
        // Login endpoint call
        const res = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }
        // Save token and user info to localStorage.
        localStorage.setItem("token", data.token);
        // Here we assume the response includes a user object.
        // If no name is provided, you can fallback to the email.
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect to /dashboard.
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

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

          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <label className="block text-sm mb-1 text-white">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1 text-white">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}

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
