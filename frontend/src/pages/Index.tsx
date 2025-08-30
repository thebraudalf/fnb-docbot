import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DocBot } from "@/components/DocBot";
import { LoginForm } from "@/components/LoginForm";
import { FileManager } from "@/components/FileManager";
import { SOPUpload } from "@/components/SOPUpload";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  ClipboardList,
  Brain,
  BarChart3,
  Users,
  CheckCircle2,
  Settings,
  LogOut,
  FileText,
  FolderOpen,
  Menu,
  X
} from "lucide-react";

const Index = () => {
  const { user, loading, logout } = useAuth();

  // Get user role from preferences or default to crew
  const userRole = ((user?.prefs as any)?.role as "crew" | "manager") || "crew";

  // Role-based default views: Crew starts with DocBot, Manager starts with Dashboard
  const getDefaultView = () => {
    return userRole === 'manager' ? 'dashboard' : 'docbot';
  };

  const [activeView, setActiveView] = useState<'docbot' | 'procedures' | 'training' | 'checklists' | 'dashboard' | 'team' | 'documents' | 'settings' | 'files'>(
    getDefaultView()
  );

  // Update activeView when userRole changes
  useEffect(() => {
    if (userRole === 'manager') {
      setActiveView('dashboard');
    } else {
      setActiveView('docbot');
    }
  }, [userRole]);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when view changes on mobile
  const handleViewChange = (view: any) => {
    setActiveView(view);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Navigation items based on role
  const crewNavItems = [
    { id: 'docbot', label: 'DocBot', icon: MessageSquare },
    { id: 'procedures', label: 'Procedures', icon: ClipboardList },
    { id: 'training', label: 'Training', icon: Brain },
    { id: 'checklists', label: 'Checklists', icon: CheckCircle2 },
    // { id: 'files', label: 'File Manager', icon: FolderOpen },
  ];

  const managerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'team', label: 'Team Progress', icon: Users },
    { id: 'documents', label: 'SOP Documents', icon: FileText },
    // { id: 'files', label: 'File Manager', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'manager' ? managerNavItems : crewNavItems;

  // Mock data for demonstration
  const stats = {
    completedTraining: 85,
    pendingTasks: 3,
    teamMembers: 12,
    averageScore: 92
  };

  const renderContent = () => {
    switch (activeView) {
      case 'docbot':
        return userRole === 'crew' ? <DocBot /> : null;

      case 'procedures':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Procedures</h2>
              <Badge variant="outline">Step-by-Step</Badge>
            </div>
            <div className="grid gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Opening Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Daily opening procedures</p>
                  <Progress value={0} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">0/8 steps completed</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Food Safety Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Temperature checks and hygiene</p>
                  <Progress value={60} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">3/5 steps completed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Training</h2>
              <Badge variant="outline">Microlearning</Badge>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Food Safety Basics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Learn essential food safety principles</p>
                  <Progress value={75} className="w-full mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3/4 modules completed</span>
                    <span>Quiz: 85%</span>
                  </div>
                  <Button className="w-full mt-4">Continue Learning</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'checklists':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Checklists</h2>
              <Badge variant="outline">Daily Tasks</Badge>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="line-through text-muted-foreground">Check refrigerator temperatures</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-muted rounded" />
                    <span>Stock inventory check</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manager Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.completedTraining}%</p>
                      <p className="text-sm text-muted-foreground">Training Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Team Progress</h2>
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">Kitchen Staff</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Quiz Score: 92%</p>
                      <p className="text-xs text-green-600">All tasks complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return <SOPUpload userRole={userRole} userName={user.name} />;

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Export Progress as CSV</Button>
                <Button variant="destructive" className="w-full" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'files':
        return <FileManager />;

      default:
        return userRole === 'manager' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manager Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.completedTraining}%</p>
                      <p className="text-sm text-muted-foreground">Training Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : <DocBot />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Kitchen Coach</h1>
          <Badge variant="secondary" className="text-xs">
            {userRole === 'manager' ? 'Manager' : 'Crew'}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-card border-r flex flex-col transition-transform duration-300 ease-in-out
          ${isMobile ? 'top-16' : ''}
        `}>
          {/* Desktop Sidebar Header */}
          <div className="hidden md:block p-6 border-b">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold">Kitchen Coach</h1>
              <Badge variant="secondary">{userRole === 'manager' ? 'Manager' : 'Crew'}</Badge>
            </div>
          </div>

          {/* Mobile Sidebar Header */}
          <div className="md:hidden p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize">{activeView}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start h-12"
                    onClick={() => handleViewChange(item.id as any)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:block mt-auto">
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userRole === 'manager' ? 'Manager' : 'Crew Member'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="shrink-0">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center pt-2 border-t border-border/50">
                <Badge variant="secondary" className="text-xs">
                  Kitchen Coach v2.1
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Desktop Header */}
          {/* <header className="hidden md:block border-b bg-card p-6 flex-shrink-0">
            <h2 className="text-2xl font-bold capitalize">{activeView}</h2>
          </header> */}


          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-full">
              {renderContent()}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t bg-card flex-shrink-0">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Kitchen Coach</span>
                    <Badge variant="outline" className="text-xs">v2.1</Badge>
                  </div>
                  <span className="hidden md:block">•</span>
                  <span>© 2024 Kitchen Coach. All rights reserved.</span>
                </div>
              </div>

              {/* Mobile-only simplified footer */}
              <div className="md:hidden mt-4 pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()} • {userRole === 'manager' ? 'Manager' : 'Crew'} Dashboard
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;