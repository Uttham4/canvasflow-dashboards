import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import heroAnalytics from "@/assets/hero-analytics.jpg";

const HeroSection = () => {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-card rounded-full border border-border/50"
          >
            <Sparkles className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm">Powered by WebGL & AI Analytics</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold leading-tight"
          >
            Transform
            <span className="data-accent block">Your Data</span>
            Into Insights
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-xl"
          >
            Build stunning, interactive dashboards with drag-and-drop simplicity. 
            Handle millions of rows with lightning-fast performance and collaborate 
            in real-time with your team.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              variant="hero" 
              size="xl" 
              className="group"
              onClick={() => window.location.hash = '#dashboard'}
            >
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
          >
            <div>
              <div className="text-2xl font-bold data-accent">10M+</div>
              <div className="text-sm text-muted-foreground">Rows Processed</div>
            </div>
            <div>
              <div className="text-2xl font-bold data-accent">500ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold data-accent">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative glass-card rounded-2xl overflow-hidden">
            <img 
              src={heroAnalytics} 
              alt="Analytics Dashboard Preview"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-accent rounded-full opacity-20 blur-xl"
          ></motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-primary rounded-full opacity-15 blur-2xl"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;