import React, { useState, useEffect } from "react";
import { httpClient } from '../../utils/asyncUtils';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import InfiniteScroll from "react-infinite-scroll-component";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Event, CollapsibleTableProps, AllFiltered } from '../../models/event';

const useRowStyles = makeStyles(() => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
            minWidth: '150px'
        },
    },
}));

function Row(props: { event: Event }) {
    const { event } = props;
    const [open, setOpen] = useState<boolean>(false);
    const classes = useRowStyles();
    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={(): void => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    User
                </TableCell>
                <TableCell align="right">{event.distinct_user_id}</TableCell>
                <TableCell align="right">{event.name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ width: '100%', paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Event Details
              </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell align="left">Browser</TableCell>
                                        <TableCell align="left">date</TableCell>
                                        <TableCell align="left">Geolocation</TableCell>
                                        <TableCell align="left">Os</TableCell>
                                        <TableCell align="left">URL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={event._id}>
                                        <TableCell component="th" scope="row">
                                            {event._id}
                                        </TableCell>
                                        <TableCell align="left">{event.browser}</TableCell>
                                        <TableCell align="left">{`${new Date(event.date)}`}</TableCell>
                                        <TableCell align="left">
                                            lat: {event.geolocation.location.lat}
                                            lng: {event.geolocation.location.lng}
                                        </TableCell>
                                        <TableCell align="left">{event.os}</TableCell>
                                        <TableCell align="left">{event.url}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const CollapsibleTable: React.FC<CollapsibleTableProps> = (props) => {
    const { chartsData } = props
    const { setOffset } = props
    return (
        <TableContainer style={{ width: '100%' }} component={Paper}>
            <Table aria-label="collapsible table">
                <TableBody>
                    <InfiniteScroll
                        dataLength={chartsData ? chartsData.events.length : 0}
                        next={(): void => {
                            setOffset((prev: string): string => `${Number(prev) + 5}`)
                        }}
                        hasMore={chartsData ? chartsData.more : false}
                        loader={<h4>Loading...</h4>}
                        height={400}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {chartsData && chartsData.events.map((event: Event): JSX.Element => {
                            return <Row key={event._id} event={event} />
                        })}
                    </InfiniteScroll>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: "center",
        overflow: 'auto',
        width:'100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    section: {
        display: 'flex',
        // flexDirection: 'column',
    },
    formControl: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '120px'
    },
}));

const LogOfAllEvents: React.FC = () => {
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<AllFiltered | undefined>()
    const [offset, setOffset] = useState<string>('10');
    const [type, setType] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [sorting, setSorting] = useState<string>('');
    const [browser, setBrowser] = useState<string>('');

    const fetchChartsData = async (): Promise<void> => {
        const { data }: { data: AllFiltered | undefined } = await httpClient.get(`
        http://localhost:3001/events/all-filtered?offset=${offset}&type=${type}&search=${search}&sorting=${sorting}&browser=${browser}`)
        setChartsData(data)
    }

    useEffect(() => { fetchChartsData() }, [offset, type, sorting, browser, search])

    const handleChangeType = (event: React.ChangeEvent<{ value: unknown }>): void => {
        setType(event.target.value as string);
    };
    const handleChangeSorting = (event: React.ChangeEvent<{ value: unknown }>): void => {
        setSorting(event.target.value as string);
    };
    const handleChangeBrowser = (event: React.ChangeEvent<{ value: unknown }>): void => {
        setBrowser(event.target.value as string);
    };

    return (<>
        <div className={classes.container} >
            <h1>Log Of All Events</h1>
            <div className={classes.section} >
                <div className={classes.formControl} >
                    <FormControl >
                        <input
                            placeholder="Search"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setSearch(event.target.value)}
                        />
                        <InputLabel id="demo-simple-select-label" >Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            onChange={handleChangeType}
                        >
                            <MenuItem value={'signup'}>Sign Up</MenuItem>
                            <MenuItem value={'login'}>Login</MenuItem>
                            <MenuItem value={'pageView'}>Page View</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{ minWidth: '120px' }}>
                        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sorting}
                            onChange={handleChangeSorting}
                        >
                            <MenuItem value={'+date'}>DESC</MenuItem>
                            <MenuItem value={'-date'}>ASC</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{ minWidth: '120px' }}>
                        <InputLabel id="demo-simple-select-label">Browser</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={browser}
                            onChange={handleChangeBrowser}
                        >
                            <MenuItem value={'chrome'}>Chrome</MenuItem>
                            <MenuItem value={'firefox'}>FireFox</MenuItem>
                            <MenuItem value={'safari'}>Safari</MenuItem>
                            <MenuItem value={'ie'}>IE</MenuItem>
                            <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {chartsData &&
                    <CollapsibleTable chartsData={chartsData} setOffset={setOffset} />
                }
            </div>
        </div>
    </>);
};

export default LogOfAllEvents;