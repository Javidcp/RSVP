"use client";

import { useAuthStore } from "@/store/authStore";
import EventForm from "../../../components/EventForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateEventPage() {
  console.log("CREATE EVENT PAGE RENDERED");

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const router = useRouter();

  useEffect(() => {
    console.log("AUTH STATUS:", isAuthenticated);

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Create Event
      </h1>

      <EventForm />
    </section>
  );
}