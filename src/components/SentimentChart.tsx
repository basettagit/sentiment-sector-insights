
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
}

const SentimentChart: React.FC<SentimentChartProps> = ({ 
  data, 
  title, 
  showReturns = false, 
  sectorColor = "#4f46e5" 
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
            {showReturns && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />}
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cci"
              stroke="#0891b2"
              strokeWidth={2}
              dot={false}
              name="Indice di Fiducia dei Consumatori"
            />
            {showReturns && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="returns"
                stroke={sectorColor}
                strokeWidth={2}
                dot={false}
                name="Rendimenti"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
