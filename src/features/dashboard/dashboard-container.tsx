"use client"; // Isso torna o componente um client component

import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { Metric } from "./models/metric";

export default function DashboardContainer({ initialMetrics }: { initialMetrics: Metric }) {
  const [metrics, setMetrics] = useState(initialMetrics);

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

  useEffect(() => {
    // Define o polling para cada 30 segundos
    const interval = setInterval(() => {
      fetchMetrics();
    }, 10000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return <Dashboard metrics={metrics} />;
}
