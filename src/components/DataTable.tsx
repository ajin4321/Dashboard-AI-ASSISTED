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
        <div className="data-grid min-w-[600px] lg:min-w-0">
          <div className="grid gap-4 lg:gap-8 p-4 lg:p-6 font-semibold text-sm text-neon-purple border-b border-border" style={{ gridTemplateColumns: '1fr 120px 100px 100px 1fr' }}>
            <div className="px-2 lg:px-4">Client</div>
            <div className="text-center lg:px-3">Headshots</div>
            <div className="lg:px-3">Price</div>
            <div className="text-center lg:px-3">Status</div>
            <div className="lg:px-4">Email</div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {data.map((client, index) => (
              <div 
                key={index} 
                className="data-row grid gap-4 lg:gap-8 p-4 lg:p-6 text-sm hover:bg-neon-cyan/5 border-b border-border/20" 
                style={{ gridTemplateColumns: '1fr 120px 100px 100px 1fr' }}
              >
                <div className="font-medium text-foreground overflow-hidden lg:px-4">
                  <div className="truncate pr-2 lg:pr-4">{client.Clients}</div>
                </div>
                <div className="flex justify-center text-neon-cyan font-mono lg:px-3">
                  {client['No. of Headshots']}
                </div>
                <div className="text-neon-green font-mono lg:px-3">
                  {formatPrice(client.Price)}
                </div>
                <div className="flex justify-center lg:px-3">
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
                <div className="text-muted-foreground overflow-x-auto font-mono text-xs lg:px-4">
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