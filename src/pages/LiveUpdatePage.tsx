import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { liveUpdatesApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Eye } from 'lucide-react';
import { SafeComponent } from '@/components/SafeComponent';

const LiveUpdatePage = () => {
  const { id } = useParams();
  
  const { data } = useQuery({
    queryKey: ['liveUpdate', id],
    queryFn: () => liveUpdatesApi.getById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const liveUpdate = query.state.data?.data;
      if (liveUpdate?.autoRefresh && liveUpdate?.status === 'active') {
        return (liveUpdate.refreshInterval || 30) * 1000;
      }
      return false;
    },
  });

  const liveUpdate = data?.success ? data.data : null;

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

  if (!liveUpdate) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SafeComponent componentName="Header">
          <Header />
        </SafeComponent>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading live update...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SafeComponent componentName="Header">
        <Header />
      </SafeComponent>
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border-l-4 border-l-red-600 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
              <Badge className="bg-red-600 text-white animate-pulse text-xs md:text-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE
              </Badge>
              <Badge className={`${getTypeColor(liveUpdate.type)} text-white text-xs md:text-sm`}>
                {getTypeIcon(liveUpdate.type)} {liveUpdate.type.toUpperCase()}
              </Badge>
              {liveUpdate.status !== 'active' && (
                <Badge variant="outline" className="text-xs md:text-sm">
                  {liveUpdate.status.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{liveUpdate.title}</h1>
            
            {liveUpdate.metadata?.score && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
                <p className="text-xl md:text-2xl font-bold text-center text-gray-800">
                  {liveUpdate.metadata.score}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {liveUpdate.metadata?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {liveUpdate.metadata.location}
                </div>
              )}
              {liveUpdate.metadata?.temperature && (
                <div className="flex items-center gap-1">
                  🌡️ {liveUpdate.metadata.temperature}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {liveUpdate.viewCount || 0} views
              </div>
            </div>
          </div>

          {/* Initial Content */}
          {liveUpdate.content && (
            <div className="bg-white rounded-lg p-4 md:p-6 mb-6 shadow-sm">
              <p className="text-base md:text-lg leading-relaxed">{liveUpdate.content}</p>
            </div>
          )}

          {/* Updates Timeline */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded" />
              Live Updates ({liveUpdate.updates?.length || 0})
            </h2>
            
            {!liveUpdate.updates || liveUpdate.updates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No updates yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveUpdate.updates.slice().reverse().map((update, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-l-blue-600 pl-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      {new Date(update.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Dominica'
                      })}
                    </div>
                    
                    <div 
                      className="text-base mb-2 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: update.content }}
                    />
                    
                    {update.attachments && update.attachments.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {update.attachments.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt="Update attachment"
                            className="rounded w-full h-auto"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <User className="h-3 w-3" />
                      {update.author.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-refresh indicator */}
          {liveUpdate.autoRefresh && liveUpdate.status === 'active' && (
            <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm shadow-lg animate-fade-in">
              🔄 Auto-refreshing every {liveUpdate.refreshInterval}s
            </div>
          )}
        </div>
      </main>

      <SafeComponent componentName="Footer">
        <Footer />
      </SafeComponent>
    </div>
  );
};

export default LiveUpdatePage;
