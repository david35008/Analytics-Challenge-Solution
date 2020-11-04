import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { httpClient } from '../../utils/asyncUtils'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ViewsPerPageInter } from '../../models/event';

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

const ViewsPerPage: React.FC = () => {
    const classes = useStyles();
    const [chartData, setChartData] = useState<ViewsPerPageInter[] | undefined>([])

    const fetchChartData = async () => {
        const { data }: { data: ViewsPerPageInter[] | undefined } = await httpClient.get(`http://localhost:3001/events/chart/pageview`)
        setChartData(data)
    }

    useEffect(() => { fetchChartData() }, [])

    return (
        <div className={classes.container}>
            <h1>Views Per Page</h1>
            <ResponsiveContainer width={730} height={250} >
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewsPerPage;