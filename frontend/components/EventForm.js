"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { apiFetch } from "../lib/api";
import toast from "react-hot-toast"

export default function EventForm({
  initialData = null,
  eventId = null,
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      eventDate: initialData?.eventDate
        ? initialData.eventDate.slice(0, 16)
        : "",
    },
  });

  const [minDateTime, setMinDateTime] = useState("");

  useEffect(() => {
    const updateMinDateTime = () => {
      const now = new Date();

      const localDateTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setMinDateTime(localDateTime);
    };

    updateMinDateTime();

    const interval = setInterval(updateMinDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  async function onSubmit(formData) {
    const selectedDate = new Date(formData.eventDate);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      setError("eventDate", {
        type: "manual",
        message: "Event date and time must be in the future.",
      });

      return;
    }

    try {
      const isEditing = Boolean(eventId);

      const data = await apiFetch(
        isEditing ? `/events/${eventId}` : "/events",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(formData),
        }
      );

      if (isEditing) {
        router.push(`/events/${eventId}`);
        toast.success("Event edited succesful")
      } else {
        router.push(`/events/${data.event.id}`);
        toast.success("Event created succesful")
      }

      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
        <h2 className="text-xl font-bold text-gray-900">
          {eventId ? "Edit Event" : "Create New Event"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {eventId
            ? "Update the details of your event."
            : "Add the details below to create your event."}
        </p>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Event Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="e.g. Annual Team Meetup"
            {...register("title", {
              required: "Event title is required.",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters.",
              },
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters.",
              },
            })}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.title
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-black focus:ring-gray-100"
            }`}
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            placeholder="Tell people what this event is about..."
            {...register("description", {
              required: "Event description is required.",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters.",
              },
              maxLength: {
                value: 1000,
                message: "Description cannot exceed 1000 characters.",
              },
            })}
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-black focus:ring-gray-100"
            }`}
          />

          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Location
          </label>

          <input
            id="location"
            type="text"
            placeholder="e.g. Kochi, Kerala"
            {...register("location", {
              required: "Location is required.",
              minLength: {
                value: 2,
                message: "Location must be at least 2 characters.",
              },
            })}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
              errors.location
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-black focus:ring-gray-100"
            }`}
          />

          {errors.location && (
            <p className="mt-2 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="eventDate"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Event Date & Time
          </label>

          <input
            id="eventDate"
            type="datetime-local"
            min={minDateTime}
            {...register("eventDate", {
              required: "Event date and time is required.",
              validate: (value) => {
                const selected = new Date(value);

                if (selected <= new Date()) {
                  return "Event date and time must be in the future.";
                }

                return true;
              },
            })}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
              errors.eventDate
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-black focus:ring-gray-100"
            }`}
          />

          
          {errors.eventDate && (
            <p className="mt-2 text-sm text-red-600">
              {errors.eventDate.message}
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : eventId
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </div>
    </form>
  );
}