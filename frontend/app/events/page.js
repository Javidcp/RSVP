"use client";

import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import { apiFetch } from "../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Main tab
  const [activeTab, setActiveTab] = useState("events");

  // RSVP filter
  const [rsvpFilter, setRsvpFilter] = useState("ALL");

  async function loadEvents() {
    try {
      setLoading(true);

      const data = await apiFetch("/events");
      console.log('event', data);
      

      setEvents(data.events);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyEvents() {
    try {
      setLoading(true);

      const data = await apiFetch("/events/my-events");
      console.log('my event', data);
      

      setEvents(data.events);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadEventsByRSVP(status) {
    try {
      setLoading(true);

      const data = await apiFetch(
        `/events/rsvp?status=${status}`
      );

      setEvents(data.events);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Events tab
  function handleEventsClick() {
    setActiveTab("events");
    setRsvpFilter("ALL");

    loadEvents();
  }

  // My Events tab
  function handleMyEventsClick() {
    setActiveTab("my-events");
    setRsvpFilter("ALL");

    loadMyEvents();
  }

  // RSVP filter
  function handleRSVPFilter(status) {
    setRsvpFilter(status);

    if (status === "ALL") {
      loadEvents();
      return;
    }

    loadEventsByRSVP(status);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6">
      <div className="mx-auto max-w-6xl">

        {/* Tabs */}
        <div className="mt-10 inline-flex rounded-lg bg-gray-200 p-1">
          <button
            onClick={handleEventsClick}
            className={`rounded-md px-5 py-2 text-sm font-medium transition ${
              activeTab === "events"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Events
          </button>

          <button
            onClick={handleMyEventsClick}
            className={`rounded-md px-5 py-2 text-sm font-medium transition ${
              activeTab === "my-events"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            My Events
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {activeTab === "events" ? "Events" : "My Events"}
            </h1>

            <p className="mt-2 text-gray-500">
              {activeTab === "events"
                ? "Browse and discover upcoming events."
                : "Events you have RSVP'd to."}
            </p>
          </div>

          <Link
            href="/events/create"
            className="w-fit rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            + Create Event
          </Link>
        </div>

        {/* RSVP Filters - Only Events tab */}
        {activeTab === "events" && (
          <div className="mb-8 flex flex-wrap gap-2">
            {["ALL", "GOING", "MAYBE", "DECLINED"].map((status) => (
              <button
                key={status}
                onClick={() => handleRSVPFilter(status)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  rsvpFilter === status
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
                }`}
              >
                {status === "ALL"
                  ? "All"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              <span>Loading events...</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && events.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📅
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No events found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "my-events"
                ? "You haven't RSVP'd to any events yet."
                : rsvpFilter !== "ALL"
                ? `No ${rsvpFilter.toLowerCase()} events found.`
                : "There are no upcoming events at the moment."}
            </p>

            <Link
              href="/events/create"
              className="mt-5 inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Your First Event
            </Link>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}