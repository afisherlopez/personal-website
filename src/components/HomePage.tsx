import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Briefcase, Mail } from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const navigationItems = [
    {
      page: 'funfacts' as Page,
      icon: BookOpen,
      label: 'Fun Facts',
      description: 'Get to know me'
    },
    {
      page: 'projects' as Page,
      icon: Briefcase,
      label: 'Projects & Research',
      description: 'My work & studies'
    },
    {
      page: 'contact' as Page,
      icon: Mail,
      label: 'Contact Info',
      description: 'Let\'s connect'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="mb-6">Your Name Here</h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Designer, researcher, and mountain enthusiast
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Button
                variant="ghost"
                onClick={() => onNavigate(item.page)}
                className="w-full h-auto p-8 flex flex-col items-center gap-4 bg-card/70 hover:bg-card/90 border border-border/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <item.icon className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                <div className="text-center">
                  <h3 className="mb-2">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}