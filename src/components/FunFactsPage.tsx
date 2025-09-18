import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

interface FactPopup {
  image: string;
  caption: string;
}

export default function FunFactsPage({ onNavigate }: HomePageProps) {
  const [selectedFact, setSelectedFact] = useState<FactPopup | null>(null);

  const facts = [
    {
      text: "I've hiked over 50 mountains in the Sierra Nevada range.",
      linkWord: "mountains",
      popup: {
        image: "https://images.unsplash.com/photo-1635159804596-06b79defff8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjByZWFkaW5nfGVufDF8fHx8MTc1ODE2MDA1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        caption: "One of my favorite summit views from Mount Whitney"
      }
    },
    {
      text: "I can solve a Rubik's cube in under 2 minutes.",
      linkWord: "Rubik's cube",
      popup: {
        image: "https://images.unsplash.com/photo-1650719214211-659245a3ff41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjByZWFkaW5nfGVufDF8fHx8MTc1ODE2MDA1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        caption: "My fastest time was 1:47 during a coffee shop competition"
      }
    },
    {
      text: "I've watched every sunset from the same beach for an entire summer.",
      linkWord: "sunset",
      popup: {
        image: "https://images.unsplash.com/photo-1689731684118-30dc352fcb18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMHdhdmVzfGVufDF8fHx8MTc1ODE2MDA1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        caption: "Day 47 of 90 consecutive sunsets at Malibu Beach"
      }
    },
    {
      text: "I collect vintage postcards from national parks and have over 200.",
      linkWord: "postcards",
      popup: {
        image: "https://images.unsplash.com/photo-1723479746540-fd0fc7844cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBwbGFudHMlMjBjYWN0dXN8ZW58MXx8fHwxNzU4MTYwMDY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        caption: "My oldest postcard from Joshua Tree National Park, circa 1962"
      }
    },
    {
      text: "I once spent 3 weeks living in a van while road-tripping through 12 states.",
      linkWord: "van",
      popup: {
        image: "https://images.unsplash.com/photo-1635159804596-06b79defff8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjByZWFkaW5nfGVufDF8fHx8MTc1ODE2MDA1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        caption: "My trusty van 'Sierra' parked at Glacier National Park"
      }
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
        >
          {fact.linkWord}
        </button>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
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
          <h1 className="mb-4">Fun Facts About Me</h1>
          <p className="text-muted-foreground">
            Click on the highlighted words to learn more!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 p-8"
        >
          <ul className="space-y-6">
            {facts.map((fact, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary mt-2">•</span>
                <p className="text-lg leading-relaxed">
                  {renderFactText(fact)}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <Dialog open={!!selectedFact} onOpenChange={() => setSelectedFact(null)}>
        <DialogContent className="max-w-md">
          {selectedFact && (
            <div className="space-y-4">
              <ImageWithFallback
                src={selectedFact.image}
                alt="Fun fact illustration"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-center text-muted-foreground">
                {selectedFact.caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}