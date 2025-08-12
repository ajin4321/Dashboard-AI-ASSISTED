import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { MetricCard } from '@/components/MetricCard';
import { DataTable } from '@/components/DataTable';
import { RevenueChart } from '@/components/RevenueChart';
import { StatusDistribution } from '@/components/StatusDistribution';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, DollarSign, Camera, Mail, TrendingUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/1P7KRL_iTksDatBpSdRFB8erM8JNiyw7wZcP5P_yWA38/export?format=csv";
  const { data, loading, error, refetch } = useGoogleSheets(GOOGLE_SHEETS_CSV_URL);
  const [refreshing, setRefreshing] = useState(false);

  const metrics = useMemo(() => {
    if (!data.length) return null;

    const totalClients = data.length;
    const totalHeadshots = data.reduce((sum, client) => {
      const headshots = parseInt(client['No. of Headshots']) || 0;
      return sum + headshots;
    }, 0);
    
    const totalRevenue = data.reduce((sum, client) => {
      const price = parseFloat(client.Price.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + price;
    }, 0);

    const activeClients = data.filter(client => 
      client.Status.toLowerCase().includes('active') || 
      client.Status.toLowerCase().includes('completed')
    ).length;

    const averagePrice = totalRevenue / totalClients;

    return {
      totalClients,
      totalHeadshots,
      totalRevenue,
      activeClients,
      averagePrice
    };
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Successfully updated dashboard data from Google Sheets",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="pulse-glow w-16 h-16 mx-auto rounded-full bg-neon-cyan/20 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
          </div>
          <h2 className="text-2xl font-orbitron text-neon-cyan">Loading Dashboard</h2>
          <p className="text-muted-foreground">Fetching real-time data from Google Sheets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-neon-pink/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-neon-pink" />
          </div>
          <h2 className="text-2xl font-orbitron text-neon-pink">Connection Error</h2>
          <p className="text-muted-foreground max-w-md">
            Failed to connect to Google Sheets: {error}
          </p>
          <Button onClick={handleRefresh} className="btn-neon">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="cyber-title text-4xl md:text-5xl font-bold mb-2">
            CYBER DASHBOARD
          </h1>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Real-time business intelligence • {data.length} records loaded
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-neon"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Clients"
            value={metrics.totalClients}
            change="+12% this month"
            changeType="positive"
            icon={<Users className="w-6 h-6" />}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change="+8% this month"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <MetricCard
            title="Total Headshots"
            value={metrics.totalHeadshots}
            change="+15% this month"
            changeType="positive"
            icon={<Camera className="w-6 h-6" />}
          />
          <MetricCard
            title="Active Clients"
            value={metrics.activeClients}
            change={`${((metrics.activeClients / metrics.totalClients) * 100).toFixed(1)}% active`}
            changeType="neutral"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="Avg. Project Value"
            value={`$${metrics.averagePrice.toLocaleString()}`}
            change="+5% this month"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data} />
        <StatusDistribution data={data} />
      </div>

      {/* Data Table */}
      <DataTable data={data} />

      {/* ChatBot */}
      <ChatBot onDataUpdate={refetch} />
    </div>
  );
};

export default Index;
