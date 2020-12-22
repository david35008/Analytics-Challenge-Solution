import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { httpClient } from '../../utils/asyncUtils'
import { makeStyles } from "@material-ui/core/styles";
import { ViewsPerPageInter } from '../../models/event';
import { Title } from "./styledComponent";

const useStyles = makeStyles(() => ({
    container: {
        width: "100%",
        height: "600px"
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
            <Title>Views Per Page</Title>
            <ResponsiveContainer width="100%" height="80%">
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