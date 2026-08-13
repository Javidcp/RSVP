import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-[100vh] flex items-center justify-center">
      <section className="mx-auto flex max-w-4xl flex-col items-center  px-6 text-center">
        

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          RSVP Tracker
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Create events, manage attendees, and track RSVPs
          <br className="hidden sm:block" />
          easily in one place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/events"
            className="rounded-xl bg-black px-6 py-3 font-medium text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md"
          >
            Browse Events
          </Link>

          <Link
            href="/events/create"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
          >
            Create Event
          </Link>
        </div>
      </section>
    </main>
  );
}