import { useState, useEffect, useRef } from "react";

export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const open = (d = null) => { setData(d); setIsOpen(true); };
  const close = () => { setIsOpen(false); setData(null); };
  return { isOpen, data, open, close };
};

export const useAnimateNumber = (target, duration = 800) => {
  const [current, setCurrent] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const from = current;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, [target]);
  return current;
};

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, callback]);
};
