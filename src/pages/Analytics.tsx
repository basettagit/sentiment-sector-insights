
import React from 'react';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-gray-400 text-sm">Analisi dettagliata dei dati di mercato</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-teal-400" />
                Analisi a Barre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Grafici a barre in arrivo...</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-teal-400" />
                Analisi Lineare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Grafici lineari in arrivo...</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-teal-400" />
                Analisi a Torta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Grafici a torta in arrivo...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
