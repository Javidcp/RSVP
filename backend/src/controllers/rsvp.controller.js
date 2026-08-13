import prisma from "../lib/prisma.js";

const VALID_STATUSES = [
  "GOING",
  "MAYBE",
  "DECLINED"
];

export async function createOrUpdateRSVP(
  req,
  res,
  next
) {
  try {
    const eventId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message:
          "Status must be GOING, MAYBE, or DECLINED"
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId
        }
      },
      update: {
        status
      },
      create: {
        userId: req.user.id,
        eventId,
        status
      }
    });

    return res.status(200).json({
      message: "RSVP saved successfully",
      rsvp
    });
  } catch (error) {
    next(error);
  }
}



export async function getEventRSVPs(
  req,
  res,
  next
) {
  try {
    const eventId = Number(req.params.id);

    if (Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: {
        eventId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const attendees = {
      GOING: [],
      MAYBE: [],
      DECLINED: []
    };

    for (const rsvp of rsvps) {
      attendees[rsvp.status].push({
        id: rsvp.user.id,
        name: rsvp.user.name
      });
    }

    return res.status(200).json({
      attendees
    });
  } catch (error) {
    next(error);
  }
}