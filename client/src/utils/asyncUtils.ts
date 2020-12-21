import axios from "axios";

export const httpClient = axios.create({ withCredentials: true });

export function diffrenceInDays(date1: Date, date2: Date | any): number {
    const date3 = new Date(date1.toISOString().substring(0, 10));
    const date4 = new Date(date2.toISOString().substring(0, 10));
    const diffTime = date4.getTime() - date3.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
