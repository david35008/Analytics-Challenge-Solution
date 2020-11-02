# Event routes:
keep in mind:
```typeScript
  type eventName = "login" | "signup" | "admin" | "/";
  type os = "windows" | "mac" | "linux" | "ios" | "android" | "other";
  type browser = "chrome" | "safari" | "edge" | "firefox" | "ie" | "other";
  type GeoLocation = {
    location: Location;
    accuracy: number;
  };
  type Location = {
    lat: number;
    lng: number;
  };

interface event {
   _id: string;
  session_id: string;
  name: eventName;
  url: string;
  distinct_user_id: string;
  date: number; // Date.prototype.getTime()
  os: os;
  browser: browser;
  geolocation: GeoLocation;
  }

let exampleEvent = {
  _id: 'VATb6bdcOEW', 
  session_id: 'd788bae3-6909-49a2-a54a-6d50d35b3c70',  
  name: 'signup',  
  distinct_user_id: 'O-5mFsaxp9',  
  date: 1603316369846,  
  os: 'ios',  
  browser: 'chrome',  
  geolocation: {  
    location: {
      lat: 81,
      lng: 86
    },  
    accuracy: 1708
  },  
  url: 'http://localhost3000/signup'
}
```
---

## POST /events
recives `Event` object in the request body(according to Event interface), and add it to DB. 

---
## /events/all
returns all events in an array:
```typescript
declare function allEvents():event[]
```
---

## /events/all-filtered

```typescript
interface Filter {
  sorting: string; // '+date'/'-date'
  type: string; 
  browser: string;
  search: string;
  offset: number;
}
const filters: Filter = req.query;
declare function allEvents():event[]
```

recives query params from client (according to ```Filter``` interface).

* __sorting-__ __must option__ : `+date` sort the events from latest to earliest, `-date` the opposite ( you can add more options if you want )
* __type-__ recives one of the `eventName` options according to the `Event` interface, and returns only matching Events.
* __browser-__ recives one of the `browser` options according to the `Event` interface, and returns only matching Events.
* __search-__ recives a value and test if it exists in one of the `Event` entities.
* __offset-__ recives an integer representing the number of events to send back to the client.

__IMPORTANT__
The entry point response format is
```typescript
{
  events: [], // array containing the filtered events
  more: true // or false
}
```
`more` - informs the client if there are events that weren't sent (becuase of the offset).

---
## /by-days/:offset

reutns a count of __unique sessions for the relevant day__ (events with different `session_id`), grouped by days, __for one week.__

__`offset`-__ number of days to go back from today. If `offset` is 0 the return result should be week ago strting from today.

example: __current date-__ 30/10/2020, __http request-__ `http://localhost:3000/events/by-days/0` 
```typescript
[
  {
    date: "24/10/2020",
    count: 12
  }, 
  {
    date: "25/10/2020",
    count: 43
  }, 
  {
    date: "26/10/2020",
    count: 7
  }, 
  ...
  ...
  ...
  {
    date: "30/10/2020",
    count: 78
  }, 
]

```

__current date-__ 30/10/2020, __http request-__ `http://localhost:3000/events/by-days/2` 
```typescript
[
  {
    date: "22/10/2020",
    count: 7
  }, 
  {
    date: "23/10/2020",
    count: 78
  }, 
  {
    date: "24/10/2020",
    count: 12
  }, 
  ...
  ...
  ...
  {
    date: "28/10/2020",
    count: 26
  }, 
]

```
---

## /by-hours/:offset

reutns a count of __unique sessions for the relevant hour__ (events with different `session_id`), grouped by hour, __for one day.__

__`offset`-__ number of days to go back from today. If `offset` is 0 the return result should todays sessions.

example: __current date-__ 30/10/2020, __http request-__ `http://localhost:3000/events/by-hours/1` 
```typescript
[ // sessions count for 29/10/2020
  {
    hour: "00:00",
    count: 12
  }, 
  {
    hour: "01:00",
    count: 43
  }, 
  {
    hour: "02:00",
    count: 7
  }, 
  {
    hour: "03:00",
    count: 78
  }, 
  ...
  ...
  ...
  {
    hour: "23:00",
    count: 54
  }
]

```
---

## /retention
request url should look like: `/retention?dayZero=11231231` for instance.   
get a "dayZero" query Parameter which denotes the day, as milliseconds, to start calculating from, return the an array of objects with User retention Information for every week since dayZero.
For every week, what percent of the users that signed up on that week have logged in to the site on every consecutive week.
```typescript
interface weeklyRetentionObject {
  registrationWeek:number;  //launch is week 0 and so on
  newUsers:number;  // how many new user have joined this week
  weeklyRetention:number[]; // for every week since, what percentage of the users came back. weeklyRetention[0] is always 100% because it's the week of registration  
  start:string;  //date string for the first day of the week
  end:string  //date string for the first day of the week
}
let week0Retention : weeklyRetentionObject = {
  registrationWeek: 1, 
  newUsers: 34, 
  weeklyRetention:[100,24,45,66,1,80],  // here we see there were 7 in total since week 1 has data for 6 weeks 
  start:'01/11/2020',
  end: '07/11/2020'
} 

declare function getRetentionCohort(dayZero:number) : weeklyRetentionObject[]
```


<!-- ## /today
gets events from today
```typescript
declare function getToday() : event[] 
```
--- -->
<!-- ## /week
gets events from the last 7 days
```typescript
declare function getWeek() : event[] 
```
--- -->


<!-- ## /:eventId
return an event by its Id
```typescript
declare function getEventById():event
``` -->

<!-- ## /chart/timeonurl/allusers
return array of objects. 
every object need to seem like {_"userId": string, "username": string, "login": number, "signin": number, "admin": number, "home": number_}.
every object show unique user and the counter of his events URL's time in seconds.

## /chart/timeonurl/inhours
return array of objects. 
every object need to seem like {_id:string ,url:string, date:number_}.
every object show every event info with date that implements the time in hours of the event. -->
