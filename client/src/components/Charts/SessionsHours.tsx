import React, { useState, useEffect } from "react";
import { httpClient } from '../../utils/asyncUtils';
import { Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, } from "recharts";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { SessionsHoursInter } from '../../models/event';

export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: "center",
        border: '1px solid black'
    },
    pickers: {
        display: 'flex',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const SessionsHours: React.FC = () => {
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<SessionsHoursInter[] | undefined>([]);
    const [chartsData1, setChartsData1] = useState<SessionsHoursInter[] | undefined>([]);
    const [selected, setSelected] = useState<number>(0);
    const [selected1, setSelected1] = useState<number>(1);

    const fetchChartsData = async () => {
        const { data: events }: { data: SessionsHoursInter[] | undefined } = await httpClient.get(`http://localhost:3001/events/by-hours/${selected}`)
        setChartsData(events)
        const { data: events1 }: { data: SessionsHoursInter[] | undefined } = await httpClient.get(`http://localhost:3001/events/by-hours/${selected1}`)
        setChartsData1(events1)
    }

    useEffect(() => { fetchChartsData() }, [selected, selected1])

    const changeDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const picked: number = Math.round((Date.now().valueOf() - new Date(e.target.value).valueOf()) / OneDay)
        if (picked < 1) {
            alert('Invalid Date')
            setSelected(0)
            e.target.value = new Date(Date.now()).toDateString()
        } else {
            setSelected(picked)
        }
    }
    const changeDate1 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const picked: number = Math.round((Date.now().valueOf() - new Date(e.target.value).valueOf()) / OneDay)
        if (picked < 1) {
            alert('Invalid Date')
            setSelected1(0)
            e.target.value = new Date(Date.now()).toDateString()
        } else {
            setSelected1(picked)
        }
    }

    const dataForChart = chartsData1!.length > 2 ? chartsData!.map((day: SessionsHoursInter, i: number) => {
        return {
            hour: day.hour,
            count: day.count,
            count1: chartsData1![i].count
        }
    }) : []


    return (<>
        <div className={classes.container} >
            <h1>Sessions(hour)</h1>
            <div className={classes.pickers} >
                <TextField
                    id="date"
                    label="Main"
                    type="date"
                    defaultValue=''
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={changeDate}
                />
                <TextField
                    id="date"
                    label="Secondary"
                    type="date"
                    defaultValue=''
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={changeDate1}
                />
            </div>
            <LineChart
                width={600}
                height={300}
                data={dataForChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey='count1' stroke="#000000" />
                <Line type="monotone" dataKey='count' stroke="#82ca9d" />
            </LineChart>
        </div>
    </>
    );
};

export default SessionsHours;
