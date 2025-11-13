import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  FileEdit,
  AlertCircle,
  Share2,
  Settings,
  BarChart3,
  Image,
  Tag,
  Calendar,
  Trash2,
  Radio,
  UserCog,
} from "lucide-react";
import { authService } from "@/lib/api/auth";

// Define menu items with role restrictions
const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true, roles: ['admin', 'editor', 'user'] },
  { title: "Articles", url: "/admin/articles", icon: FileText, roles: ['admin', 'editor'] },
  { title: "Categories", url: "/admin/categories", icon: Layers, roles: ['admin', 'editor'] },
  { title: "Authors", url: "/admin/authors", icon: UserCog, roles: ['admin'] }, // Admin only
];

const contentItems = [
  { title: "Pages", url: "/admin/pages", icon: FileEdit, roles: ['admin'] }, // Admin only
  { title: "Breaking News", url: "/admin/breaking-news", icon: AlertCircle, roles: ['admin', 'editor'] },
  { title: "Live Updates", url: "/admin/live-updates", icon: Radio, roles: ['admin', 'editor'] },
  { title: "Tags", url: "/admin/tags", icon: Tag, roles: ['admin', 'editor'] },
];

const settingsItems = [
  { title: "User Management", url: "/admin/users", icon: Users, roles: ['admin'] }, // Admin only
  { title: "Social Media", url: "/admin/social-media", icon: Share2, roles: ['admin'] }, // Admin only
  { title: "Site Settings", url: "/admin/settings", icon: Settings, roles: ['admin'] }, // Admin only
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, roles: ['admin'] }, // Admin only
  { title: "Schedule", url: "/admin/schedule", icon: Calendar, roles: ['admin', 'editor'] },
  { title: "Recycle Bin", url: "/admin/recycle-bin", icon: Trash2, roles: ['admin', 'editor'] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const userRole = authService.getUserRole() || 'user';
  
  // Filter menu items based on user role
  const filterByRole = (items: typeof mainItems) => {
    return items.filter(item => item.roles.includes(userRole));
  };

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const MenuSection = ({ 
    items, 
    label 
  }: { 
    items: typeof mainItems; 
    label: string;
  }) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.exact);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  <NavLink
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          {!collapsed ? (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Admin</h2>
              <p className="text-xs text-muted-foreground">Dominica News</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DN</span>
            </div>
          )}
        </div>

        <MenuSection items={filterByRole(mainItems)} label="Main" />
        <MenuSection items={filterByRole(contentItems)} label="Content" />
        <MenuSection items={filterByRole(settingsItems)} label="Settings" />
      </SidebarContent>
    </Sidebar>
  );
}
