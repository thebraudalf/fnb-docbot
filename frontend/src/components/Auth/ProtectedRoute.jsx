import { useAuth } from '../../context/AuthContext';
import AuthPage from './AuthPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Development mode bypass - remove this in production
  const isDevelopment = import.meta.env.DEV;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // In development, allow bypass with a demo user
  // if (isDevelopment && !isAuthenticated) {
  //   // Show a development banner and allow access
  //   return (
  //     <div>
  //       <div className="bg-yellow-500 text-black p-2 text-center text-sm font-medium">
  //         🚧 Development Mode - Authentication bypassed
  //       </div>
  //       {children}
  //     </div>
  //   );
  // }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return children;
};

export default ProtectedRoute;
