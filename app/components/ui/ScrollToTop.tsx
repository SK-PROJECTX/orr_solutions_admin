'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    // Target common dashboard scroll containers
    const dashboardMain = document.querySelector('main');
    if (dashboardMain) {
      dashboardMain.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      // Check window scroll
      const winScroll = window.scrollY > 400;
      
      // Check dashboard main scroll
      const dashboardMain = document.querySelector('main');
      const mainScroll = dashboardMain ? dashboardMain.scrollTop > 400 : false;
      
      setIsVisible(winScroll || mainScroll);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Also listen to main container scroll if it exists
    const dashboardMain = document.querySelector('main');
    if (dashboardMain) {
      dashboardMain.addEventListener('scroll', toggleVisibility, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (dashboardMain) {
        dashboardMain.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, []);

  const scrollToTop = () => {
    // Scroll window
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Scroll dashboard main if it exists
    const dashboardMain = document.querySelector('main');
    if (dashboardMain) {
      dashboardMain.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20, x: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20, x: -20 }}
          whileHover={{ scale: 1.1, backgroundColor: '#13BE77' }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-[100] bg-[#1E3A4B] text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(19,190,119,0.3)] border border-white/10 group overflow-hidden"
          aria-label="Scroll to top"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-[#13BE77] opacity-0 group-hover:opacity-20 transition-opacity" />
          
          <ChevronUp className="w-6 h-6 relative z-10 transition-transform group-hover:-translate-y-1" />
          
          {/* Subtle Glow Effect */}
          <div className="absolute -inset-4 bg-[#13BE77]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
