
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Settings = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Impostazioni</h1>
          <p className="text-gray-400 text-sm">Configurazione e preferenze dell'applicazione</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5 text-teal-400" />
                Generali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Modalità scura</span>
                <Button variant="outline" size="sm" className="bg-gray-900">Attivato</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Notifiche</span>
                <Button variant="outline" size="sm" className="bg-gray-900">Disattivato</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Aggiornamenti automatici</span>
                <Button variant="outline" size="sm" className="bg-gray-900">Attivato</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle>API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Alpha Vantage API Key</span>
                <div className="flex gap-2">
                  <input type="password" value="*************" disabled className="bg-gray-900 border-gray-700 rounded text-sm px-2 py-1" />
                  <Button variant="outline" size="sm" className="bg-gray-900">Modifica</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
