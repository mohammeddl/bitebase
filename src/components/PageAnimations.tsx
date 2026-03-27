'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drop this component into any page (server or client) to add
 * scroll-triggered GSAP animations. Elements are selected via
 * data-gsap attributes:
 *
 *  data-gsap="hero"        — animates immediately on load (no scroll trigger)
 *  data-gsap="fade-up"     — fade + slide up on scroll
 *  data-gsap="fade-in"     — fade in on scroll
 *  data-gsap="scale"       — scale up + fade on scroll
 *  data-gsap="slide-left"  — slide from left on scroll
 *  data-gsap="slide-right" — slide from right on scroll
 *  data-gsap="stagger"     — stagger-animates direct children on scroll
 */
export default function PageAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero (immediate, no scroll trigger) ─────────────────────
      gsap.utils.toArray<Element>('[data-gsap="hero"]').forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.12,
          ease: 'power3.out',
        });
      });

      // ── Fade up ─────────────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="fade-up"]').forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // ── Fade in ─────────────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="fade-in"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // ── Scale in ────────────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="scale"]').forEach((el) => {
        gsap.from(el, {
          scale: 0.93,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // ── Slide from left ─────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="slide-left"]').forEach((el) => {
        gsap.from(el, {
          x: -70,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // ── Slide from right ────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="slide-right"]').forEach((el) => {
        gsap.from(el, {
          x: 70,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // ── Stagger children ────────────────────────────────────────
      gsap.utils.toArray<Element>('[data-gsap="stagger"]').forEach((el) => {
        gsap.from(Array.from(el.children), {
          y: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

    });

    return () => ctx.revert();
  }, []);

  return null;
}
