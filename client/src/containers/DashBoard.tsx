import React, { lazy, Suspense } from "react";
import ErrorBoundary from '../components/Charts/ErrorBoundary';
import Loading from '../components/Charts/Loading';
import { makeStyles } from "@material-ui/core/styles";

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
    padding: '0',
    width: '100%',
    border: '1px solid black'
  },
}));

const DashBoard: React.FC = () => {

  const classes = useStyles();

  return (
    <div className={classes.MyDashBoard} >
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <MyGoogleMap />
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionsDays />
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionsHours />
        </ErrorBoundary>
        <ErrorBoundary>
          <ViewsPerPage />
        </ErrorBoundary>
        <ErrorBoundary>
          <UsersByOs />
        </ErrorBoundary>
        <ErrorBoundary>
          <RetentionCohortWeek />
        </ErrorBoundary>
        <ErrorBoundary>
          <LogOfAllEvents />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default DashBoard;
