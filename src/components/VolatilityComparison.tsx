
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

const VolatilityComparison: React.FC = () => {
  // Sort sectors by volatility
  const sortedSectors = [...sectorData].sort((a, b) => b.volatility - a.volatility);
  
  // Map data for the chart
  const chartData = sortedSectors.map(sector => ({
    name: sector.ticker,
    volatility: sector.volatility,
    color: sector.color,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Confronto della Volatilità tra Settori</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Volatilità']}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="volatility" name="Volatilità (%)" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolatilityComparison;
