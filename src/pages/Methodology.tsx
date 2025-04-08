
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Methodology = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Metodologia</h1>
        <p className="text-slate-600 max-w-3xl">
          Questo progetto analizza l'impatto del sentimento degli investitori sui rendimenti azionari settoriali, 
          utilizzando una combinazione di tecniche di analisi dei dati e modelli statistici.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Dati</TabsTrigger>
          <TabsTrigger value="analysis">Analisi</TabsTrigger>
          <TabsTrigger value="results">Risultati</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Panoramica dello Studio</h2>
              <div className="space-y-4">
                <p>
                  Questo studio si propone di sfidare la Teoria del Mercato Efficiente (EMH) dimostrando 
                  che il sentimento degli investitori, guidato da ottimismo e pessimismo, influenza i prezzi 
                  delle azioni in modo significativo, specialmente in settori speculativi.
                </p>
                <p>
                  Utilizzando la regressione su dati panel, esaminiamo la correlazione tra il Consumer Confidence 
                  Index (CCI) come misura del sentimento e i rendimenti azionari di sei settori con diversi 
                  livelli di volatilità nel mercato USA dal 2000 al 2020.
                </p>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Ipotesi di Ricerca</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-900">
                    <li>Il sentimento degli investitori ha un impatto significativo sui rendimenti azionari.</li>
                    <li>L'impatto è maggiore nei settori più volatili e speculativi.</li>
                    <li>Settori difensivi mostrano una minore correlazione con gli indici di sentimento.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Raccolta e Preparazione dei Dati</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fonti dei Dati</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Consumer Confidence Index (CCI):</strong> Dati mensili dal Conference Board, 2000-2020
                  </li>
                  <li>
                    <strong>Rendimenti azionari settoriali:</strong> SPDR Sector ETFs, prezzi giornalieri dal 2000 al 2020
                  </li>
                  <li>
                    <strong>Dati macroeconomici:</strong> Inflazione, tassi di interesse, crescita del PIL (variabili di controllo)
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6">Settori Analizzati</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h4 className="font-medium mb-2">Alta Volatilità</h4>
                    <ul className="list-disc list-inside">
                      <li>Tecnologia (XLK)</li>
                      <li>Finanza (XLF)</li>
                      <li>Energia (XLE)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h4 className="font-medium mb-2">Bassa Volatilità</h4>
                    <ul className="list-disc list-inside">
                      <li>Servizi pubblici (XLU)</li>
                      <li>Beni di consumo (XLP)</li>
                      <li>Sanità (XLV)</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Preprocessing</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Conversione dei prezzi giornalieri in rendimenti mensili per allineamento con CCI</li>
                  <li>Normalizzazione del CCI e calcolo delle variazioni percentuali</li>
                  <li>Controllo per fattori macroeconomici (inflazione, tassi di interesse)</li>
                  <li>Gestione dei valori mancanti e degli outlier</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Modelli e Tecniche di Analisi</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <h3 className="text-lg font-medium">Modello di Regressione su Dati Panel</h3>
                  <p className="text-sm text-slate-700 mt-2 font-mono bg-white p-2 border border-slate-200 rounded">
                    R<sub>it</sub> = α<sub>i</sub> + β<sub>1</sub>CCI<sub>t</sub> + β<sub>2</sub>X<sub>t</sub> + ε<sub>it</sub>
                  </p>
                  <p className="mt-2">
                    Dove:<br />
                    R<sub>it</sub>: Rendimento del settore i nel periodo t<br />
                    CCI<sub>t</sub>: Consumer Confidence Index nel periodo t<br />
                    X<sub>t</sub>: Vettore di variabili di controllo<br />
                    ε<sub>it</sub>: Termine di errore
                  </p>
                </div>
                
                <h3 className="text-lg font-medium mt-4">Stima della Volatilità</h3>
                <p>
                  La volatilità storica di ciascun settore è stata calcolata utilizzando la deviazione standard 
                  dei rendimenti mensili su finestre mobili di 12 mesi:
                </p>
                <p className="text-sm text-slate-700 mt-2 font-mono bg-white p-2 border border-slate-200 rounded">
                  σ<sub>i</sub> = √(1/N · Σ(R<sub>it</sub> - R̄<sub>i</sub>)<sup>2</sup>)
                </p>
                
                <h3 className="text-lg font-medium mt-6">Test di Robustezza</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Utilizzo di misure alternative del sentimento (AAII Sentiment Survey, VIX)</li>
                  <li>Analisi per sotto-periodi (pre-crisi, crisi finanziaria, post-crisi)</li>
                  <li>Controllo per effetti di lead-lag (sentimento come indicatore anticipatore)</li>
                  <li>Test per eteroschedasticità e autocorrelazione</li>
                </ol>
                
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-6">
                  <h3 className="text-lg font-medium text-amber-800">Limitazioni Metodologiche</h3>
                  <ul className="list-disc list-inside space-y-2 text-amber-900">
                    <li>Il CCI potrebbe non catturare completamente il sentimento degli investitori professionali</li>
                    <li>Possibilità di variabili omesse rilevanti</li>
                    <li>Difficoltà nel determinare la causalità vs. correlazione</li>
                    <li>Possibili cambiamenti strutturali nei mercati durante il periodo di studio</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Risultati e Conclusioni</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Principali Risultati</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Correlazione positiva significativa</strong> tra CCI e rendimenti in tutti i settori, 
                    con coefficienti più elevati nei settori ad alta volatilità
                  </li>
                  <li>
                    Il settore <strong>Tecnologia (XLK)</strong> e <strong>Finanza (XLF)</strong> mostrano la maggiore 
                    sensibilità alle variazioni del sentimento degli investitori
                  </li>
                  <li>
                    <strong>Servizi pubblici (XLU)</strong> e <strong>Beni di consumo (XLP)</strong> mostrano coefficienti 
                    di correlazione positivi ma più bassi, confermando la loro natura difensiva
                  </li>
                  <li>
                    L'effetto del sentimento è più forte durante periodi di alta volatilità di mercato
                  </li>
                </ul>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Implicazioni per gli Investitori</h3>
                    <ul className="list-disc list-inside space-y-2 text-green-900">
                      <li>Le misure di sentimento possono fornire informazioni preziose per le strategie di allocazione settoriale</li>
                      <li>Durante periodi di forte pessimismo, i settori difensivi tendono a sovraperformare</li>
                      <li>Il monitoraggio degli indicatori di sentimento può aiutare nell'identificazione di potenziali punti di inversione del mercato</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
                    <h3 className="text-lg font-medium text-indigo-800 mb-2">Direzioni Future</h3>
                    <ul className="list-disc list-inside space-y-2 text-indigo-900">
                      <li>Incorporare dati di sentiment analysis dai social media</li>
                      <li>Estendere l'analisi ai mercati emergenti</li>
                      <li>Sviluppare modelli di trading basati sui risultati</li>
                      <li>Analizzare l'impatto del sentimento sulla volatilità implicita</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Conclusione</h3>
                  <p>
                    I risultati dell'analisi supportano l'ipotesi che il sentimento degli investitori gioca un ruolo 
                    significativo nella determinazione dei rendimenti azionari settoriali, contraddicendo le forme più 
                    rigide dell'Efficient Market Hypothesis. L'effetto è particolarmente pronunciato nei settori ad 
                    alta volatilità e durante periodi di incertezza di mercato, suggerendo opportunità per strategie 
                    di allocazione settoriale basate su indicatori di sentimento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Methodology;
