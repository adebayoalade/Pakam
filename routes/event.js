const express = require('express')
const Event = require('../models/Event')
const WaitingList = require('../models/Waitinglist')

const router = express.Router();


//initialize an event
router.post("/initialize",  async(req, res) => {
  const { name, totalTickets } = req.body;
  try {
    const event = await Event.create({
        name,
        totalTickets,
        availableTickets: totalTickets
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json(error);
  }
});


//Book a ticket
router.post("/book", async(req, res) => {
    const { eventId, userId } = req.body;
    try {
        await sequelize.transaction(async (t) => {
            const event = await Event.findByPk(eventId, { transaction: t });

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            if (event.availableTickets > 0) {
                await event.decrement('availableTickets', { by: 1, transaction: t });
                res.status(200).json({ message: 'Ticket booked successfully' });
            } else {
                await WaitingList.create({ userId, eventId }, { transaction: t });
                res.status(200).json({ message: 'Added to waiting list' });
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Cancel booking
router.post("/cancel", async(req, res) => {
    const { eventId} = req.body;
    try {
        await sequelize.transaction(async (t) => {
            const event = await Event.findByPk(eventId, { transaction: t });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const waitingUser = await WaitingList.findOne({ where: { eventId }, transaction: t });

            if (waitingUser) {
                await waitingUser.destroy({ transaction: t });
                res.status(200).json({ message: 'ticket transferred to waiting user' });
            } else {
                await event.increment('availableTickets', { by: 1, transaction: t });
                res.status(200).json({ message: 'booking cancelled and ticket available' });
            }
        });
    } catch (error) {
        res.status(500).json();
    }
});


//view event status
router.get("/status/:eventId", async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const waitingCount = await WaitingList.count({ where: { eventId: event.id } });
        res.status(200).json({
            availableTickets: event.availableTickets,
            waitingListCount: waitingCount,
        });
    } catch (error) {
        res.status(500).json();
    }
});


module.exports = router; // Export the router