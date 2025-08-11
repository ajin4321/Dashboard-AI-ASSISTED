import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  className 
}: MetricCardProps) => {
  return (
    <Card className={cn(
      "glass-card p-6 relative overflow-hidden group cursor-pointer float-animation",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground font-rajdhani">
            {title}
          </p>
          <p className="text-3xl font-bold font-orbitron text-neon-cyan">
            {value}
          </p>
          {change && (
            <div className={cn(
              "text-sm font-medium",
              changeType === 'positive' && "text-neon-green",
              changeType === 'negative' && "text-neon-pink",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-neon-purple opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            {icon}
          </div>
        )}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20" />
      </div>
    </Card>
  );
};