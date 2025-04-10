
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SentimentChartProps {
  data: {
    date: string;
    cci: number;
    returns?: number;
  }[];
  title: string;
  showReturns?: boolean;
  sectorColor?: string;
  darkMode?: boolean;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ 
  data, 
  title, 
  showReturns = false, 
  sectorColor = "#4f46e5",
  darkMode = false
}) => {
  const axisColor = darkMode ? "#6b7280" : "#6b7280";
  const gridColor = darkMode ? "#27272a" : "#e5e7eb";
  const tooltipBg = darkMode ? "#1f2937" : "#fff";
  const tooltipBorder = darkMode ? "#374151" : "#e5e7eb";
  const lineColorCCI = darkMode ? "#5eead4" : "#0891b2";
  const lineColorReturns = darkMode ? sectorColor : sectorColor;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke={gridColor} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: axisColor }} 
          stroke={axisColor}
          tickLine={{ stroke: axisColor }}
        />
        <YAxis 
          yAxisId="left" 
          orientation="left" 
          tick={{ fontSize: 12, fill: axisColor }}
          stroke={axisColor}
          tickLine={{ stroke: axisColor }}
        />
        {showReturns && (
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fontSize: 12, fill: axisColor }}
            stroke={axisColor}
            tickLine={{ stroke: axisColor }}
          />
        )}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: `1px solid ${tooltipBorder}`,
            color: darkMode ? '#fff' : '#000'
          }} 
        />
        <Legend 
          wrapperStyle={{ 
            paddingTop: 10,
            color: darkMode ? '#fff' : '#000'
          }} 
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="cci"
          stroke={lineColorCCI}
          strokeWidth={2}
          dot={false}
          name="Indice di Fiducia dei Consumatori"
          activeDot={{ r: 6, fill: lineColorCCI, stroke: darkMode ? '#111' : '#fff' }}
        />
        {showReturns && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="returns"
            stroke={lineColorReturns}
            strokeWidth={2}
            dot={false}
            name="Rendimenti"
            activeDot={{ r: 6, fill: lineColorReturns, stroke: darkMode ? '#111' : '#fff' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
