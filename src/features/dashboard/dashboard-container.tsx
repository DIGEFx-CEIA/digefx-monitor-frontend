"use client"; // Isso torna o componente um client component

import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { MetricResponse } from "./models/metric";
import { LocationData, LocationResponse } from "./actions/getTodayLocations.action";

export default function DashboardContainer({ initialMetrics }: { initialMetrics: MetricResponse }) {
  const [metrics, setMetrics] = useState<MetricResponse>(initialMetrics);
  const [locations, setLocations] = useState<LocationData[]>([]);

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

  useEffect(() => {
    // Define o polling para cada 30 segundos
    const interval = setInterval(() => {
      fetchMetrics();
      fetchTodayLocations();
    }, 10000);

    // Busca os dados iniciais
    fetchTodayLocations();

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return <Dashboard metrics={metrics} locations={locations} />;
}
