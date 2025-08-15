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
          <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-sm text-neon-purple border-b border-border">
            <div>Client</div>
            <div>Headshots</div>
            <div>Price</div>
            <div>Status</div>
            <div>Email</div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {data.map((client, index) => (
              <div 
                key={index} 
                className="data-row grid grid-cols-5 gap-4 p-4 text-sm hover:bg-neon-cyan/5"
              >
                <div className="font-medium text-foreground break-words">
                  {client.Clients}
                </div>
                <div className="text-neon-cyan font-mono">
                  {client['No. of Headshots']}
                </div>
                <div className="text-neon-green font-mono">
                  {formatPrice(client.Price)}
                </div>
                <div>
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
                <div className="text-muted-foreground break-words font-mono text-xs">
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