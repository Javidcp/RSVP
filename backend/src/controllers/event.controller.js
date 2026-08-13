import prisma from "../lib/prisma.js";

export async function createEvent(req, res, next) {
    try {
        const {
        title,
        description,
        location,
        eventDate
        } = req.body;

        if (
        !title ||
        !description ||
        !location ||
        !eventDate
        ) {
        return res.status(400).json({
            message: "All fields are required"
        });
        }

        const event = await prisma.event.create({
        data: {
            title,
            description,
            location,
            eventDate: new Date(eventDate),
            createdById: req.user.id
        }
        });

        return res.status(201).json({
        message: "Event created successfully",
        event
        });
    } catch (error) {
        next(error);
    }
}



export async function getEvents(req, res, next) {
    try {
        const events = await prisma.event.findMany({
        include: {
            createdBy: {
            select: {
                id: true,
                name: true
            }
            },
            _count: {
            select: {
                rsvps: true
            }
            }
        },
        orderBy: {
            eventDate: "asc"
        }
        });

        return res.status(200).json({
        events
        });
    } catch (error) {
        next(error);
    }
}


export async function getMyEvents(req, res, next) {
    try {
        const userId = req.user.id;

        const events = await prisma.event.findMany({
            where: {
                rsvps: {
                    some: {
                        userId: userId
                    }
                }
            },

            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                rsvps: {
                    where: {
                        userId: userId
                    },
                    select: {
                        id: true,
                        status: true
                    }
                },

                _count: {
                    select: {
                        rsvps: true
                    }
                }
            },

            orderBy: {
                eventDate: "asc"
            }
        });

        const formattedEvents = events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            eventDate: event.eventDate,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,

            createdBy: event.createdBy,

            myRSVP: event.rsvps[0]?.status || null,

            rsvpCount: event._count.rsvps
        }));

        return res.status(200).json({
            events: formattedEvents
        });

    } catch (error) {
        console.error("GET MY EVENTS ERROR:", error);
        next(error);
    }
}




export async function getEventsByRSVPStatus(req, res, next) {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const allowedStatuses = [
            "GOING",
            "MAYBE",
            "DECLINED"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid RSVP status",
                allowedStatuses
            });
        }

        const events = await prisma.event.findMany({
            where: {
                rsvps: {
                    some: {
                        userId: userId,
                        status: status
                    }
                }
            },

            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                rsvps: {
                    where: {
                        userId: userId
                    },
                    select: {
                        id: true,
                        status: true
                    }
                },

                _count: {
                    select: {
                        rsvps: true
                    }
                }
            },

            orderBy: {
                eventDate: "asc"
            }
        });

        const formattedEvents = events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            eventDate: event.eventDate,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,

            createdBy: event.createdBy,

            myRSVP: event.rsvps[0]?.status || null,

            rsvpCount: event._count.rsvps
        }));

        return res.status(200).json({
            status,
            events: formattedEvents
        });

    } catch (error) {
        console.error("GET EVENTS BY RSVP ERROR:", error);
        next(error);
    }
}



export async function getEventById(req, res, next) {
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
        },
        include: {
            createdBy: {
            select: {
                id: true,
                name: true
            }
            },
            rsvps: {
            include: {
                user: {
                select: {
                    id: true,
                    name: true
                }
                }
            }
            }
        }
        });

        if (!event) {
        return res.status(404).json({
            message: "Event not found"
        });
        }

        return res.status(200).json({
        event
        });
    } catch (error) {
        next(error);
    }
}



export async function updateEvent(req, res, next) {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
        return res.status(400).json({
            message: "Invalid event ID"
        });
        }

        const existingEvent = await prisma.event.findUnique({
        where: {
            id: eventId
        }
        });

        if (!existingEvent) {
        return res.status(404).json({
            message: "Event not found"
        });
        }

        if (existingEvent.createdById !== req.user.id) {
        return res.status(403).json({
            message: "You are not allowed to update this event"
        });
        }

        const {
        title,
        description,
        location,
        eventDate
        } = req.body;

        if (
        !title ||
        !description ||
        !location ||
        !eventDate
        ) {
        return res.status(400).json({
            message: "All fields are required"
        });
        }

        const updatedEvent = await prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            title,
            description,
            location,
            eventDate: new Date(eventDate)
        }
        });

        return res.status(200).json({
        message: "Event updated successfully",
        event: updatedEvent
        });
    } catch (error) {
        next(error);
    }
}



export async function deleteEvent(req, res, next) {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
        return res.status(400).json({
            message: "Invalid event ID"
        });
        }

        const existingEvent = await prisma.event.findUnique({
        where: {
            id: eventId
        }
        });

        if (!existingEvent) {
        return res.status(404).json({
            message: "Event not found"
        });
        }

        if (existingEvent.createdById !== req.user.id) {
        return res.status(403).json({
            message: "You are not allowed to delete this event"
        });
        }

        await prisma.event.delete({
        where: {
            id: eventId
        }
        });

        return res.status(200).json({
        message: "Event deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}



