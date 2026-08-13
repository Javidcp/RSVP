# Local Meetup RSVP Tracker

A full-stack application for creating local meetup events and managing RSVPs.

## Tech Stack

- Next.js
- Node.js
- Express.js
- MySQL
- Prisma
- JWT
- Docker & Docker Compose

## Features

- User login with JWT authentication
- Create meetup events
- Browse meetup events
- View event details
- RSVP with Going / Maybe / Declined
- View event attendees
- Edit and delete own events
- Server-side authentication and authorization

## Project Structure

frontend/   → Next.js frontend
backend/    → Express.js REST API
prisma/     → Database schema and seed
docker-compose.yml

## Running the Project

Make sure Docker is installed.

```bash
docker compose up