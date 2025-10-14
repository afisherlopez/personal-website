import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Instagram, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const contactMethods = [
    {
      platform: 'LinkedIn',
      handle: '/in/annafisherlopez',
      url: 'https://linkedin.com/in/annafisherlopez',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      platform: 'GitHub',
      handle: '@afisherlopez',
      url: 'https://github.com/afisherlopez',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-gray-100'
    },
    {
      platform: 'Email',
      handle: 'annafisherlopez@gmail.com',
      url: 'mailto:annafisherlopez@gmail.com',
      icon: Mail,
      color: 'hover:text-primary'
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="mb-4">Let's Connect</h1>
          <p className="text-muted-foreground">
            Feel free to reach out through any of these platforms
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 p-8"
        >
          <div className="space-y-6">
            {contactMethods.map((contact, index) => (
              <motion.div
                key={contact.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <a
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-all duration-300 group"
                >
                  <contact.icon className={`h-6 w-6 text-muted-foreground transition-colors ${contact.color} group-hover:scale-110`} />
                  <div className="flex-1">
                    <h3 className="group-hover:text-primary transition-colors">{contact.platform}</h3>
                    <p className="text-sm text-muted-foreground">{contact.handle}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Always happy to chat about mountains, technology, or anything in between
          </p>
        </motion.div>
      </div>
    </div>
  );
}