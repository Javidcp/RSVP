"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import EventForm from "../../../../components/EventForm";
import { apiFetch } from "../../../../lib/api";
import toast from "react-hot-toast"

export default function EditEventPage() {
  const params = useParams();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await apiFetch(
          `/events/${params.id}`
        );

        setEvent(data.event);
      } catch (error) {
        toast.error(error.message);
      }
    }

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Event
      </h1>

      <EventForm
        initialData={event}
        eventId={event.id}
      />
    </section>
  );
}