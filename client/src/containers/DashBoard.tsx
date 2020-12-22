import React, { lazy, Suspense, useState } from "react";
import ErrorBoundary from '../components/Charts/ErrorBoundary';
import Loading from '../components/Charts/Loading';
import Card from '@material-ui/core/Card';
import ViewSelector from "../components/Charts/ViewSelector";
import { PaperContainer, PageTitle, Display } from "../components/Charts/styledComponent";

const MyGoogleMap = lazy(() => import("../components/Charts/MyGoogleMap"));
const SessionsDays = lazy(() => import("../components/Charts/SessionsDays"));
const SessionsHours = lazy(() => import("../components/Charts/SessionsHours"));
const ViewsPerPage = lazy(() => import("../components/Charts/ViewsPerPage"));
const UsersByOs = lazy(() => import("../components/Charts/UsersByOs"));
const RetentionCohortWeek = lazy(() => import("../components/Charts/RetentionCohortWeek"));
const LogOfAllEvents = lazy(() => import("../components/Charts/LogOfAllEvents"));

const DashBoard: React.FC = () => {
  const [view, setView] = useState<string>("gallery");

  return (
    <>
      <PageTitle>this is DashBoard admin area</PageTitle>
      <ViewSelector view={view} setView={setView} />
      <Display className={view}>
        <Suspense fallback={<Loading />}>

          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <MyGoogleMap />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <SessionsDays />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <SessionsHours />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <ViewsPerPage />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <UsersByOs />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <LogOfAllEvents />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
          <ErrorBoundary>
            <PaperContainer>
              <Card>
                <RetentionCohortWeek />
              </Card>
            </PaperContainer>
          </ErrorBoundary>
        </Suspense>
      </Display>
    </>
  );
};

export default DashBoard;