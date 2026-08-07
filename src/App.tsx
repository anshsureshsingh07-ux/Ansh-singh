/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { TimelineSection } from './components/TimelineSection';
import { FeaturedBooksSection } from './components/FeaturedBooksSection';
import { WritingPhilosophy } from './components/WritingPhilosophy';
import { InterestsSection } from './components/InterestsSection';
import { InspirationMentorSection } from './components/InspirationMentorSection';
import { FriendsSection } from './components/FriendsSection';
import { SkillsSection } from './components/SkillsSection';
import { GallerySection } from './components/GallerySection';
import { CurrentProjectsSection } from './components/CurrentProjectsSection';
import { ReaderHubSection } from './components/ReaderHubSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PhotoProvider } from './context/PhotoContext';
import { PhotoEditModal } from './components/PhotoEditModal';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Web Audio Synth for Ambient Soundscape
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gainNodeRef.current = gain;

        // Ambient dark fantasy drone pad oscillator
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
        oscRef.current = osc;

        // Subtle LFO for breathing swell
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.008, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
      } catch (e) {
        console.warn('Web Audio API initialized on user interaction.');
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  useEffect(() => {
    const handleOpenAdmin = () => setIsAdminOpen(true);
    window.addEventListener('open-admin-portal', handleOpenAdmin);
    return () => window.removeEventListener('open-admin-portal', handleOpenAdmin);
  }, []);

  return (
    <PhotoProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
        {/* Three.js / Canvas Interactive Animated Starfield & Particles */}
        <StarfieldCanvas />

        {/* Header Navigation with Scroll Progress */}
        <Navbar
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="relative z-10 space-y-12 sm:space-y-20">
          <HeroSection />
          <AboutSection />
          <TimelineSection />
          <FeaturedBooksSection />
          <WritingPhilosophy />
          <InterestsSection />
          <InspirationMentorSection />
          <FriendsSection />
          <SkillsSection />
          <GallerySection />
          <CurrentProjectsSection />
          <ReaderHubSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Photo Edit Modal for Editing Any Image on Site */}
        <PhotoEditModal />

        {/* Supabase & Admin Control Portal */}
        <AdminPortalModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    </PhotoProvider>
  );
}
