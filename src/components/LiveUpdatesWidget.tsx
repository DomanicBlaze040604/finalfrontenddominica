import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { liveUpdatesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';

const LiveUpdatesWidget = () => {
  const { data, refetch } = useQuery({
    queryKey: ['liveUpdates', 'active'],
    queryFn: () => liveUpdatesApi.getActive(3),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const liveUpdates = data?.success ? data.data : [];

  if (!liveUpdates || liveUpdates.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    const colors = {
      breaking: 'bg-red-600',
      sports: 'bg-green-600',
      weather: 'bg-blue-600',
      traffic: 'bg-yellow-600',
      election: 'bg-purple-600',
      general: 'bg-gray-600',
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      breaking: '🔴',
      sports: '⚽',
      weather: '🌤️',
      traffic: '🚗',
      election: '🗳️',
      general: '📰',
    };
    return icons[type as keyof typeof icons] || icons.general;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold">Live Now</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveUpdates.map((update) => (
            <Link
              key={update.id}
              to={`/live/${update.id}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getTypeColor(update.type)} text-white text-xs`}>
                      {getTypeIcon(update.type)} {update.type.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-red-600 font-semibold animate-pulse">
                      <div className="w-2 h-2 bg-red-600 rounded-full" />
                      LIVE
                    </div>
                  </div>

                  <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {update.title}
                  </h3>

                  {update.metadata?.score && (
                    <div className="bg-gray-100 rounded px-3 py-2 mb-2">
                      <p className="text-sm font-semibold text-center">
                        {update.metadata.score}
                      </p>
                    </div>
                  )}

                  {update.metadata?.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {update.metadata.location}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{update.updateCount || 0} updates</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(update.startedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Dominica'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveUpdatesWidget;
