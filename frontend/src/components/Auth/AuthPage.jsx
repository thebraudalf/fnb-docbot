import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ChefHat, Shield, Users } from 'lucide-react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/20 rounded-2xl backdrop-blur-sm">
                <Zap className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">DocBot</h1>
                <p className="text-indigo-200">F&B Operations Assistant</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Streamline Your Food & Beverage Operations
            </h2>
            
            <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
              AI-powered SOP guidance, procedure tracking, and team training - all in one intelligent platform.
            </p>

            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ChefHat className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-indigo-100">Interactive SOP Procedures</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-indigo-100">AI-Powered Q&A Assistant</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-indigo-100">Team Training & Analytics</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/20 rounded-xl backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">DocBot</h1>
              </div>
              <p className="text-indigo-200">Food & Beverage Operations Assistant</p>
            </motion.div>

            {isLogin ? (
              <Login onToggleMode={toggleMode} />
            ) : (
              <Register onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
