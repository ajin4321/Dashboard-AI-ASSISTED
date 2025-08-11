import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClientData } from '@/hooks/useGoogleSheets';
import { Card } from '@/components/ui/card';

interface StatusDistributionProps {
  data: ClientData[];
}

export const StatusDistribution = ({ data }: StatusDistributionProps) => {
  const processStatusData = () => {
    const statusCounts = data.reduce((acc, client) => {
      const status = client.Status.toLowerCase();
      let normalizedStatus = 'Other';
      
      if (status.includes('active') || status.includes('completed')) {
        normalizedStatus = 'Active';
      } else if (status.includes('pending') || status.includes('progress')) {
        normalizedStatus = 'Pending';
      } else if (status.includes('inactive') || status.includes('cancelled')) {
        normalizedStatus = 'Inactive';
      }
      
      acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / data.length) * 100).toFixed(1)
    }));
  };

  const statusData = processStatusData();
  
  const COLORS = {
    'Active': 'hsl(var(--neon-green))',
    'Pending': 'hsl(var(--neon-yellow))',
    'Inactive': 'hsl(var(--muted-foreground))',
    'Other': 'hsl(var(--neon-pink))'
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-neon-cyan/30">
          <p className="text-neon-cyan font-orbitron">{data.name}</p>
          <p className="text-sm text-foreground">Count: {data.value}</p>
          <p className="text-sm text-muted-foreground">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontFamily="Rajdhani"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-bold font-orbitron text-neon-cyan">
          Status Distribution
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Client status breakdown
        </p>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {statusData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {statusData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || COLORS.Other }}
            />
            <span className="text-sm font-rajdhani text-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};