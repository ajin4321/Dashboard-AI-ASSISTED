import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface ClientData {
  Clients: string;
  'No. of Headshots': string;
  Price: string;
  Status: string;
  Email: string;
}

export const useGoogleSheets = (csvUrl: string) => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleanedData = results.data.filter((row: any) => 
            row.Clients && row.Clients.trim() !== ''
          ) as ClientData[];
          setData(cleanedData);
          setLoading(false);
        },
        error: (error) => {
          setError(`Parse error: ${error.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [csvUrl]);

  return { data, loading, error, refetch: fetchData };
};