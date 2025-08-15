import { ClientData } from '@/hooks/useGoogleSheets';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: ClientData[];
}

export const DataTable = ({ data }: DataTableProps) => {
  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('completed')) {
      return 'status-active';
    }
    if (statusLower.includes('pending') || statusLower.includes('progress')) {
      return 'status-pending';
    }
    return 'status-inactive';
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return isNaN(numPrice) ? price : `$${numPrice.toLocaleString()}`;
  };

  return (
    <Card className="glass-card p-0 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold font-orbitron text-neon-cyan">
          Client Database
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time data from Google Sheets
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="data-grid min-w-[600px]">
          <div className="grid gap-4 p-4 font-semibold text-sm text-neon-purple border-b border-border" style={{ gridTemplateColumns: '1fr 120px 100px 100px 1fr' }}>
            <div>Client</div>
            <div className="text-center">Headshots</div>
            <div>Price</div>
            <div className="text-center">Status</div>
            <div>Email</div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {data.map((client, index) => (
              <div 
                key={index} 
                className="data-row grid gap-4 p-4 text-sm hover:bg-neon-cyan/5" 
                style={{ gridTemplateColumns: '1fr 120px 100px 100px 1fr' }}
              >
                <div className="font-medium text-foreground whitespace-nowrap">
                  {client.Clients}
                </div>
                <div className="flex justify-center text-neon-cyan font-mono">
                  {client['No. of Headshots']}
                </div>
                <div className="text-neon-green font-mono">
                  {formatPrice(client.Price)}
                </div>
                <div className="flex justify-center">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "border-0 font-mono text-xs",
                      getStatusVariant(client.Status)
                    )}
                  >
                    {client.Status}
                  </Badge>
                </div>
                <div className="text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis font-mono text-xs">
                  {client.Email}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};