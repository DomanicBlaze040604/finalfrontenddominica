import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, PlusCircle, Edit, Trash2, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScheduleManager = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    scheduledDate: "",
    scheduledTime: "",
    author: "",
    category: "",
    notes: "",
  });

  // Sample scheduled content - in production, fetch from API
  const [scheduledItems, setScheduledItems] = useState([
    {
      id: 1,
      title: "Weekly Weather Forecast Update",
      type: "article",
      scheduledDate: "2024-11-15",
      scheduledTime: "08:00",
      author: "James Thompson",
      category: "Weather",
      status: "scheduled",
      notes: "Weekly weather roundup for the Caribbean region",
      createdAt: "2024-11-07"
    },
    {
      id: 2,
      title: "Government Budget Announcement Coverage",
      type: "breaking",
      scheduledDate: "2024-11-16",
      scheduledTime: "14:00",
      author: "Maria Rodriguez",
      category: "Politics",
      status: "scheduled",
      notes: "Live coverage of the annual budget presentation",
      createdAt: "2024-11-06"
    },
    {
      id: 3,
      title: "Tourism Board Monthly Report",
      type: "article",
      scheduledDate: "2024-11-18",
      scheduledTime: "10:30",
      author: "Sarah Williams",
      category: "Tourism",
      status: "scheduled",
      notes: "Monthly tourism statistics and visitor numbers",
      createdAt: "2024-11-05"
    },
    {
      id: 4,
      title: "Sports Weekend Roundup",
      type: "article",
      scheduledDate: "2024-11-17",
      scheduledTime: "18:00",
      author: "Sarah Williams",
      category: "Sports",
      status: "scheduled",
      notes: "Weekend sports events and results summary",
      createdAt: "2024-11-04"
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSchedule) {
      // Update existing schedule
      setScheduledItems(prev => prev.map(item => 
        item.id === editingSchedule.id 
          ? { ...item, ...formData }
          : item
      ));
      toast({
        title: "Schedule Updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
    } else {
      // Create new schedule
      const newSchedule = {
        id: Date.now(),
        ...formData,
        status: "scheduled",
        createdAt: new Date().toISOString().split('T')[0],
      };
      setScheduledItems(prev => [...prev, newSchedule]);
      toast({
        title: "Content Scheduled",
        description: `"${formData.title}" has been scheduled successfully.`,
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "article",
      scheduledDate: "",
      scheduledTime: "",
      author: "",
      category: "",
      notes: "",
    });
    setEditingSchedule(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      type: schedule.type,
      scheduledDate: schedule.scheduledDate,
      scheduledTime: schedule.scheduledTime,
      author: schedule.author,
      category: schedule.category,
      notes: schedule.notes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (scheduleId: number) => {
    setScheduledItems(prev => prev.filter(item => item.id !== scheduleId));
    toast({
      title: "Schedule Deleted",
      description: "The scheduled item has been removed.",
      variant: "destructive",
    });
  };

  const getStatusColor = (date: string, time: string) => {
    const scheduledDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (scheduledDateTime < now) {
      return "bg-green-500";
    } else if (scheduledDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return "bg-yellow-500";
    }
    return "bg-blue-500";
  };

  const getStatusText = (date: string, time: string) => {
    const scheduledDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (scheduledDateTime < now) {
      return "Published";
    } else if (scheduledDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return "Due Soon";
    }
    return "Scheduled";
  };

  // Sort by scheduled date/time
  const sortedItems = [...scheduledItems].sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Content Schedule
            </h1>
            <p className="text-muted-foreground">Plan and schedule content publication</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <PlusCircle className="h-4 w-4" />
                Schedule Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? "Edit Scheduled Content" : "Schedule New Content"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Content Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Weekly Weather Update"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="breaking">Breaking News</SelectItem>
                        <SelectItem value="feature">Feature Story</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="e.g., Politics, Sports"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes or instructions"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? "Update Schedule" : "Schedule Content"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scheduled Items */}
        <div className="space-y-4">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => {
              const statusColor = getStatusColor(item.scheduledDate, item.scheduledTime);
              const statusText = getStatusText(item.scheduledDate, item.scheduledTime);
              
              return (
                <Card key={item.id} className="interactive-card hover-lift group transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          {item.type === "breaking" ? (
                            <AlertCircle className="h-6 w-6 text-primary" />
                          ) : (
                            <FileText className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {item.title}
                            </CardTitle>
                            <Badge className={`text-xs text-white ${statusColor}`}>
                              {statusText}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.scheduledDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.scheduledTime}
                            </div>
                            {item.author && (
                              <span>by {item.author}</span>
                            )}
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No content scheduled yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Schedule Your First Content
              </Button>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        {scheduledItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Scheduled</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {scheduledItems.filter(item => {
                    const scheduledDateTime = new Date(`${item.scheduledDate}T${item.scheduledTime}`);
                    return scheduledDateTime > new Date();
                  }).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Due Soon</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {scheduledItems.filter(item => {
                    const scheduledDateTime = new Date(`${item.scheduledDate}T${item.scheduledTime}`);
                    const now = new Date();
                    return scheduledDateTime > now && scheduledDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
                  }).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Published</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {scheduledItems.filter(item => {
                    const scheduledDateTime = new Date(`${item.scheduledDate}T${item.scheduledTime}`);
                    return scheduledDateTime < new Date();
                  }).length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ScheduleManager;