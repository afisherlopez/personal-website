import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Briefcase, Mail, Instagram, Linkedin, Github, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page } from '../App';
import backgroundImage from '../images/mt-whitney-background.JPG';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

interface FactPopup {
  image: string;
  caption: string;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [selectedFact, setSelectedFact] = useState<FactPopup | null>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navigationItems = [
    {
      id: 'projects',
      icon: Briefcase,
      label: 'Projects & Research'
    },
    {
      id: 'funfacts',
      icon: BookOpen,
      label: 'Fun Facts'
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'Contact Info'
    }
  ];

  const allNavigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects & Research' },
    { id: 'funfacts', label: 'Fun Facts' },
    { id: 'contact', label: 'Contact Info' }
  ];

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navBarHeight = 80; // Approximate height of nav bar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navBarHeight - 40; // Extra 40px padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past hero section
      const heroHeight = window.innerHeight;
      setShowStickyNav(window.scrollY > heroHeight * 0.8);

      // Determine active section
      const scrollPosition = window.scrollY + 200;
      
      if (scrollPosition < heroHeight) {
        setActiveSection('home');
      } else {
        const sections = ['projects', 'funfacts', 'contact'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const facts = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      linkWord: "ipsum",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      linkWord: "tempor",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      linkWord: "veniam",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
      linkWord: "dolor",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      linkWord: "cupidatat",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    }
  ];

  const projects = [
    {
      title: "Lorem Ipsum Project",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
      image: backgroundImage,
      tags: ["Research", "Environmental Science"],
      date: "2024",
      type: "research"
    },
    {
      title: "Dolor Sit Analysis",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      image: backgroundImage,
      tags: ["iOS", "Swift", "GPS"],
      date: "2024",
      type: "project"
    },
    {
      title: "Consectetur Initiative",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
      image: backgroundImage,
      tags: ["Data Science", "D3.js", "Python"],
      date: "2023",
      type: "project"
    },
    {
      title: "Adipiscing Platform",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
      image: backgroundImage,
      tags: ["React", "Node.js", "Community"],
      date: "2023",
      type: "project"
    }
  ];

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

  const renderFactText = (fact: typeof facts[0]) => {
    const parts = fact.text.split(fact.linkWord);
    return (
      <>
        {parts[0]}
        <button
          onClick={() => setSelectedFact(fact.popup)}
          className="text-primary underline hover:text-primary/80 transition-colors cursor-pointer"
          style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}
        >
          {fact.linkWord}
        </button>
        {parts[1]}
      </>
    );
  };

  return (
    <div style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
      {/* Sticky Navigation Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: showStickyNav ? 0 : -100, 
          opacity: showStickyNav ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          zIndex: 50,
          pointerEvents: showStickyNav ? 'auto' : 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderBottom: '1px solid rgba(139, 125, 118, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '13px 0'
        }}
      >
        <div style={{ 
          width: '66.666%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {allNavigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-lg font-medium transition-all duration-300 hover:scale-110 cursor-pointer px-4"
              style={{ 
                fontFamily: '"Faculty Glyphic", sans-serif',
                color: activeSection === item.id ? '#000000' : 'rgba(255, 255, 255, 0.85)',
                textShadow: activeSection === item.id 
                  ? '1px 1px 2px rgba(0, 0, 0, 0.2)' 
                  : '1px 1px 3px rgba(0, 0, 0, 0.4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Hero Section */}
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h1 className="mb-6" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#000000', 
              fontFamily: '"Faculty Glyphic", sans-serif',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Anna Fisher Lopez
            </h1>
            <p className="mb-12 text-lg" style={{ 
              color: '#000000', 
              fontFamily: '"Faculty Glyphic", sans-serif',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
            Pursuing AI-driven climate solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div
              className="flex justify-between items-center py-5 px-16 border border-border/50 backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}
        >
          {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-lg font-medium transition-all duration-300 hover:scale-110 cursor-pointer px-6"
                  style={{ 
                    fontFamily: '"Faculty Glyphic", sans-serif',
                    color: '#000000',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-8" style={{ 
              fontFamily: '"Faculty Glyphic", sans-serif', 
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#000000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}>Projects & Research</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div 
                  className="rounded-xl border border-border/50 p-6 h-full relative overflow-hidden"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' }}
                >
                  <div className="space-y-4">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="group-hover:text-primary transition-colors" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>{project.title}</h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
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
        </div>
      </div>

      {/* Fun Facts Section */}
      <div id="funfacts" className="min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-8" style={{ 
              fontFamily: '"Faculty Glyphic", sans-serif', 
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#000000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}>Fun Facts</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 p-8"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' }}
          >
            <ul className="space-y-6">
              {facts.map((fact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="text-primary mt-2" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>•</span>
                  <p className="text-lg leading-relaxed" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
                    {renderFactText(fact)}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-8" style={{ 
              fontFamily: '"Faculty Glyphic", sans-serif', 
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#000000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}>Contact Info</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border/50 p-8"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' }}
          >
            <div className="space-y-6">
              {contactMethods.map((contact, index) => (
                <motion.div
                  key={contact.platform}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-all duration-300 group"
                  >
                    <contact.icon className={`h-6 w-6 text-muted-foreground transition-colors ${contact.color} group-hover:scale-110`} />
                    <div className="flex-1">
                      <h3 className="group-hover:text-primary transition-colors" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>{contact.platform}</h3>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>{contact.handle}</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                  </a>
            </motion.div>
          ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
              Always happy to chat about mountains, technology, or anything in between
            </p>
        </motion.div>
        </div>
      </div>

      {/* Dialog for Fun Facts */}
      <Dialog open={!!selectedFact} onOpenChange={() => setSelectedFact(null)}>
        <DialogContent className="max-w-md">
          {selectedFact && (
            <div className="space-y-4">
              <ImageWithFallback
                src={selectedFact.image}
                alt="Fun fact illustration"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-center text-muted-foreground" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
                {selectedFact.caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}