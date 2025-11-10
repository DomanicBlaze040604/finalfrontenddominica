import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, settingsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCategoryProps {
  category: any;
  isVisible: boolean;
  onToggle: (id: string) => void;
}

function SortableCategory({ category, isVisible, onToggle }: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${!isVisible ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color || '#000' }}
          />
          <span className="font-medium">{category.name}</span>
          <Badge variant="outline" className="text-xs">
            {category.slug}
          </Badge>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(category.id)}
        className="gap-2"
      >
        {isVisible ? (
          <>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Hidden</span>
          </>
        )}
      </Button>
    </div>
  );
}

export function HomepageSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sectionOrder, setSectionOrder] = useState<'latest-first' | 'featured-first'>('latest-first');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch settings
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => settingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: 'Settings saved!',
        description: 'Homepage settings have been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    },
  });

  // Initialize categories and settings
  useEffect(() => {
    if (categoriesData?.success) {
      const cats = categoriesData.data || [];
      setAllCategories(cats);
      
      // Initialize selected categories from settings or default to first 3
      if (settingsData?.success && settingsData.data?.homepageCategories) {
        setSelectedCategories(settingsData.data.homepageCategories);
      } else {
        setSelectedCategories(cats.slice(0, 3).map((c: any) => c.id));
      }
    }
  }, [categoriesData, settingsData]);

  // Initialize section order
  useEffect(() => {
    if (settingsData?.success && settingsData.data?.homepageSectionOrder) {
      setSectionOrder(settingsData.data.homepageSectionOrder);
    }
  }, [settingsData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedCategories((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSave = () => {
    updateSettingsMutation.mutate({
      homepageSectionOrder: sectionOrder,
      homepageCategories: selectedCategories,
    });
  };

  // Get ordered categories for display
  const orderedCategories = allCategories.sort((a, b) => {
    const aIndex = selectedCategories.indexOf(a.id);
    const bIndex = selectedCategories.indexOf(b.id);
    
    // If both are selected, sort by their position in selectedCategories
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // Selected categories come first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // Unselected categories maintain their original order
    return 0;
  });

  const visibleCategories = orderedCategories.filter((cat) =>
    selectedCategories.includes(cat.id)
  );

  return (
    <div className="space-y-6">
      {/* Section Order */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Section Order</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose which section appears first on the homepage
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Section Order</Label>
            <Select
              value={sectionOrder}
              onValueChange={(value: any) => setSectionOrder(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest-first">
                  Latest News First (Recommended)
                </SelectItem>
                <SelectItem value="featured-first">
                  Featured Story First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Category Sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag to reorder categories. Click the eye icon to show/hide categories on the homepage.
            These sections will appear below Latest News and Featured Story.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="text-2xl font-bold">{selectedCategories.length}</div>
              <div className="text-xs text-muted-foreground">Visible</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold">{allCategories.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                Drag categories to change their order on the homepage
              </div>
            </div>
          </div>

          {/* Visible Categories (Draggable) */}
          {visibleCategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Visible Categories (Drag to Reorder)</Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleCategories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {visibleCategories.map((category) => (
                      <SortableCategory
                        key={category.id}
                        category={category}
                        isVisible={true}
                        onToggle={toggleCategoryVisibility}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Hidden Categories */}
          {orderedCategories.filter((cat) => !selectedCategories.includes(cat.id)).length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Hidden Categories</Label>
              <div className="space-y-2">
                {orderedCategories
                  .filter((cat) => !selectedCategories.includes(cat.id))
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || '#000' }}
                          />
                          <span className="font-medium text-muted-foreground">
                            {category.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryVisibility(category.id)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Show</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <div className="text-blue-600">💡</div>
              <div className="flex-1 text-sm text-blue-900">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Drag categories to change their display order</li>
                  <li>Click the eye icon to show/hide categories</li>
                  <li>Hidden categories won't appear on the homepage</li>
                  <li>Changes take effect immediately after saving</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Homepage Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
