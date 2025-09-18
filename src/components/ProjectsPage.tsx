import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page } from '../App';

interface ProjectsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const projects = [
    {
      title: "Sierra Ecosystem Analysis",
      description: "Research project studying biodiversity patterns in high-altitude environments",
      image: "https://images.unsplash.com/photo-1614934273187-c83f8780fad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYiUyMHNjaWVuY2V8ZW58MXx8fHwxNzU4MTYwMTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Research", "Environmental Science"],
      date: "2024",
      type: "research",
      rotation: 2
    },
    {
      title: "Mountain Trail App",
      description: "iOS app for tracking hiking routes with offline GPS and safety features",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NTgxMzk0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["iOS", "Swift", "GPS"],
      date: "2024",
      type: "project",
      rotation: -1
    },
    {
      title: "Climate Data Visualization",
      description: "Interactive dashboard showing temperature trends in California's mountain regions",
      image: "https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NTgxMTA5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Data Science", "D3.js", "Python"],
      date: "2023",
      type: "project",
      rotation: 1
    },
    {
      title: "Trail Community Platform",
      description: "Web platform connecting hikers with local trail conditions and community insights",
      image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU4MTEyNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["React", "Node.js", "Community"],
      date: "2023",
      type: "project",
      rotation: -2
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">Projects & Research</h1>
          <p className="text-muted-foreground">
            A collection of my work at the intersection of technology and nature
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotate: project.rotation 
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.2 }
              }}
              className="group cursor-pointer"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Bulletin board pin effect */}
                <div 
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full shadow-md"
                  style={{
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                />
                
                <div className="space-y-4">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="group-hover:text-primary transition-colors">{project.title}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
                      <Calendar className="h-3 w-3" />
                      <span>{project.date}</span>
                      <span className="ml-auto capitalize">{project.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            More projects and research papers available upon request
          </p>
        </motion.div>
      </div>
    </div>
  );
}