import Link from "next/link";

export default function EventCard({ event }) {
  const date = new Date(event.eventDate);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="rounded-xl border border-zinc-300 bg-white p-5 ">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
          {event.description}
        </p>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Location</span>
          <span className="text-right font-medium text-gray-800">
            {event.location}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Date</span>
          <span className="text-right font-medium text-gray-800">
            {formattedDate}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Time</span>
          <span className="text-right font-medium text-gray-800">
            {formattedTime}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-gray-500">Created by</span>
          <span className="text-right font-medium text-gray-800">
            {event.createdBy?.name || "Unknown"}
          </span>
        </div>
        
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Event
        </Link>
      </div>
    </article>
  );
}