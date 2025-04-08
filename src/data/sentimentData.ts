
// Mock data for the Consumer Confidence Index (CCI) from 2018-2020
export const cciHistoricalData = [
  { date: "2018-01", cci: 124.3 },
  { date: "2018-02", cci: 127.7 },
  { date: "2018-03", cci: 125.6 },
  { date: "2018-04", cci: 123.2 },
  { date: "2018-05", cci: 128.8 },
  { date: "2018-06", cci: 127.1 },
  { date: "2018-07", cci: 124.9 },
  { date: "2018-08", cci: 133.4 },
  { date: "2018-09", cci: 135.3 },
  { date: "2018-10", cci: 133.6 },
  { date: "2018-11", cci: 136.4 },
  { date: "2018-12", cci: 128.1 },
  { date: "2019-01", cci: 121.7 },
  { date: "2019-02", cci: 131.4 },
  { date: "2019-03", cci: 124.2 },
  { date: "2019-04", cci: 129.2 },
  { date: "2019-05", cci: 131.3 },
  { date: "2019-06", cci: 124.3 },
  { date: "2019-07", cci: 135.8 },
  { date: "2019-08", cci: 134.2 },
  { date: "2019-09", cci: 126.3 },
  { date: "2019-10", cci: 126.1 },
  { date: "2019-11", cci: 126.8 },
  { date: "2019-12", cci: 128.2 },
  { date: "2020-01", cci: 130.4 },
  { date: "2020-02", cci: 132.6 },
  { date: "2020-03", cci: 118.8 },
  { date: "2020-04", cci: 85.7 },
  { date: "2020-05", cci: 85.9 },
  { date: "2020-06", cci: 98.3 },
  { date: "2020-07", cci: 91.7 },
  { date: "2020-08", cci: 86.3 },
  { date: "2020-09", cci: 101.3 },
  { date: "2020-10", cci: 101.4 },
  { date: "2020-11", cci: 92.9 },
  { date: "2020-12", cci: 87.1 },
];

// Generate sector return data correlated with CCI
export const generateSectorData = (sectorTicker: string, baseCorrelation: number) => {
  // Get correlation value based on sector
  let correlationValue = baseCorrelation;
  let volatilityFactor = 1;
  
  // Adjust correlation and volatility based on sector
  switch(sectorTicker) {
    case 'XLK': // Technology
      correlationValue = 0.68;
      volatilityFactor = 1.5;
      break;
    case 'XLV': // Healthcare
      correlationValue = 0.43;
      volatilityFactor = 1.2;
      break;
    case 'XLF': // Financials
      correlationValue = 0.71;
      volatilityFactor = 1.8;
      break;
    case 'XLP': // Consumer Staples
      correlationValue = 0.24;
      volatilityFactor = 0.8;
      break;
    case 'XLE': // Energy
      correlationValue = 0.52;
      volatilityFactor = 2.0;
      break;
    case 'XLU': // Utilities
      correlationValue = 0.17;
      volatilityFactor = 0.7;
      break;
  }

  // Generate returns data that correlates with CCI at the specified level
  return cciHistoricalData.map(item => {
    const normalizedCCI = (item.cci - 100) / 50; // Normalize around 100
    const randomFactor = (Math.random() - 0.5) * (1 - Math.abs(correlationValue)) * 6 * volatilityFactor;
    const returns = normalizedCCI * correlationValue * 5 * volatilityFactor + randomFactor;
    
    return {
      date: item.date,
      cci: item.cci,
      returns: parseFloat(returns.toFixed(2))
    };
  });
};
