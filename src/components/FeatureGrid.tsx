import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Users, 
  Database, 
  BarChart3, 
  Layers,
  Shield,
  Sparkles,
  Globe
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Process millions of rows in milliseconds with WebGL acceleration and optimized data structures.",
    color: "accent"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Real-time Collaboration",
    description: "Work together on dashboards with live editing, comments, and synchronized views.",
    color: "primary"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Smart Data Pipeline",
    description: "Connect to any data source with intelligent schema detection and transformation.",
    color: "success"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Interactive Visualizations",
    description: "Create stunning charts with drag-and-drop simplicity and advanced customization.",
    color: "warning"
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Drag & Drop Builder",
    description: "Intuitive canvas interface for building complex dashboards without code.",
    color: "accent"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "SOC2 compliant with row-level security, encryption, and audit logging.",
    color: "primary"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description: "Automatic pattern detection and intelligent recommendations for your data.",
    color: "success"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Cloud Native",
    description: "Scale seamlessly with distributed computing and edge optimization.",
    color: "warning"
  }
];

const FeatureGrid = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="data-accent block">Visualize Data</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade analytics platform with enterprise features, 
            built for teams that demand performance and reliability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="p-6 glass-card border-border/50 hover:border-accent/30 transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className={`
                    p-3 rounded-xl w-fit
                    ${feature.color === 'accent' ? 'bg-gradient-accent text-accent-foreground' : ''}
                    ${feature.color === 'primary' ? 'bg-gradient-primary text-primary-foreground' : ''}
                    ${feature.color === 'success' ? 'bg-success text-success-foreground' : ''}
                    ${feature.color === 'warning' ? 'bg-warning text-warning-foreground' : ''}
                  `}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;