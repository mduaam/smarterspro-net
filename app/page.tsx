import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Steps } from '@/components/Steps';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { Compatibility } from '@/components/Compatibility';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* Navigation Header */}
      <Header />

      {/* Hero Header */}
      <Hero />

      {/* Stats trust indicators */}
      <Stats />

      {/* Step by Step Manual Checkout Flow */}
      <Steps />

      {/* Highlights & Features Grid */}
      <Features />

      {/* Premium plans cards */}
      <Pricing />

      {/* Support compatibilities grid */}
      <Compatibility />

      {/* FAQ accordion module */}
      <FAQ />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
