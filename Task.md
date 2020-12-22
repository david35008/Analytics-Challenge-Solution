# Analytics Challenge

## Introduction

You will build analytics system that would present usage analytics about a website by collecting events sent to the platform (similar to Mixpanel.com).

## Getting Started

Fork this repo and build your project on top of it.   
you can use `npm run init` __in the project root__ to download both the client and server dependencies, or :   
- Setup server  
    1. `cd server`  
    3. `npm i` 
    3. `npm start` in `/server`. (yes, in server)
    4. `npm run test` - runs backend tests (required to pass).
- Setup client  
    1. `cd client`  
    3. `npm i` 
    3. `npm start` in `/client`. this can take a while
- After installing all dependencies, you can also use `npm run dev` in in either folder to run both concurrently.

- Note: do not delete the root folder's package.json, it is necessary.
  
### Other useful commands:
- /server
    - `npm run db:seed` - reseed the database (does not affect tests.) you can determine different parameters in [.env](server/.env). Useful in case the existing data is has very old dates and you want newer entries, or add properties you want to the data.

## Admin Page Requirements:

 - Use the route '/admin' Make the following layout for tiles and make it compatible with different tile sizes and different screen sizes.

![](https://i.imgur.com/gtPzvXP.jpg)

 - Add controls for time-ranges in relevant charts (you can implement it in any way that still works with the [default requirements](backend.md)) 
### [Backend Requirements](backend.md)
### Tiles to present:
 - Showing events on Google Map (cluster events).  
you can use whichever library you choose, but [this one](https://www.npmjs.com/package/@react-google-maps/api) is recommended) 
![](https://i.imgur.com/AOACrVj.png)
 - Showing time per url per user
![](https://i.imgur.com/FSQEHo7.png)
 - Showing time spent on each page by all users.
![](https://i.imgur.com/RFx8GFw.png)
 - Showing graph with unique sessions by day with option to change date
![](https://i.imgur.com/EPPmDjq.png)
 - Showing graph with unique sessions by hour with option to change date
![](https://i.imgur.com/6gJ7e1k.png)
 - Showing retention cohort week by week
![How Startups Can Do Better Cohort Analyses – Philosophical Hacker](https://www.philosophicalhacker.com/images/cohort-analysis.png)
 - Showing log of all events - search option and filter by event name using regex. 
 
 The `Events Log` should load only 10 events, and load more only when the client scrolls down the log, order by time. 
![](https://i.imgur.com/hFlqDbG.png)
 - Showing page views for on each page.
 - Showing pie charts with users by operating system usage.

## Backend Requirements:
 - POST "/event" - adding new event to event collection.
 - An event should be registered on:
    - signup
    - login
    - pageview
    - the more the merrier
 - Implement the existing endpoints in [/events](server/backend/event-routes.ts) in the [following way](backend.md) 
 - Any other entry point needed.
 - Use lowdb and create functions for the '[event](client/src/models/event.ts)' endpoints.
	
  Sample of [event](client/src/models/event.ts) (you can add any other properties you if wish):
```json
{
  "_id": "VATb6bdcOEW", 
  "session_id": "d788bae3-6909-49a2-a54a-6d50d35b3c70",  
  "name": "signup",  
  "distinct_user_id": "O-5mFsaxp9",  
  "date": 1603316369846,  
  "os": "ios",  
  "browser": "chrome",  
  "geolocation": {  
    "location": {
      "lat": 81,
      "lng": 86
    },  
    "accuracy": 1708
  },  
  "url": "http://localhost3000/signup"
}  

```
## General Requirement
note- the repo uses 'husky' and you might find you can't push to github while there are errors in the code.
- All system will be coded using Typescript.
- Add Error Boundaries around each tile (chart).
- Use Styled Components for styling.
- The site uses `xstate` state machines for its data. you can use another method to send out AJAX if you prefer.
- Make it responsive for any screen size.
- LINT YOUR CODE
- Passing backend tests will pass the challenge, but other requirements will be inspected.

## Bonuses
  - Make your own custom tiles.
  - Make the tiles resizable.
  - Creating piece of code that send events from clients to the server and save it.
  - Add an option to change chart type (pie | bars | line) in the same tile 
  - Make the tiles move by drag and drop.
  - Make the time-frame adjustable on all charts
  - While loading data show loading indicator you built using canvas tag
  - Add any feature you wish
  - Add tests for your features
