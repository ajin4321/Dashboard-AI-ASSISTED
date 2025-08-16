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
    <Card className="glass-card overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-orbitron text-neon-cyan">
              Client Database
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time data from Google Sheets
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {data.length} clients
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border font-semibold text-sm text-neon-purple">
            <div className="col-span-4 flex items-center">
              Client Name
            </div>
            <div className="col-span-2 flex items-center justify-center">
              Headshots
            </div>
            <div className="col-span-2 flex items-center">
              Price
            </div>
            <div className="col-span-2 flex items-center justify-center">
              Status
            </div>
            <div className="col-span-2 flex items-center">
              Email
            </div>
          </div>
          
          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {data.map((client, index) => (
              <div 
                key={index} 
                className="grid grid-cols-12 gap-4 px-6 py-3 text-sm hover:bg-neon-cyan/5 border-b border-border/50 last:border-b-0"
              >
                <div className="col-span-4 font-medium text-foreground flex items-center">
                  <div className="truncate pr-2">{client.Clients}</div>
                </div>
                <div className="col-span-2 flex items-center justify-center text-neon-cyan font-mono">
                  {client['No. of Headshots']}
                </div>
                <div className="col-span-2 flex items-center text-neon-green font-mono">
                  {formatPrice(client.Price)}
                </div>
                <div className="col-span-2 flex items-center justify-center">
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
                <div className="col-span-2 flex items-center text-muted-foreground font-mono text-xs">
                  <div className="overflow-x-auto">{client.Email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};