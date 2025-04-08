
import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-4 px-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Sentiment-Sector Insights</p>
        <div className="flex items-center mt-2 md:mt-0">
          <a href="https://github.com/username/investor-sentiment-analysis" className="flex items-center text-slate-300 hover:text-white transition-colors" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4 mr-2" />
            Codice Sorgente
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
