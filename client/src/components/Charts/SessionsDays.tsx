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
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const SessionsDays: React.FC = () => {
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<SessionsHoursInter[] | undefined>([])
    const [selected, setSelected] = useState<number>(0);

    const fetchChartsData = async () => {
        const { data }: { data: SessionsHoursInter[] | undefined } = await httpClient.get(`http://localhost:3001/events/by-days/${selected}`)
        setChartsData(data)
    }

    useEffect(() => { fetchChartsData() }, [selected])

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

    return (<>
        <div className={classes.container} >
            <h1>Sessions(days)</h1>
            <TextField
                id="date"
                label="Pick Offset Day"
                type="date"
                defaultValue=''
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={changeDate}
            />
            <LineChart
                width={600}
                height={300}
                data={chartsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey='count' stroke="#82ca9d" />
            </LineChart>
        </div>
    </>);
};

export default SessionsDays;
