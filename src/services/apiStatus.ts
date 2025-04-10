
import { toast } from "sonner";

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "298NP5RGYWOAV0EC";

/**
 * Checks if the Alpha Vantage API is responding correctly
 * @returns Promise<boolean> - true if API is responding, false otherwise
 */
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    // Make a simple API call to check status
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    // Check if we received a valid response
    if (data["Global Quote"] && Object.keys(data["Global Quote"]).length > 0) {
      toast.success("Connessione ad Alpha Vantage riuscita");
      return true;
    }
    
    // If we got no data or hit rate limit
    if (data["Note"] && data["Note"].includes("API call frequency")) {
      toast.warning("Alpha Vantage: limite di chiamate API raggiunto. Riprovare più tardi.");
      return false;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking API status:", error);
    return false;
  }
};
