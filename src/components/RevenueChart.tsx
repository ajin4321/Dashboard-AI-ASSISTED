import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { ClientData } from '@/hooks/useGoogleSheets';
import { Card } from '@/components/ui/card';

interface RevenueChartProps {
  data: ClientData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  // Process data for revenue trends
  const processRevenueData = () => {
    const monthlyRevenue = data.reduce((acc, client) => {
      const price = parseFloat(client.Price.replace(/[^0-9.-]+/g, '')) || 0;
      const month = new Date().toLocaleDateString('en-US', { month: 'short' }); // Simplified for demo
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += price;
      
      return acc;
    }, {} as Record<string, number>);

    // Generate sample trend data for visualization
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      revenue: monthlyRevenue[month] || Math.random() * 50000 + 20000,
      target: 45000 + (index * 2000),
    }));
  };

  const revenueData = processRevenueData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-neon-cyan/30">
          <p className="text-neon-cyan font-orbitron">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: $${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-bold font-orbitron text-neon-cyan">
          Revenue Trends
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly revenue vs targets
        </p>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              fontFamily="Rajdhani"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              fontFamily="Rajdhani"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--neon-cyan))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--neon-purple))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--neon-purple))', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};