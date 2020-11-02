import mockData from "./mock_data";
import request from "supertest";
import app from "../app";
import db from "../database";
import { Event as event,os } from "../../../client/src/models/event";
import {OneHour, OneDay, OneWeek} from '../timeFrames'

const isEvent = (event : any ): event is event => {
  if(
   '_id' in event&&
   'session_id' in event&&
   'name' in event&&
   'url' in event&&
   'distinct_user_id' in event&&
   'date' in event&&
   'os' in event&&
   'browser' in event&&
   'geolocation' in event
   ){
     return true
   }else{
     return false
   }
}

const isEventArray = (events: any[]): events is event[] => {
 return events.every(eve=>isEvent(eve))
}

describe("main test", () => {

 beforeAll(async (done) => {
   db.setState(mockData).write()
   done()
 })

 it("can get all events", async () => {
   const { body: allEvents } = await request(app).get("/events/all").expect(200);
   expect(allEvents.length).toBe(300);
 });

 it("getting all events from the server must return array of event types", async () => {
   const { body: allEvents } = await request(app).get("/events/all").expect(200);
   expect(isEventArray(allEvents)).toBe(true);
 });

 it("can get unique sessions count by day", async () => {
   const { body: sessionsByDays } = await request(app).get("/events/by-days/0").expect(200)

   expect(sessionsByDays.length).toBe(7)
   expect(sessionsByDays.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(145
     )
   expect(sessionsByDays[0].count).toBe(19);

   const { body: sessionsByDays2 } = await request(app).get("/events/by-days/7").expect(200)

   expect(sessionsByDays2.length).toBe(7)
   expect(sessionsByDays2.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(78)
   expect(sessionsByDays2[0].count).toBe(11);
   expect(sessionsByDays2[1].count).toBe(9);
   expect(sessionsByDays2[6].count).toBe(14);
 });

 it("can get unique sessions count by hour", async () => {
   const { body: sessionsByHours } = await request(app).get("/events/by-hours/0").expect(200)

   expect(sessionsByHours.length).toBe(24)
   expect(sessionsByHours.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(7)

   const { body: sessionsByHours2 } = await request(app).get("/events/by-hours/2").expect(200)

   expect(sessionsByHours2.length).toBe(24)
   expect(sessionsByHours2.reduce((sum: number, day: {date: string; count: number}) => sum += day.count, 0)).toBe(25)
 });

 it("retention cohort", async () => {
   const today = new Date (new Date().toDateString()).getTime()+6*OneHour
   const dayZero = today-5*OneWeek

   const { body: retentionData } = await request(app).get(
     `/events/retention?dayZero=${dayZero}`
   ).expect(200);
   
   console.log(retentionData)

   expect(retentionData.length).toBe(6);
   
   expect(retentionData[0].weeklyRetention).toEqual([ 100, 40, 60, 90, 80, 0 ]);
   expect(retentionData[1].weeklyRetention).toEqual([ 100, 90, 60,100,0 ]);
   expect(retentionData[2].weeklyRetention).toEqual([ 100, 100, 82, 9 ]);
   expect(retentionData[4].newUsers).toBe(9);


 });
 it("can filter events by browser", async () => {

   const { body: events}  = await request(app).get("/events/all-filtered")
   .query({
     browser: "chrome",
     offset: 20,
   })
   .expect(200);
   expect(events.events.length).toBe(20);
   expect(events.events[0].browser).toBe("chrome")
   expect(events.events[15].browser).toBe( "chrome")
 })

 it("can filter events by type", async () => {
   const { body: events}  = await request(app).get("/events/all-filtered")
   .query({
     type: "signup",
     offset: 5,
     search: "100"
   })
   .expect(200);
   expect(events.events.length).toBe(2);
   expect(events.events[0].session_id).toMatch(/100/i)
   expect(events.events[1].session_id).toMatch(/100/i)
 })

 it("can sort events by date", async () => {
   const { body: events}  = await request(app).get("/events/all-filtered")
   .query({
     offset: 5,
     sorting: "-date"
   })
   .expect(200);
   const { body: events2}  = await request(app).get("/events/all-filtered")
   .query({
     offset: 5,
     sorting: "+date"
   })
   .expect(200);
   expect(events.events[0].date).toBeGreaterThan(events2.events[0].date)
   expect(events.events[0].date).toBeGreaterThan(events.events[4].date)
   expect(events2.events[1].date).toBeGreaterThan(events2.events[0].date)
 })

 it("can post new event", async () => {
   await request(app).post("/events").send(mockData.events[0]).expect(200);
   const { body: allEvents2 } = await request(app).get("/events/all").expect(200);
   expect(allEvents2.length).toBe(301);
   expect(allEvents2[300].date).toBe(mockData.events[0].date);
   expect(allEvents2[300].os).toBe(mockData.events[0].os);
 });

})