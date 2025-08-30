import { CheckCircle, Zap, LogOut, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Header({ offline }) {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Mock user for development mode
  const displayUser = user || { name: 'Demo User' };

  return (
    <header className="bg-white border-b py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-amber-500" />
          <h1 className="text-lg font-semibold">DocBot — F&B Training</h1>
          <span className="text-sm text-muted-foreground ml-3">Internal PWA • SOP-grounded Q&A</span>
        </div>
        <div className="flex items-center gap-4">
          {offline ? (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded">
              <AlertCircle className="h-4 w-4" /> Offline mode
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded">
              <CheckCircle className="h-4 w-4" /> Online
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Welcome, {displayUser?.name}</span>
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

  export default Header;