'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimation(selector: string, animation: (el: Element) => void) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach((el) => {
      animation(el as Element);
    });

    return () => {
      gsap.killTweensOf(elements);
    };
  }, [selector, animation]);

  return elementRef;
}

// Fade in on scroll animation
export function fadeInOnScroll(element: Element | HTMLElement) {
  gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'top 60%',
      scrub: false,
      once: true,
    },
  });
}

// Scale on scroll animation
export function scaleOnScroll(element: Element | HTMLElement) {
  gsap.from(element, {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      end: 'top 65%',
      scrub: false,
      once: true,
    },
  });
}

// Hover flip animation
export function hoverFlip(element: Element | HTMLElement) {
  const el = element as HTMLElement;
  
  el.addEventListener('mouseenter', () => {
    gsap.to(element, {
      rotationY: 10,
      rotationX: -5,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(element, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });
}

// Parallax animation
export function parallax(element: Element | HTMLElement, speed: number = 0.5) {
  gsap.to(element, {
    y: () => {
      const yValue = gsap.getProperty(element, 'y');
      return (Number(yValue) || 0) - speed * 100;
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      markers: false,
    },
  });
}

// Number counter animation
export function countUp(element: Element | HTMLElement, endValue: number, duration: number = 2) {
  const el = element as HTMLElement;
  const obj = { value: 0 };

  gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.innerText = Math.round(obj.value).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
  });
}
