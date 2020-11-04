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

interface FilteredBySession {
  date: string;
  count: number;
  session_id: string;
}

interface HourCount {
  hour: string;
  count: number;
}

interface FilteredRes {
  events: Event[];
  more: boolean;
}

interface OsUsage {
  name: string;
  value: number;
}

interface PageViews {
  name: string;
  views: number;
}


type FilteredByDate = Omit<FilteredBySession, "date"> & { date: string };
type filteredByDays = Omit<FilteredBySession, "session_id">
type filteredAndDateFixed = Omit<FilteredBySession, "count">


function convertDateToString(date: number) {
  const today: Date = new Date(date);
  const dd: string = String(today.getDate()).padStart(2, "0");
  const mm: string = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy: number = today.getFullYear();
  const generatedDate: string = `${yyyy}/${mm}/${dd}`;
  return `${generatedDate}`;
}
const convertDaysToMili = (days: number) => days * 24 * 60 * 60 * 1000;

const toStartOfTheDay = (date: number): number => {
  return new Date(new Date(date).toDateString()).valueOf();
};

router.get('/all', (req: Request, res: Response) => {
  const allEvents: Event[] = getAllEvents();
  res.json(allEvents);
});



router.get('/by-days/:offset', (req: Request, res: Response) => {
  const offset: number = +req.params.offset;
  const allEvents: Event[] = getAllEvents();
  const initialDate: number = new Date().valueOf() - convertDaysToMili(offset - 1);
  const day: number = new Date(initialDate).getDate();
  const month: number = new Date(initialDate).getMonth() + 1;
  const year: number = new Date(initialDate).getFullYear();
  const formatedDate: number = new Date(`${year}/${month}/${day}`).valueOf();
  const endDate: number = formatedDate - convertDaysToMili(7);
  const filteredEvents: Event[] = allEvents.filter((event: Event): boolean =>
    event.date < formatedDate && event.date >= endDate);
  filteredEvents.sort((firstEvent: Event, secondEvent: Event): number =>
    firstEvent.date - secondEvent.date);
  const filteredAndDateFixed: filteredAndDateFixed[] = filteredEvents.map(
    (event: Event): filteredAndDateFixed => {
      return { session_id: event.session_id, date: convertDateToString(event.date) };
    });
  const filteredAndGrouped: FilteredByDate[] = [];
  for (const eventToCheck of filteredAndDateFixed) {
    const indexChecker: number = filteredAndGrouped.findIndex(
      (event: FilteredByDate): boolean => event.date === eventToCheck.date
    );
    if (indexChecker === -1) {
      filteredAndGrouped.push({ ...eventToCheck, count: 1 });
    } else {
      filteredAndGrouped[indexChecker].count++;
    }
  }
  const filteredAndGroupedBySessionId: FilteredBySession[] = [];
  for (const eventToCheck of filteredAndGrouped) {
    const indexChecker = filteredAndGroupedBySessionId.findIndex(
      (event: FilteredBySession): boolean => event.session_id === eventToCheck.session_id
    );

    if (indexChecker === -1) {
      filteredAndGroupedBySessionId.push(eventToCheck);
    }
  }
  const filteredByDays: filteredByDays[] = filteredAndGrouped.map(
    (event: FilteredBySession): filteredByDays => {
      return { date: event.date, count: event.count };
    })
  res.json(filteredByDays);
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const offset: number = +req.params.offset;
  const allEvents: Event[] = getAllEvents();
  const dateToCheck: number = new Date().valueOf() - convertDaysToMili(offset);
  const filteredEvents: Event[] = allEvents.filter((event: Event): boolean =>
    convertDateToString(event.date) === convertDateToString(dateToCheck)
  ).map((event: Event): Event => {
    return { ...event, date: new Date(event.date).getHours() };
  });
  const hoursArr: HourCount[] = [];
  for (let i: number = 0; i < 24; i++) {
    if (i < 10) {
      hoursArr.push({ hour: `0${i}:00`, count: 0 });
    } else {
      hoursArr.push({ hour: `${i}:00`, count: 0 });
    }
  }
  const eventsForCheck: Event[] = [];
  for (const eventToCheck of filteredEvents) {
    const checker: number = eventsForCheck.findIndex((event: Event): boolean =>
      eventToCheck.session_id === event.session_id && eventToCheck.date === event.date
    );
    if (checker === -1) {
      hoursArr[eventToCheck.date].count++;
    } else {
      eventsForCheck.push(eventToCheck);
    }
  }
  res.json(hoursArr);
});

router.get('/all-filtered', (req: Request, res: Response) => {
  req.query.offset = Number(req.query.offset)
  const filters: Filter = req.query;
  const allEvents: Event[] = getAllEvents();
  let filteredEvents: Event[] = allEvents;
  if (filters.search) {
    const reg: RegExp = new RegExp(filters.search, "i");
    filteredEvents = allEvents.filter((event: any): boolean => {
      let checker: boolean = false;
      for (const key in event) {
        if (reg.test(event.key)) {
          checker = true;
        }
      }
      return checker;
    });
  }

  if (filters.type) {
    filteredEvents = filteredEvents.filter((event: Event) => event.name === filters.type);
  }

  if (filters.browser) {
    filteredEvents = filteredEvents.filter((event: Event) => event.browser === filters.browser);
  }

  if (filters.sorting) {
    filteredEvents.sort((firstEvent: Event, secondEvent: Event) =>
      filters.sorting[0] === "+" ? firstEvent.date - secondEvent.date
        : secondEvent.date - firstEvent.date
    )
  };
  const endArr: FilteredRes = filters.offset ? filters.offset < filteredEvents.length ?
    { events: [...filteredEvents.slice(0, filters.offset)], more: true }
    : { events: [...filteredEvents.slice(0, filters.offset)], more: false }
    : { events: [...filteredEvents], more: false }
  filteredEvents = filteredEvents.slice(0, filters.offset)
  res.json(endArr);
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const dayZero: number = +req.query.dayZero;
  const events: Event[] = getAllEvents();

  let startingDateInNumber: number = toStartOfTheDay(dayZero);
  const getStringDates = (startingDateInNumber: number): string[] => {
    return [
      convertDateToString(startingDateInNumber),
      convertDateToString(startingDateInNumber + convertDaysToMili(7)),
    ];
  };
  const getSingedUsers = (startingDateInNumber: number): string[] => {
    return events
      .filter(
        (event: Event): boolean =>
          startingDateInNumber + convertDaysToMili(7) > event.date &&
          event.date > startingDateInNumber &&
          event.name === "signup"
      )
      .map((user: Event): string => user.distinct_user_id);
  };
  const getOneWeekRetentions = (
    startDate: number,
    users: string[],
    weekNumber: number
  ): weeklyRetentionObject => {
    let weeklyRetentionObject: Omit<weeklyRetentionObject, "weeklyRetention"> = {
      registrationWeek: weekNumber,
      start: getStringDates(startDate)[0],
      end: getStringDates(startDate)[1],
      newUsers: getSingedUsers(startDate).length,
    };

    const weeklyRetention: number[] = [100];
    let currentDateCheck: number = startDate + convertDaysToMili(7);
    while (true) {
      if (currentDateCheck > toStartOfTheDay(new Date().valueOf()) + convertDaysToMili(1)) {
        break;
      }
      let countUserRetention: number = 0;
      const usersEvents: string[] = events
        .filter(
          (event: Event): boolean =>
            currentDateCheck + convertDaysToMili(7) > event.date &&
            event.date >= currentDateCheck &&
            event.name === "login"
        )
        .map((user: Event): string => user.distinct_user_id);
      const setUsersArr: string[] = Array.from(new Set(usersEvents));
      for (let user of setUsersArr) {
        if (users.findIndex((userToCheck) => userToCheck === user) !== -1) {
          countUserRetention++;
        }
      }

      weeklyRetention.push(Math.round((countUserRetention * 100) / users.length));

      currentDateCheck += convertDaysToMili(7);
    }
    return { ...weeklyRetentionObject, weeklyRetention };
  };
  const retentionsData: weeklyRetentionObject[] = [];
  let retentionsCounter: number = 0;
  let numberStart: number = startingDateInNumber;

  while (numberStart < new Date().valueOf()) {
    if (getStringDates(numberStart)[0].slice(-5) === "10/25") {
      numberStart += 3600 * 1000;
    }
    retentionsCounter++;
    retentionsData.push(
      getOneWeekRetentions(numberStart, getSingedUsers(numberStart), retentionsCounter)
    );
    numberStart += convertDaysToMili(7);
    if (getStringDates(numberStart)[1].slice(-5) === "10/25") {
      numberStart += 3600 * 1000;
    }
  }

  res.json(retentionsData);
});

router.get('/:eventId', (req: Request, res: Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  const event: Event = req.body;
  createNewEvent(event);
  res.sendStatus(200)
});

router.get('/chart/os', (req: Request, res: Response) => {
  const events: Event[] = getAllEvents()
  const os: string[] = events.map((event: Event): string => event.os)
    .filter((id: string, index: number, array: string[]): boolean => {
      return array.indexOf(id) == index;
    })
  const osUsage: OsUsage[] = os.map((os: string): OsUsage => {
    let usage: number = 0
    events.forEach((event: Event): void => {
      if (event.os === os) {
        usage++
      }
    })
    return { name: os, value: usage }
  })
  res.send(osUsage)
})

router.get('/chart/pageview', (req: Request, res: Response) => {
  const events: Event[] = getAllEvents()
  const pages: string[] = events.map((event: Event): string => event.url)
    .filter((id: string, index: number, array: string[]): boolean => {
      return array.indexOf(id) == index;
    })
  const pageViews: PageViews[] = pages.map((page: string): PageViews => {
    let views: number = 0
    events.forEach((event: Event): void => {
      if (event.url === page) {
        views++
      }
    })
    return { name: page.replace('http://localhost3000/', ''), views: views }
  })
  res.send(pageViews)
})

router.get('/chart/timeonurl/:time', (req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time', (req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})

export default router;
