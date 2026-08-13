"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { apiFetch } from "../../../lib/api";
import RSVPButtons from "../../../components/RSVPButtons";
import { useAuthStore } from "@/store/authStore";
import {
  CalendarRange,
  Edit,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import toast from "react-hot-toast"

export default function EventDetailsPage() {
  const user = useAuthStore((state) => state.user);
  console.log(user?.name);

  const params = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState(null);

  const [loading, setLoading] = useState(true);

  async function loadEvent() {
    try {

      const data = await apiFetch(`/events/${params.id}`);

      setEvent(data.event);

      const attendeeData = await apiFetch(`/events/${params.id}/rsvps`);

      setAttendees(attendeeData.attendees);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  async function handleDelete() {
    try {
      await apiFetch(`/events/${params.id}`, {
        method: "DELETE",
      });

      router.push("/events");
      toast.success("Event deleted successfull")
      router.refresh();

    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return <EventDetailsSkeleton />;
  }


  if (!event) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
          📅
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          Event not found
        </h2>

        <p className="mt-2 text-slate-500">
          The event you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          href="/events"
          className="mt-6 inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const goingCount = attendees?.GOING?.length || 0;
  const maybeCount = attendees?.MAYBE?.length || 0;
  const declinedCount = attendees?.DECLINED?.length || 0;

  const totalResponses = goingCount + maybeCount + declinedCount;

  return (
    <section className="min-h-screen bg-slate-50 px-4 ">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span>←</span>
            Back to Events
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-slate-800 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Event
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                    {event.createdBy?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Created by</p>

                    <p className="font-medium text-white">
                      {event.createdBy?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {user?.name === event.createdBy?.name && (
                <div className="relative flex flex-wrap gap-3">
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <span>
                      <Edit size={15} />
                    </span>
                    Edit
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <EventInfoCard
                icon={<CalendarRange size={18} />}
                label="Date & Time"
                value={new Date(event.eventDate).toLocaleString()}
              />

              <EventInfoCard
                icon={<MapPin size={18} />}
                label="Location"
                value={event.location}
              />

              <EventInfoCard
                icon={<Users size={18} />}
                label="Responses"
                value={`${totalResponses} ${
                  totalResponses === 1 ? "response" : "responses"
                }`}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FileText size={18} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  About this event
                </h2>
              </div>

              <p className="whitespace-pre-line leading-7 text-slate-600">
                {event.description || "No description provided."}
              </p>
            </div>

            {user?.name !== event.createdBy?.name && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Are you attending?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Let the organizer know your response.
                    </p>
                  </div>
                </div>

                <RSVPButtons eventId={event.id} onSuccess={loadEvent} />
              </div>
            )}
          </div>
        </div>

        {attendees && (
          <div className="mt-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Attendees</h2>

                <p className="mt-1 text-sm text-slate-500">
                  See who is interested in this event.
                </p>
              </div>

              <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                {totalResponses} total
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <AttendeeGroup
                title="Going"
                users={attendees.GOING || []}
                count={goingCount}
                icon="✓"
                color="green"
              />

              <AttendeeGroup
                title="Maybe"
                users={attendees.MAYBE || []}
                count={maybeCount}
                icon="?"
                color="yellow"
              />

              <AttendeeGroup
                title="Declined"
                users={attendees.DECLINED || []}
                count={declinedCount}
                icon="×"
                color="red"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventInfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}



function AttendeeGroup({ title, users, count, icon, color }) {
  const colorClasses = {
    green: {
      header: "bg-emerald-50 text-emerald-700",
      icon: "bg-emerald-100 text-emerald-700",
      count: "bg-emerald-100 text-emerald-700",
    },

    yellow: {
      header: "bg-amber-50 text-amber-700",
      icon: "bg-amber-100 text-amber-700",
      count: "bg-amber-100 text-amber-700",
    },

    red: {
      header: "bg-red-50 text-red-700",
      icon: "bg-red-100 text-red-700",
      count: "bg-red-100 text-red-700",
    },
  };

  const styles = colorClasses[color];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`flex items-center justify-between px-5 py-4 ${styles.header}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${styles.icon}`}
          >
            {icon}
          </div>

          <h3 className="font-bold">{title}</h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${styles.count}`}
        >
          {count}
        </span>
      </div>

      <div className="p-5">
        {users.length === 0 ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm">
              👤
            </div>

            <p className="mt-3 text-sm text-slate-500">No attendees yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-sm font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>

                  {user.email && (
                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



function EventDetailsSkeleton() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-slate-200" />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="h-64 animate-pulse bg-slate-200" />

          <div className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>

            <div className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100" />

            <div className="mt-8 h-32 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
