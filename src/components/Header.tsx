
import React from 'react';
import { LineChart, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="bg-slate-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <TrendingUp className="h-8 w-8 mr-3 text-blue-400" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Sentiment-Sector Insights</h1>
            <p className="text-sm text-slate-300">Analisi dell'Impatto del Sentimento degli Investitori</p>
          </div>
        </div>
        
        <nav className="flex space-x-2">
          <Button 
            variant={location.pathname === '/' ? "default" : "outline"} 
            onClick={() => navigate('/')}
            className="flex items-center"
            size="sm"
          >
            <LineChart className="h-4 w-4 mr-2" />
            <span className="text-white">Dashboard</span>
          </Button>
          <Button 
            variant={location.pathname === '/methodology' ? "default" : "outline"}
            onClick={() => navigate('/methodology')}
            className="flex items-center"
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="text-white">Metodologia</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
