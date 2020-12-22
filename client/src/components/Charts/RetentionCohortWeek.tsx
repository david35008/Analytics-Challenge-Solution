import React, { useState, useEffect } from "react";
import { httpClient } from '../../utils/asyncUtils';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from "@date-io/date-fns";
import { weeklyRetentionObject } from '../../models/event';
import { MyTableHead, MyTableCell, Title, TitleAndDate, MyKeyboardDatePicker } from "./styledComponent";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";


export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24
export const OneWeek: number = OneDay * 7

const useStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
    },
    table: {
        minWidth: "100%",
    },
});

const Cohort: React.FC = () => {
    const classes = useStyles();
    const [data, setData] = useState<weeklyRetentionObject[]>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2020, 9, 1));

    useEffect(() => {
        (async (): Promise<void> => {
            if (selectedDate) {
                try {
                    const { data } = await httpClient.get(
                        `http://localhost:3001/events/retention?dayZero=${selectedDate.getTime()}`
                    );
                    setData(data);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    }, [selectedDate]);

    const getClassName = (index: number, percent: number): string => {
        if (index === 0) {
            return "firstCell";
        } else {
            if (percent > 80) {
                return "high";
            } else if (percent < 80 && percent > 40) {
                return "medium ";
            } else {
                return "low";
            }
        }
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };
    return (
        <>
            <TitleAndDate>
                <Title>Retention Cohort Week By Week</Title>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <MyKeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                    />
                </MuiPickersUtilsProvider>
            </TitleAndDate>
            <div className={classes.root} >
                {data && (
                    <TableContainer>
                        <Table className={classes.table} aria-label="simple table">
                            <MyTableHead>
                                <TableRow>
                                    <MyTableCell></MyTableCell>
                                    {data.map((obj) => (
                                        <MyTableCell align="center">Week {obj.registrationWeek}</MyTableCell>
                                    ))}
                                </TableRow>
                            </MyTableHead>
                            <TableBody>
                                {data.map((obj, index) => (
                                    <TableRow key={index}>
                                        <MyTableCell align="center" className="date">
                                            {obj.start} - {obj.end}
                                        </MyTableCell>
                                        {obj.weeklyRetention.map((percent: number, index: number) => (
                                            <MyTableCell className={getClassName(index, percent)} align="center">
                                                {percent} %
                                            </MyTableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

        </>
    );
};

export default Cohort;
