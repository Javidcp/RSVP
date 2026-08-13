"use client";

import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function Navbar() {
  const router = useRouter();

  const { logout: clearAuth } = useAuthStore();
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      clearAuth();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="text-lg font-bold tracking-tight text-gray-900">
            RSVP Tracker
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/events"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Events
          </Link>

          {isAuthenticated && 
            <Link
              href="/events/create"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Create Event
            </Link>
          }

          {!isAuthenticated ? (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md active:scale-95"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="ml-2 cursor-pointer rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;