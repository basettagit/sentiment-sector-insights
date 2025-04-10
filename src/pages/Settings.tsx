
import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, CloudOff, BellRing, Moon, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [language, setLanguage] = useState('it');
  const [apiKeyMasked, setApiKeyMasked] = useState('*************');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('298NP5RGYWOAV0EC');
  const [offline, setOffline] = useState(false);

  const handleApiKeyChange = () => {
    const newKey = prompt("Inserisci la tua API key Alpha Vantage:", apiKey);
    if (newKey && newKey !== apiKey) {
      setApiKey(newKey);
      setApiKeyMasked('*'.repeat(newKey.length));
      toast.success("API key aggiornata con successo");
    }
  };

  const toggleOfflineMode = () => {
    setOffline(!offline);
    toast.info(offline ? "Modalità online attivata" : "Modalità offline attivata - usando dati salvati");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Impostazioni</h1>
          <p className="text-gray-300 text-sm">Configurazione e preferenze dell'applicazione</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <SettingsIcon className="mr-2 h-5 w-5 text-teal-400" />
                Generali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white">Modalità scura</div>
                    <div className="text-xs text-gray-400">Utilizza il tema scuro nell'applicazione</div>
                  </div>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white">Notifiche</div>
                    <div className="text-xs text-gray-400">Ricevi avvisi sui movimenti di mercato</div>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CloudOff className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white">Modalità offline</div>
                    <div className="text-xs text-gray-400">Usa dati in cache senza API calls</div>
                  </div>
                </div>
                <Switch 
                  checked={offline} 
                  onCheckedChange={toggleOfflineMode}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Languages className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-white">Lingua</div>
                    <div className="text-xs text-gray-400">Seleziona la lingua dell'interfaccia</div>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-900 text-white border border-gray-700 rounded p-1 text-sm"
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Key className="mr-2 h-5 w-5 text-teal-400" />
                API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm mb-4">
                Alpha Vantage fornisce dati finanziari storici e attuali. La versione gratuita è limitata a 25 chiamate API al giorno.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white">Alpha Vantage API Key</span>
                <div className="flex gap-2">
                  <input 
                    type={showApiKey ? "text" : "password"} 
                    value={showApiKey ? apiKey : apiKeyMasked} 
                    readOnly 
                    className="bg-gray-900 text-white border-gray-700 rounded text-sm px-2 py-1 w-40"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                  >
                    {showApiKey ? "Nascondi" : "Mostra"}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleApiKeyChange}
                  className="w-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                >
                  Modifica API Key
                </Button>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-2">Stato dell'API:</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span className="text-white">Limitata (25 richieste/giorno)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Visita <a href="https://www.alphavantage.co/premium/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">alphavantage.co/premium</a> per rimuovere i limiti
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
