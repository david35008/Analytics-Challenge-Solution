import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { httpClient, diffrenceInDays } from '../../utils/asyncUtils';
import { ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, } from "recharts";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SessionsHoursInter } from '../../models/event';
import { TitleAndDate, Title, MyKeyboardDatePicker } from "./styledComponent";


export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
    pickers: {
        display: 'flex',
        // flexDirection: 'column'
    }
}));

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const SessionsHours: React.FC = () => {
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<SessionsHoursInter[] | null>([]);
    const [chartsData1, setChartsData1] = useState<SessionsHoursInter[] | null>([]);
    const [selected, setSelected] = useState<number>(0);
    const [selected1, setSelected1] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedDate1, setSelectedDate1] = useState<Date | null>(new Date());
    const [open, setOpen] = React.useState(false);

    const fetchChartsData = async (cb: Function, num: number) => {
        const { data: events }: { data: SessionsHoursInter[] | null } = await httpClient.get(`http://localhost:3001/events/by-hours/${num}`)
        cb(events)
    }

    useEffect(() => {
        fetchChartsData(setChartsData, selected);
        fetchChartsData(setChartsData1, selected1)
    }, [selected, selected1])

    const handleDateChange = (date: Date | null, cb: Function) => {
        cb(date);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };


    const changeSelectData = (cb: Function, date: Date | null) => {
        const optionToOffset = diffrenceInDays(new Date(), date);
        if (optionToOffset <= 0) {
            cb(Math.abs(optionToOffset));
        } else {
            cb(0);
            handleClick();
        }
    }

    useEffect(() => {
        changeSelectData(setSelected, selectedDate)
        changeSelectData(setSelected1, selectedDate1)
        // eslint-disable-next-line
    }, [selectedDate, selectedDate1]);




    const dataForChart = chartsData1!.length > 2 ? chartsData!.map((day: SessionsHoursInter, i: number) => {
        return {
            hour: day.hour,
            count: day.count,
            count1: chartsData1![i].count
        }
    }) : []


    return (<>
        <div style={{ width: "100%", height: "600px" }}>
            <TitleAndDate>
                <Title>Sessions By Hours</Title>
                <div className={classes.pickers} >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <MyKeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date picker inline"
                            value={selectedDate}
                            onChange={(data) => handleDateChange(data, setSelectedDate)}
                            KeyboardButtonProps={{
                                "aria-label": "change date",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <MyKeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date picker inline"
                            value={selectedDate1}
                            onChange={(data) => handleDateChange(data, setSelectedDate1)}
                            KeyboardButtonProps={{
                                "aria-label": "change date",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </TitleAndDate>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    width={300}
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
            </ResponsiveContainer>
            <div className={classes.root}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="warning">
                        You have selected a date about which we have no information!
          </Alert>
                </Snackbar>
            </div>
        </div>
    </>
    );
};

export default SessionsHours;