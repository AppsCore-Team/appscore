import React from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { MarketReality } from './sections/MarketReality';
import { CaseStudies } from './sections/CaseStudies';
import { Process } from './sections/Process';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <div className="bg-[#07090D] text-slate-200 font-sans antialiased relative min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      <main className="w-full pt-20">
        <Hero />
        <MarketReality />
        <CaseStudies />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}