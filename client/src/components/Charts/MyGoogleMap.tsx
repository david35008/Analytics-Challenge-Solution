import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, MarkerClusterer, LoadScript } from "@react-google-maps/api";
import { httpClient } from '../../utils/asyncUtils';
import { Event } from '../../models'
import { makeStyles, Theme } from "@material-ui/core/styles";

interface Location {
    lat: number;
    lng: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        border: '1px solid black'
    },
}));
const MyGoogleMap: React.FC = () => {
    const classes = useStyles();
    const [myFocus, setMyFocus] = useState<Location>({ lat: 31.768318, lng: 35.213711 })
    const [markers, setMarkers] = useState<Event[]>([]);


    const mapContainerStyle = {
        width: "400px",
        height: "300px",
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    }
    const mapRef = React.useRef();

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const fetchMarkers = async () => {
        const { data } = await httpClient.get('http://localhost:3001/events/all')
        setMarkers(data)
    }

    useEffect(() => { fetchMarkers() }, [])

    return (
        <div className={classes.container} >
            <h1>My Google Map</h1>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY!}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={2}
                    center={myFocus}
                    options={options}
                    onLoad={onMapLoad}
                >
                    <MarkerClusterer>
                        {(clusterer) =>
                            markers ? markers!.map((marker) => {
                                return <Marker key={marker._id} position={marker.geolocation.location} clusterer={clusterer} />
                            }) : null}
                    </MarkerClusterer>
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MyGoogleMap;
