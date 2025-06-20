"use client"; // Isso torna o componente um client component

import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { MetricResponse, CameraStatusResponse } from "./models/metric";
import { LocationData, LocationResponse } from "./actions/getTodayLocations.action";

export default function DashboardContainer({ initialMetrics }: { initialMetrics: MetricResponse }) {
  const [metrics, setMetrics] = useState<MetricResponse>(initialMetrics);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [cameraStatus, setCameraStatus] = useState<CameraStatusResponse>({ statuses: [], total_count: 0 });

  // Função para buscar os dados
  async function fetchMetrics() {
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Falha ao buscar métricas");
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Erro ao atualizar as métricas:", error);
    }
  }

  // Função para buscar status das câmeras
  async function fetchCameraStatus() {
    try {
      const res = await fetch("/api/cameras/status");
      if (!res.ok) throw new Error("Falha ao buscar status das câmeras");
      const data = await res.json();
      setCameraStatus(data);
    } catch (error) {
      console.error("Erro ao buscar status das câmeras:", error);
      setCameraStatus({ statuses: [], total_count: 0 });
    }
  }

  // Função para buscar localizações do dia atual
  async function fetchTodayLocations() {
    try {
      const res = await fetch("/api/locations/today");
      if (!res.ok) throw new Error("Falha ao buscar localizações");
      const data: LocationResponse = await res.json();
      setLocations(data.locations);
    } catch (error) {
      console.error("Erro ao buscar localizações:", error);
      // Fallback para dados mock se a API falhar
      setLocations([]);
    }
  }

  // Função para refresh all data (exposed to Dashboard)
  const refreshData = async () => {
    await Promise.all([
      fetchMetrics(),
      fetchCameraStatus(),
      fetchTodayLocations()
    ]);
  };

  // Função específica para refresh apenas das câmeras (mais eficiente)
  const refreshCameraStatus = async () => {
    await fetchCameraStatus();
  };

  useEffect(() => {
    // Define o polling para cada 10 segundos
    const interval = setInterval(() => {
      fetchMetrics();
      fetchCameraStatus();
      fetchTodayLocations();
    }, 10000);

    // Busca os dados iniciais
    fetchCameraStatus();
    fetchTodayLocations();

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return (
    <Dashboard 
      metrics={metrics} 
      locations={locations} 
      cameraStatus={cameraStatus}
      onRefreshData={refreshData}
      onRefreshCameras={refreshCameraStatus}
    />
  );
}
