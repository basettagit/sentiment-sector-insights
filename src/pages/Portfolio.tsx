
import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Portfolio = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Portfolio</h1>
          <p className="text-gray-400 text-sm">Gestione del tuo portafoglio di investimenti</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-teal-400" />
                Riepilogo Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Dettagli del portfolio in arrivo...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
