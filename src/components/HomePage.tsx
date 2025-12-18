import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Briefcase, Mail, Linkedin, Github, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page } from '../App';
import backgroundImage from '../images/mt-whitney-background.JPG';
import mysteriesYes from '../images/mysteries-yes.png';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

interface FactPopup {
  image: string;
  caption: string;
}

interface ProjectDetails {
  title: string;
  description: string;
  image: string;
  tags: string[];
  date: string;
  type: string;
  fullDescription: string;
  linkWords?: string[];
  links?: string[];
  objectives: string[];
  outcomes: string[];
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [selectedFact, setSelectedFact] = useState<FactPopup | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
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
      label: 'About Me'
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
    { id: 'funfacts', label: 'About Me' },
    { id: 'contact', label: 'Contact Info' }
  ];

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navBarHeight = 60; // Height of nav bar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navBarHeight - 20; // Small 20px padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
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

  // Manage body overflow when project modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  //Content for About Me Section
  const facts = [
    {
      text: "At Stanford, I studied Physics (B.S. '25) and Computer Science (M.S. '26), focusing on climate impact and renewable energy!",
      linkWord: "renewable energy",
      popup: {
        image: "../images/mysteries-yes.png",
        caption: "Working with Acterra to guide electric home tours in Menlo Park"
      }
    },
    {
      text: "At Stanford, I was a co-captain of the ultimate frisbee team, led trips to Yosemite, Point Reyes, and Tahoe with the Outdoor Center, and worked at a student-run cafe called On Call.",
      linkWord: "Call",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "Originally from Takoma Park, Maryland, the West captured my heart and I plan to live in SF or Seattle for the foreseeable future.",
      linkWord: "SF",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "My favorite poem is 'Mysteries, Yes' by Mary Oliver.",
      linkWord: "Mysteries, Yes",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    },
    {
      text: "When I was 19 I competed in the Junior World Ultimate Championships in Poland! We won!",
      linkWord: "We won!",
      popup: {
        image: backgroundImage,
        caption: "Placeholder caption text"
      }
    }, 
    {
      text: "The background image to this website is of sunrise on Mt. Whitney when I attempted (unsuccessfully) to summit in Nov. 2023.",
      linkWord: "Mt. Whitney",
      popup: {
        image: backgroundImage,
        caption: "The upside of not summiting was that I got to see one of the most beautiful sunrises of my life!"
      }
    }
  ];

  const projects: ProjectDetails[] = [
    {
      title: "Climate Modeling & Gravity Waves",
      description: "Improving climate models by better parameterizing gravity waves using ERA5 data and Attention U-Net models.",
      image: backgroundImage,
      tags: ["Climate Modeling", "ML"],
      date: "2024",
      type: "research",
      fullDescription: "I worked in Aditi Sheshadri's lab in collaboration with an international project called DataWave to train an Attention U-Net model to predict gravity waves in three dimensions instead of one, as is customary for current climate models.",
      linkWords: ["DataWave"],
      links: ["https://datawaveproject.github.io"],
      objectives: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Sed do eiusmod tempor incididunt ut labore et dolore",
        "Ut enim ad minim veniam, quis nostrud exercitation"
      ],
      outcomes: [
        "Duis aute irure dolor in reprehenderit in voluptate",
        "Excepteur sint occaecat cupidatat non proident",
        "Sunt in culpa qui officia deserunt mollit anim"
      ]
    },
    {
      title: "Dolor Sit Analysis",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      image: backgroundImage,
      tags: ["iOS", "Swift", "GPS"],
      date: "2024",
      type: "project",
      fullDescription: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      objectives: [
        "Quis nostrud exercitation ullamco laboris nisi",
        "Ut aliquip ex ea commodo consequat duis aute",
        "Irure dolor in reprehenderit in voluptate velit"
      ],
      outcomes: [
        "Esse cillum dolore eu fugiat nulla pariatur",
        "Excepteur sint occaecat cupidatat non proident",
        "Sunt in culpa qui officia deserunt mollit"
      ]
    },
    {
      title: "Consectetur Initiative",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
      image: backgroundImage,
      tags: ["Data Science", "D3.js", "Python"],
      date: "2023",
      type: "project",
      fullDescription: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
      objectives: [
        "Reprehenderit in voluptate velit esse cillum",
        "Dolore eu fugiat nulla pariatur excepteur sint",
        "Occaecat cupidatat non proident sunt in culpa"
      ],
      outcomes: [
        "Qui officia deserunt mollit anim id est laborum",
        "Sed ut perspiciatis unde omnis iste natus error",
        "Sit voluptatem accusantium doloremque laudantium"
      ]
    },
    {
      title: "Adipiscing Platform",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
      image: backgroundImage,
      tags: ["React", "Node.js", "Community"],
      date: "2023",
      type: "project",
      fullDescription: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
      objectives: [
        "Cupidatat non proident sunt in culpa qui officia",
        "Deserunt mollit anim id est laborum sed ut",
        "Perspiciatis unde omnis iste natus error sit"
      ],
      outcomes: [
        "Voluptatem accusantium doloremque laudantium totam",
        "Rem aperiam eaque ipsa quae ab illo inventore",
        "Veritatis et quasi architecto beatae vitae dicta"
      ]
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

  const renderProjectDescription = (project: ProjectDetails) => {
    if (!project.linkWords || !project.links || project.linkWords.length === 0) {
      return project.fullDescription;
    }

    let text = project.fullDescription;
    const elements: React.ReactNode[] = [];
    
    // Process each linkWord
    project.linkWords.forEach((linkWord, index) => {
      const parts = text.split(linkWord);
      if (parts.length > 1) {
        elements.push(parts[0]);
        elements.push(
          <a
            key={`link-${index}`}
            href={project.links![index]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: '#2563eb', 
              textDecoration: 'underline', 
              fontFamily: '"Faculty Glyphic", sans-serif' 
            }}
          >
            {linkWord}
          </a>
        );
        text = parts.slice(1).join(linkWord);
      }
    });
    
    // Add remaining text
    elements.push(text);
    
    return <>{elements}</>;
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
                color: activeSection === item.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                textShadow: activeSection === item.id 
                  ? '2px 2px 6px rgba(0, 0, 0, 0.8)' 
                  : '1px 1px 4px rgba(0, 0, 0, 0.6)',
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
              color: '#FFFFFF', 
              fontFamily: '"Faculty Glyphic", sans-serif',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
            }}>
              Anna Fisher Lopez
            </h1>
            <p className="mb-12 text-lg" style={{ 
              color: '#FFFFFF', 
              fontFamily: '"Faculty Glyphic", sans-serif',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
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
              className="hero-nav-bar flex justify-between items-center py-5 px-16 backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                    color: '#FFFFFF',
                    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
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
      <div id="projects" className="px-6 pt-16 pb-20">
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
              color: '#FFFFFF',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' 
            }}>Projects & Research</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" style={{ marginBottom: '12rem' }}>
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
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

      {/* About Me Section */}
      <div id="funfacts" className="px-6 pt-16 pb-20">
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
              color: '#FFFFFF',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' 
            }}>About Me</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 p-8"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', marginBottom: '12rem' }}
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
      <div id="contact" className="px-6 pt-16 pb-32">
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
              color: '#FFFFFF',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' 
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

      {/* Dialog for About Me */}
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

      {/* Custom Project Details Overlay */}
      {selectedProject && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              maxWidth: '80%',
              width: '80%',
              height: '80%',
              padding: '2rem',
              position: 'relative',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
              {/* Image at top */}
              <div style={{ marginBottom: '2rem' }}>
                <ImageWithFallback
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Title and metadata */}
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                fontFamily: '"Faculty Glyphic", sans-serif'
              }}>
                {selectedProject.title}
              </h1>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar className="h-3 w-3" />
                  {selectedProject.date}
                </span>
                <span style={{ textTransform: 'capitalize' }}>{selectedProject.type}</span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {selectedProject.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontFamily: '"Faculty Glyphic", sans-serif'
                }}>
                  Overview
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  lineHeight: '1.625',
                  fontFamily: '"Faculty Glyphic", sans-serif'
                }}>
                  {renderProjectDescription(selectedProject)}
                </p>
              </div>

              {/* Objectives */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontFamily: '"Faculty Glyphic", sans-serif'
                }}>
                  Objectives
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedProject.objectives.map((objective, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>•</span>
                      <span style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontFamily: '"Faculty Glyphic", sans-serif'
                }}>
                  Outcomes
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedProject.outcomes.map((outcome, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>•</span>
                      <span style={{ fontFamily: '"Faculty Glyphic", sans-serif' }}>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}