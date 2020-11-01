///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  getAllEvents,
  createNewEvent
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get('/all', (req: Request, res: Response) => {
  const allEvents: Event[] = getAllEvents();
  res.json(allEvents);
});


router.get('/by-days/:offset', (req: Request, res: Response) => {
  res.send('/by-days/:offset')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filters: Filter = req.query;
  const allEvents: any[] = getAllEvents();
  const regexFilter: RegExp = new RegExp(filters.search, "i");
  let filteredEvents = allEvents.filter((event) => {
    return Object.keys(event).reduce((filter: boolean, key) => {
      return filter || regexFilter.test((event[key]).toString());
    }, false)
  });

  if (filters.type) {
    filteredEvents = filteredEvents.filter((event: Event) => event.name === filters.type);
  };

  if (filters.browser) {
    filteredEvents = filteredEvents.filter((event: Event) => event.browser === filters.browser);
  };

  if (filters.sorting) {
    filteredEvents.sort((firstEvent: Event, secondEvent: Event) =>
      filters.sorting[0] === "+" ? firstEvent.date - secondEvent.date
        : secondEvent.date - firstEvent.date
    )
  };
  
  filteredEvents = filteredEvents.slice(0, filters.offset)
  res.json({ events: filteredEvents });
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const { dayZero } = req.query
  res.send('/retention')
});

router.get('/:eventId', (req: Request, res: Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const event: Event = req.body;
  createNewEvent(event);
  res.sendStatus(200)
});

router.get('/chart/os/:time', (req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

router.get('/chart/pageview/:time', (req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time', (req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time', (req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
