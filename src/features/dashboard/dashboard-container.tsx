"use client"; // Isso torna o componente um client component

import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import { MetricResponse } from "./models/metric";

export interface Coordinate {
  latitude: number;
  longitude: number;
  velocidade: number;
  horario: string;
}

export default function DashboardContainer({ initialMetrics }: { initialMetrics: MetricResponse }) {
  const [metrics, setMetrics] = useState<MetricResponse>(initialMetrics);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

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

  // Função fictícia para buscar coordenadas
  async function fetchCoordinates() {
    // Ponto inicial: Santos
    const startLat = -23.9608;
    const startLng = -46.3339;
    
    // Ponto final: São Paulo
    const endLat = -23.5505;
    const endLng = -46.6333;
    
    // Número de pontos
    const numPoints = 100;
    
    // Gerar pontos intermediários
    const mockCoordinates: Coordinate[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const progress = i / (numPoints - 1);
      
      // Interpolação linear entre os pontos
      const lat = startLat + (endLat - startLat) * progress;
      const lng = startLng + (endLng - startLng) * progress;
      
      // Adiciona alguma variação aleatória para simular um trajeto mais realista
      const latVariation = (Math.random() - 0.5) * 0.01;
      const lngVariation = (Math.random() - 0.5) * 0.01;
      
      // Velocidade simulada entre 40 e 100 km/h
      const velocidade = 40 + Math.random() * 60;
      
      // Horário simulado (cada ponto a cada 1 minuto)
      const horario = new Date();
      horario.setMinutes(horario.getMinutes() - (numPoints - i));
      
      mockCoordinates.push({
        latitude: lat + latVariation,
        longitude: lng + lngVariation,
        velocidade: Math.round(velocidade),
        horario: horario.toISOString()
      });
    }
    
    setCoordinates(mockCoordinates);
  }

  useEffect(() => {
    // Define o polling para cada 30 segundos
    const interval = setInterval(() => {
      fetchMetrics();
      fetchCoordinates();
    }, 10000);

    // Busca os dados iniciais
    fetchCoordinates();

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return <Dashboard metrics={metrics} coordinates={coordinates} />;
}
