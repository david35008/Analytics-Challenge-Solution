import React, { lazy, Suspense } from "react";
import ErrorBoundary from '../components/Charts/ErrorBoundary';
import Loading from '../components/Charts/Loading';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import styled from 'styled-components'

const MyGoogleMap = lazy(() => import("../components/Charts/MyGoogleMap"));
const SessionsDays = lazy(() => import("../components/Charts/SessionsDays"));
const SessionsHours = lazy(() => import("../components/Charts/SessionsHours"));
const ViewsPerPage = lazy(() => import("../components/Charts/ViewsPerPage"));
const UsersByOs = lazy(() => import("../components/Charts/UsersByOs"));
const RetentionCohortWeek = lazy(() => import("../components/Charts/RetentionCohortWeek"));
const LogOfAllEvents = lazy(() => import("../components/Charts/LogOfAllEvents"));

const useStyles = makeStyles(() => ({
  MyDashBoard: {
    display: "flex",
    flexWrap: 'wrap',
    padding: '10px',
    width: '100%',
    border: '2px solid black',
    borderRadius: '10px',
  },
}));

const MyGrid = styled.div`
display: grid;
padding: '10px';
width: '100%';
border: '2px solid black';
border-radius: '10px';
grid-template-areas:
"retention retention"
"map sessionsDay"
"sessionsHour pageView"
"log byOs";
grid-template-rows: 1fr 1fr 1fr 1fr;
grid-template-columns: 1fr 1fr;
gap: '10px';
max-width:'100vw';
@media (max-width: 768px) {
  display: grid;
padding: '10px';
width: '100%';
border: '2px solid black';
border-radius: '10px';
grid-template-areas:
"retention"
"map"
"sessionsDay"
"sessionsHour"
"pageView"
"byOs"
"log";
grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
grid-template-columns: 1fr ;
gap: '10px';
max-width:'100vw';
  }
`;

const DashBoard: React.FC = () => {

  const classes = useStyles();

  return (
    <>
      <h1>My DashBoard</h1>
      <MyGrid>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <div style={{gridArea: 'retention',}}>
          <Card>
            <RetentionCohortWeek />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'map'}}>
          <Card>
            <MyGoogleMap />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'sessionsDay'}}>
          <Card>
            <SessionsDays />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'sessionsHour'}}>
          <Card>
            <SessionsHours />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'pageView'}}>
          <Card>
            <ViewsPerPage />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'byOs'}}>
          <Card>
            <UsersByOs />
          </Card>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
        <div style={{gridArea: 'log'}}>
          <Card>
            <LogOfAllEvents />
          </Card>
          </div>
        </ErrorBoundary>
      </Suspense>
    </MyGrid>
    </>
  );
};

export default DashBoard;