import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Sector } from 'recharts'
import { httpClient } from '../../utils/asyncUtils'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { PieOsInter, ActiveShapeInter } from '../../models/event';

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

const PieOs: React.FC = () => {
    const classes = useStyles();
    const [chartData, setChartData] = useState<PieOsInter[] | undefined>([])
    const [index, setIndex] = useState<number>()

    const onPieEnter = (index: number): void => {
        setIndex(index)
    };

    const fetchChartData = async (): Promise<void> => {
        const { data }: { data: PieOsInter[] | undefined } = await httpClient.get(`http://localhost:3001/events/chart/os`)
        setChartData(data)
    }

    useEffect(() => { fetchChartData() }, [])

    const renderActiveShape = (props: ActiveShapeInter): JSX.Element => {
        const RADIAN: number = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Usage: ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    return (
        <div className={classes.container} >
            <h1>Users By Os</h1>
            <div style={{ width: '40%', minWidth: '400px', height: '250px' }}>
                <ResponsiveContainer >
                    <PieChart>
                        <Pie
                            activeIndex={index}
                            activeShape={renderActiveShape}
                            data={chartData}
                            cx={210}
                            cy={115}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieOs;