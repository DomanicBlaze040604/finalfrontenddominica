import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Eye, TrendingUp, Globe, Clock, MousePointer, Smartphone } from "lucide-react";

const Analytics = () => {
  // Sample analytics data - in production, fetch from API
  const stats = {
    totalViews: 125430,
    uniqueVisitors: 45230,
    pageViews: 89340,
    bounceRate: 32.5,
    avgSessionDuration: "3:24",
    topPages: [
      { page: "/", views: 15420, title: "Homepage" },
      { page: "/category/politics", views: 8930, title: "Politics" },
      { page: "/category/weather", views: 7650, title: "Weather" },
      { page: "/article/breaking-news-update", views: 6540, title: "Breaking News Update" },
      { page: "/category/sports", views: 5430, title: "Sports" }
    ],
    topArticles: [
      { title: "Hurricane Season Update for Caribbean", views: 12450, date: "2024-11-05" },
      { title: "Government Announces New Tourism Initiative", views: 9870, date: "2024-11-04" },
      { title: "Local Sports Team Wins Championship", views: 8760, date: "2024-11-03" },
      { title: "Economic Growth Report Released", views: 7650, date: "2024-11-02" },
      { title: "Cultural Festival Draws Record Crowds", views: 6540, date: "2024-11-01" }
    ],
    trafficSources: [
      { source: "Direct", visitors: 18500, percentage: 41 },
      { source: "Google Search", visitors: 12300, percentage: 27 },
      { source: "Social Media", visitors: 8900, percentage: 20 },
      { source: "Referrals", visitors: 3200, percentage: 7 },
      { source: "Email", visitors: 2330, percentage: 5 }
    ],
    deviceStats: [
      { device: "Mobile", users: 25600, percentage: 57 },
      { device: "Desktop", users: 16200, percentage: 36 },
      { device: "Tablet", users: 3430, percentage: 7 }
    ]
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">Website traffic and performance insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.uniqueVisitors)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.pageViews)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.7%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{page.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">{page.page}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatNumber(page.views)} views
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Articles
              </CardTitle>
              <CardDescription>Most popular articles this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topArticles.map((article, index) => (
                  <div key={article.title} className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{article.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(article.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {formatNumber(article.views)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(source.visitors)}
                      </span>
                      <Badge variant="outline">
                        {source.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Breakdown
              </CardTitle>
              <CardDescription>Visitor device preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(device.users)}
                      </span>
                      <Badge variant="outline">
                        {device.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                  <p className="text-2xl font-bold">{stats.bounceRate}%</p>
                </div>
                <div className="text-green-600 text-sm">
                  -2.3% from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pages per Session</p>
                  <p className="text-2xl font-bold">2.8</p>
                </div>
                <div className="text-green-600 text-sm">
                  +0.4 from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New vs Returning</p>
                  <p className="text-2xl font-bold">65% / 35%</p>
                </div>
                <div className="text-blue-600 text-sm">
                  Healthy mix
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note about real analytics */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Connect Real Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is sample data. Connect Google Analytics or other analytics services in Site Settings to view real data.
            </p>
            <Badge variant="outline">Demo Data</Badge>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;