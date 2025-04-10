
import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sectorData } from '@/data/sectorData';

interface VolatilityComparisonProps {
  darkMode?: boolean;
}

const VolatilityComparison: React.FC<VolatilityComparisonProps> = ({ darkMode = false }) => {
  // Sort sectors by volatility
  const sortedSectors = [...sectorData].sort((a, b) => b.volatility - a.volatility);
  
  // Map data for the chart
  const chartData = sortedSectors.map(sector => ({
    name: sector.ticker,
    volatility: sector.volatility,
    color: darkMode ? sector.color.replace('#', '#') : sector.color, // Adjust color if needed for dark mode
  }));

  const axisColor = darkMode ? "#6b7280" : "#6b7280";
  const gridColor = darkMode ? "#27272a" : "#e5e7eb";
  const tooltipBg = darkMode ? "#1f2937" : "#fff";
  const tooltipBorder = darkMode ? "#374151" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke={gridColor} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: axisColor }}
          stroke={axisColor}
          tickLine={{ stroke: axisColor }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: axisColor }} 
          tickFormatter={(value) => `${value}%`}
          stroke={axisColor}
          tickLine={{ stroke: axisColor }}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Volatilità']}
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: `1px solid ${tooltipBorder}`,
            color: darkMode ? '#fff' : '#000'
          }}
        />
        <Bar dataKey="volatility" name="Volatilità (%)" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={darkMode ? (index === 0 ? '#34d399' : entry.color + '80') : entry.color} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VolatilityComparison;
