"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";
import toast from "react-hot-toast"

export default function RSVPButtons({
  eventId,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);


  async function submitRSVP(status) {
    try {
      setLoading(true);

      await apiFetch(
        `/events/${eventId}/rsvp`,
        {
          method: "POST",
          body: JSON.stringify({
            status
          })
        }
      );

      await onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => submitRSVP("GOING")}
          disabled={loading}
          className="cursor-pointer rounded-xl bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Going
        </button>

        <button
          onClick={() => submitRSVP("MAYBE")}
          disabled={loading}
          className="cursor-pointer rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white transition hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Maybe
        </button>

        <button
          onClick={() => submitRSVP("DECLINED")}
          disabled={loading}
          className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Declined
        </button>
      </div>
    </div>
  );
}