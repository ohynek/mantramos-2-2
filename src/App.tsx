/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Youtube, Facebook, Mail, Phone, ChevronRight, X, Menu, ExternalLink, Search, Music } from "lucide-react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Category, Song } from "./types";
import { SONGS } from "./songs";

const CONTACT_LINKS = {
  youtube: "https://www.youtube.com/@my-mantramos",
  facebook: "https://www.facebook.com/mantramos",
  email: "mail@mantramos.com",
  phone: "+420 732 235 683",
  events: "https://www.facebook.com/mantramos/events",
  form: "https://docs.google.com/forms/d/1GgXCKFdr6NNqt_6eCwYzH0s9EAV2zSmMPlBozp1V4Cs/viewform",
};

// --- Components ---

function ScrollToPath() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/zpevnik") {
      const element = document.getElementById("zpevnik");
      if (element) {
        // Delay slightly top ensure DOM is ready if it's a fresh load
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
}

const Stars = () => {
  const [stars, setStars] = useState<{ id: number, top: string, left: string, size: string, delay: string, duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 7 + 7}s`, // Pomalejší, mezi 7 a 14 sekundami
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "HUDBA", href: "#hudba" },
    { label: "UDÁLOSTI", href: "#udalosti" },
    { label: "ZPĚVNÍK", href: "#zpevnik" },
    { label: "KONTAKT", href: "#kontakt" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${
          isScrolled || isMobileMenuOpen ? "bg-brand-bg/80 backdrop-blur-md py-4" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-serif tracking-widest text-brand-accent cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
          >
            MANTRAMOS
          </motion.div>
          
          <div className="hidden md:flex gap-12">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                className="text-xs font-sans tracking-[0.2em] text-brand-text/60 hover:text-brand-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button 
            className="md:hidden text-brand-text/60 hover:text-brand-accent transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-brand-bg flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-8 px-6 w-full">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-serif tracking-widest text-brand-text hover:text-brand-accent transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 w-12 h-[1px] bg-brand-accent/30" 
              />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 mt-4"
              >
                <a href={CONTACT_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-brand-text/40 hover:text-brand-accent transition-colors">
                  <Youtube size={24} />
                </a>
                <a href={CONTACT_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-text/40 hover:text-brand-accent transition-colors">
                  <Facebook size={24} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-16">
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[10px] tracking-[0.4em] text-brand-accent mb-2 uppercase"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-serif text-brand-text"
    >
      {children}
    </motion.h2>
  </div>
);

function MantramosContent() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "Vše">("Vše");

  useEffect(() => {
    if (selectedSong) {
      const viewer = document.getElementById('song-viewer');
      if (viewer && window.innerWidth < 1024) {
        const offset = 80; // Account for navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = viewer.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSong]);

  const handleCloseSong = () => {
    setSelectedSong(null);
    // Use a slightly longer timeout and requestAnimationFrame to ensure the DOM has updated
    setTimeout(() => {
      requestAnimationFrame(() => {
        const searchContainer = document.getElementById('search-container');
        if (searchContainer) {
          const offset = 140; // Plenty of room for the sticky header
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = searchContainer.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
      });
    }, 100);
  };

  const categories: (Category | "Vše")[] = ["Vše", "Mantry", "Tradiční", "Autorské"];

  const filteredSongs = useMemo(() => {
    return SONGS.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            song.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Vše" || song.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.title.localeCompare(b.title, 'cs'));
  }, [searchQuery, activeCategory]);

  // Group songs by first letter for alphabetical navigation
  const groupedSongs = useMemo(() => {
    const groups: { [key: string]: Song[] } = {};
    filteredSongs.forEach(song => {
      const firstLetter = song.title.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(song);
    });
    return groups;
  }, [filteredSongs]);

  const alphabet = useMemo(() => 
    Object.keys(groupedSongs).sort((a, b) => a.localeCompare(b, 'cs')),
    [groupedSongs]
  );

  return (
    <div className="bg-brand-bg text-brand-text selection:bg-brand-accent/30 selection:text-brand-accent min-h-screen relative">
      <Navbar />
      <Stars />

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Artistic Background Layer */}
        <div className="absolute inset-0 z-0 opacity-50">
          <img 
            src="/photos/02-mantramos-tanec.jpg" 
            alt="Mantramos tanec v jurtě"
            className="w-full h-full object-cover grayscale brightness-[0.7]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=2000";
            }}
          />
          {/* Tento gradient zajišťuje postupný přechod do černé, podobně jako na maok.sk */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/60 via-transparent to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-7xl md:text-9xl font-serif tracking-tighter text-brand-text mb-8">
            Mantramos
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-brand-accent max-w-xl mx-auto leading-relaxed opacity-80">
            „Naším záměrem je naslouchat svému nitru a společným harmoniím.“
          </p>
        </motion.div>


      </header>

      <main className="max-w-7xl mx-auto px-6 py-32 space-y-32">
        
        {/* HUDBA & UDÁLOSTI Quick Navigation */}
        <section className="grid md:grid-cols-2 gap-12">
          {/* Link Hudba */}
          <motion.a 
            id="hudba"
            href={CONTACT_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="group relative h-80 overflow-hidden border border-brand-text/10 rounded-sm bg-brand-text/5 flex items-center justify-center text-center p-8"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/photos/01-hy-kytare-mantra.jpg" 
                alt="Hudba"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-brand-bg/60 group-hover:bg-brand-bg/40 transition-colors duration-700" />
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.4em] text-brand-accent mb-4 block">POSLECH</span>
              <h3 className="text-3xl font-serif mb-4">Hudba & Videa</h3>
              <div className="flex items-center justify-center gap-2 text-brand-text/40 group-hover:text-brand-accent transition-colors">
                <span className="text-xs tracking-widest font-sans">OTEVŘÍT YOUTUBE</span>
                <ExternalLink size={14} />
              </div>
            </div>
          </motion.a>

          {/* Link Události */}
          <motion.a 
            id="udalosti"
            href={CONTACT_LINKS.events}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="group relative h-80 overflow-hidden border border-brand-text/10 rounded-sm bg-brand-text/5 flex items-center justify-center text-center p-8"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/photos/05-ohynek-mantramos.jpg" 
                alt="Události"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1528605248644-14dd04cb113d?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-brand-bg/60 group-hover:bg-brand-bg/40 transition-colors duration-700" />
            </div>

            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.4em] text-brand-accent mb-4 block">SPOJENÍ</span>
              <h3 className="text-3xl font-serif mb-4">Události & Setkání</h3>
              <div className="flex items-center justify-center gap-2 text-brand-text/40 group-hover:text-brand-accent transition-colors">
                <span className="text-xs tracking-widest font-sans">FACEBOOK UDÁLOSTI</span>
                <ExternalLink size={14} />
              </div>
            </div>
          </motion.a>
        </section>

        {/* Newsletter / Form CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="py-12 flex flex-col items-center text-center border-y border-brand-text/5 bg-brand-accent/[0.02] !mt-16"
        >
          <a 
            href={CONTACT_LINKS.form}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 overflow-hidden border border-brand-accent/40 rounded-sm hover:border-brand-accent transition-colors transition-duration-500"
          >
            <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-5 transition-opacity" />
            <span className="relative z-10 text-xs tracking-[0.3em] font-sans text-brand-accent group-hover:text-brand-text transition-colors">
              CHCI VĚDĚT O VŠECH AKCÍCH S MANTRAMOS
            </span>
          </a>
        </motion.section>

        {/* ZPĚVNÍK Section */}
        <section id="zpevnik" className="pt-8 pb-24 !mt-0">
          <div className="relative h-[300px] md:h-[400px] mb-24 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <img 
                src="/photos/07-sapito-hynek-bw.jpeg" 
                alt="Zpěvník Background" 
                className="w-full h-full object-cover opacity-60 grayscale"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-brand-bg/60 mix-blend-multiply" />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 text-center"
            >
              <h2 className="text-6xl md:text-8xl font-serif text-brand-text tracking-tight">
                Zpěvník
              </h2>
              <div className="w-24 h-[1px] bg-brand-accent/40 mx-auto mt-8" />
            </motion.div>
          </div>
          
          <div className="px-6 max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
            {/* List Section */}
            <div className="flex flex-col z-10">
              {/* Search bar - Sticky on ALL screens */}
              <div className="sticky top-[58px] md:top-[70px] z-30 bg-brand-bg/95 backdrop-blur-md pt-2 pb-4 border-b border-brand-text/10 px-6 -mx-6">
                <div id="search-container" className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Hledat název písně..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-text/5 border border-brand-text/10 rounded-full pl-12 pr-4 py-2.5 font-serif outline-none focus:border-brand-accent/40 transition-colors text-xs md:text-sm"
                  />
                </div>
              </div>
              
              {/* Categories - Non-sticky to save space */}
              <div className="flex flex-wrap gap-1 md:gap-2 px-2 mt-6 mb-8 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[8px] md:text-[9px] tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all ${
                      activeCategory === cat 
                        ? "bg-brand-accent border-brand-accent text-brand-bg font-bold" 
                        : "border-brand-text/10 text-brand-text/40 hover:border-brand-text/30"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Alphabetical Picker (Mini) - Non-sticky to allow better focus on list */}
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-8 py-3">
                {alphabet.map(letter => (
                  <button 
                    key={letter}
                    onClick={() => {
                      const el = document.getElementById(`letter-${letter}`);
                      if (el) {
                        const offset = 140; 
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        window.scrollTo({
                          top: elementPosition - offset,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="text-[10px] md:text-xs text-brand-accent/30 hover:text-brand-accent transition-colors font-bold p-1"
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-12 pb-12">
                {alphabet.length > 0 ? (
                  alphabet.map((letter) => (
                    <div key={letter} id={`letter-${letter}`} className="scroll-mt-64 space-y-4">
                      <div className="py-2 border-b border-brand-accent/10">
                        <span className="text-2xl font-serif text-brand-accent">{letter}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {groupedSongs[letter].map((song) => (
                          <button
                            key={song.id}
                            onClick={() => setSelectedSong(song)}
                            className="w-full text-left p-3 md:p-6 rounded-sm transition-all duration-300 bg-brand-text/[0.02] border border-brand-text/5 hover:border-brand-accent/30 hover:bg-brand-accent/[0.03] group"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1 pr-4">
                                <p className="font-serif text-lg md:text-xl text-brand-text leading-tight group-hover:text-brand-accent transition-colors">
                                  {song.title}
                                </p>
                                {song.subtitle && (
                                  <p className="text-[10px] md:text-xs italic text-brand-muted mt-1 md:mt-2">{song.subtitle}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 md:gap-4">
                                <span className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[9px] md:text-[10px] rounded-full border shrink-0 ${
                                  song.category === "Mantry" ? "border-brand-accent/20 text-brand-accent/60" :
                                  song.category === "Tradiční" ? "border-blue-500/20 text-blue-500/60" :
                                  "border-green-500/20 text-green-500/60"
                                }`}>
                                  {song.category.substring(0, 1)}
                                </span>
                                <ChevronRight 
                                  size={14} 
                                  className="text-brand-accent md:opacity-0 md:group-hover:opacity-100 md:-translate-x-2 md:group-hover:translate-x-0 transition-all"
                                />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 text-brand-muted/40 font-serif italic">
                    Nenalezeny žádné písně v této kategorii
                  </div>
                )}
              </div>
            </div>

            {/* Fullscreen Content Display Overlay */}
            <AnimatePresence>
              {selectedSong && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-xl overflow-y-auto"
                >
                  <div className="min-h-screen flex flex-col">
                    {/* Header Controls */}
                    <div className="sticky top-0 z-20 bg-brand-bg/90 backdrop-blur-md border-b border-brand-text/5 py-2 md:py-6">
                      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                        <div className="flex items-center gap-3 md:gap-4">
                          <button 
                            onClick={handleCloseSong}
                            className="p-1.5 hover:bg-brand-text/5 rounded-full text-brand-accent transition-colors"
                          >
                            <X size={18} className="md:w-6 md:h-6" />
                          </button>
                          <div>
                            <span className="text-[7px] md:text-[10px] tracking-[0.4em] text-brand-accent uppercase block mb-0.5">{selectedSong.category}</span>
                            <h4 className="text-base md:text-2xl font-serif text-brand-text leading-tight">{selectedSong.title}</h4>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-4">
                          {selectedSong.chords && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-brand-accent/10 rounded-full border border-brand-accent/20">
                              <Music size={14} className="text-brand-accent" />
                              <span className="text-xs font-serif text-brand-accent font-bold tracking-widest uppercase">{selectedSong.chords}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-4 md:py-24 px-6">
                      <div className="max-w-prose mx-auto text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {selectedSong.subtitle && (
                            <p className="text-brand-accent/60 font-serif italic text-[10px] md:text-lg mb-4 md:mb-6">{selectedSong.subtitle}</p>
                          )}
                          
                          {/* Chords for mobile */}
                          {selectedSong.chords && (
                            <div className="md:hidden mb-4 py-1.5 border-y border-brand-accent/10">
                              <span className="text-[7px] tracking-widest text-brand-accent/40 block mb-0.5 uppercase">AKORDY</span>
                              <code className="text-brand-accent font-mono text-sm font-bold">{selectedSong.chords}</code>
                            </div>
                          )}

                          <pre className="text-xs md:text-xl font-serif text-brand-text leading-tight md:leading-relaxed whitespace-pre-wrap italic">
                            {selectedSong.lyrics}
                          </pre>

                          <div className="mt-8 pb-12 flex justify-center">
                            <button 
                              onClick={handleCloseSong}
                              className="flex items-center gap-2 px-6 py-2.5 border border-brand-accent/30 rounded-sm text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-all text-[8px] tracking-[0.4em] font-sans font-bold uppercase"
                            >
                              <X size={12} />
                              ZAVŘÍT
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

        </section>

        {/* KONTAKT Section */}
        <section id="kontakt" className="relative py-24 border-t border-brand-text/10 overflow-hidden">
          {/* Background Image with Radial Fade */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/photos/03-sapito-jam.jpg" 
              alt="Kontakt Background" 
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000";
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#0f0f0f_90%)]" />
          </div>
          
          <div className="relative z-10 px-6 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 min-h-[600px] items-end pb-12">
            <div>
              <SectionHeading>Kontakt</SectionHeading>
              
              <div className="space-y-8 mt-12 mb-1">
                <div className="group flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-accent">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-widest text-brand-text/40 mb-1 uppercase">EMAIL</span>
                    <a href={`mailto:${CONTACT_LINKS.email}`} className="text-xl font-serif hover:text-brand-accent transition-colors">
                      {CONTACT_LINKS.email}
                    </a>
                  </div>
                </div>

                <div className="group flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-accent">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-widest text-brand-text/40 mb-1 uppercase">TELEFON</span>
                    <a href={`tel:${CONTACT_LINKS.phone.replace(/\s/g, '')}`} className="text-xl font-serif hover:text-brand-accent transition-colors">
                      {CONTACT_LINKS.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-12 pb-4">
              <div className="space-y-4">
                <p className="text-brand-text/90 italic font-serif text-lg leading-relaxed max-w-md font-bold">
                  Budeme rádi za zprávy, pozvání na hraní na vaši akci, nebo jakékoliv sdílení dojmů a zkušeností z naší hudby a akcí.
                </p>
              </div>

              <div className="flex gap-8">
                <a 
                  href={CONTACT_LINKS.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-text/60 group-hover:text-brand-accent group-hover:border-brand-accent/40 transition-all duration-500">
                    <Youtube size={24} />
                  </div>
                  <span className="text-[10px] tracking-widest font-sans opacity-40 group-hover:opacity-100 transition-opacity uppercase">Youtube</span>
                </a>
                
                <a 
                  href={CONTACT_LINKS.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-text/60 group-hover:text-brand-accent group-hover:border-brand-accent/40 transition-all duration-500">
                    <Facebook size={24} />
                  </div>
                  <span className="text-[10px] tracking-widest font-sans opacity-40 group-hover:opacity-100 transition-opacity uppercase">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer className="py-12 px-6 border-t border-brand-text/5 text-center">
        <p className="text-[10px] tracking-[0.5em] text-brand-text/20 uppercase">
          &copy; {new Date().getFullYear()} Mantramos. Všechna práva vyhrazena.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToPath />
      <Routes>
        <Route path="/" element={<MantramosContent />} />
        <Route path="/zpevnik" element={<MantramosContent />} />
      </Routes>
    </BrowserRouter>
  );
}
