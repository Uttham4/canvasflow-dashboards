import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Database, 
  Users, 
  Settings, 
  Plus,
  Search,
  Bell,
  User
} from "lucide-react";

const Navigation = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-card backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold data-accent">CanvasFlow</span>
          </motion.div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboards
            </Button>
            <Button variant="ghost" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Data Sources
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => window.location.hash = '#dashboard'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Dashboard
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;