"use client";
import React, { useState, useEffect } from 'react';
import { Paper, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData } from '../actions/getTodayLocations.action';

interface VehicleMapProps {
    locations: LocationData[];
}

// Configuração do ícone do veículo
const vehicleIcon = L.icon({
    iconUrl: '/car.webp',
    iconSize: [24, 40],
    iconAnchor: [12, 20],
});

export default function VehicleMap({ locations }: VehicleMapProps) {
    const [mapLocations, setMapLocations] = useState<LocationData[]>([]);
    const [mapKey, setMapKey] = useState(0);
    const [userLocation, setUserLocation] = useState<LatLngExpression | undefined>(undefined);
    
    // Atualiza as localizações do mapa quando as props mudarem
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
        }, () => {
            setUserLocation(L.latLng(-23.5505, -46.6333));
        });
        setMapLocations(locations);
        // Força re-renderização do mapa incrementando a key
        setMapKey(prev => prev + 1);
    }, [locations]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
        }, () => {
            setUserLocation(L.latLng(-23.5505, -46.6333));
        });
    }, []);

    // Ordena as localizações por timestamp (mais antigas primeiro para o trajeto)
    const sortedLocations = [...mapLocations].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Localização mais recente para centralizar o mapa
    const latestLocation = sortedLocations[sortedLocations.length - 1];
    
    return (
        <Paper elevation={8} sx={{ mt: 3, height: '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                key={mapKey} // Força re-renderização quando a key muda
                center={latestLocation ? [latestLocation.latitude, latestLocation.longitude] : userLocation}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {sortedLocations.length > 0 && (
                    <>
                        <Polyline
                            positions={sortedLocations.map(location => [location.latitude, location.longitude])}
                            color="#2196f3"
                            weight={3}
                        />
                        <Marker
                            position={[latestLocation.latitude, latestLocation.longitude]}
                            icon={vehicleIcon}
                        />
                    </>
                )}
            </MapContainer>
            {latestLocation && (
                <Paper 
                    elevation={8} 
                    sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        padding: 2,
                        backgroundColor: 'rgba(12, 12, 12, 0.8)',
                        color: 'white',
                        zIndex: 1000,
                        minWidth: '200px'
                    }}
                >
                    <Typography variant="h6" gutterBottom color="white">
                        Vehicle Status
                    </Typography>
                    <Typography variant="body2" color="white">
                        Speed: {Math.floor(latestLocation.speed)} km/h
                    </Typography>
                    <Typography variant="body2" color="white">
                        Satellites: {latestLocation.sats}
                    </Typography>
                    <Typography variant="body2" color="white">
                        HDOP: {latestLocation.hdop.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="white">
                        Last Update: {new Date(latestLocation.timestamp).toLocaleString('pt-BR')}
                    </Typography>
                </Paper>
            )}
            {mapLocations.length === 0 && (
                <Paper 
                    elevation={8} 
                    sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        padding: 2,
                        backgroundColor: 'rgba(12, 12, 12, 0.8)',
                        color: 'white',
                        zIndex: 1000
                    }}
                >
                    <Typography variant="h6" gutterBottom color="white">
                        No GPS Data
                    </Typography>
                    <Typography variant="body2" color="white">
                        Waiting for location data...
                    </Typography>
                </Paper>
            )}
        </Paper>
    );
} 