import { Paper, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VehicleMapProps {
    coordinates: {
        latitude: number;
        longitude: number;
        velocidade: number;
        horario: string;
    }[];
}

// Configuração do ícone do veículo
const vehicleIcon = L.icon({
    iconUrl: '/car.webp',
    iconSize: [24, 40],
    iconAnchor: [12, 20],
});

export default function VehicleMap({ coordinates }: VehicleMapProps) {
    return (
        <Paper elevation={8} sx={{ mt: 3, height: '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                center={coordinates.length > 0 ? [coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude] : [-23.5505, -46.6333]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {coordinates.length > 0 && (
                    <>
                        <Polyline
                            positions={coordinates.map(coord => [coord.latitude, coord.longitude])}
                            color="#2196f3"
                        />
                        <Marker
                            position={[coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude]}
                            icon={vehicleIcon}
                        />
                    </>
                )}
            </MapContainer>
            {coordinates.length > 0 && (
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
                        Vehicle Status
                    </Typography>
                    <Typography variant="body1" color="white">
                        Speed: {coordinates[coordinates.length - 1].velocidade} km/h
                    </Typography>
                    <Typography variant="body1" color="white">
                        Last Update: {new Date(coordinates[coordinates.length - 1].horario).toLocaleString('en-US')}
                    </Typography>
                </Paper>
            )}
        </Paper>
    );
} 