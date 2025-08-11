import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollTop = () => {
      const opts = { top: 0, behavior: 'smooth' };
      let done = false;
      try { window.scrollTo(opts); done = true; } catch {}
      try { if (!done && document.documentElement?.scrollTo) { document.documentElement.scrollTo(opts); done = true; } } catch {}
      try { if (!done && document.body?.scrollTo) { document.body.scrollTo(opts); done = true; } } catch {}
      if (!done) { window.scrollTo(0, 0); }
    };

    // Wait for layout/animations to settle, then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollTop);
    });

    // As a safety net, ensure we end up at top shortly after
    const t = setTimeout(() => {
      if (window.pageYOffset > 0) {
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
      }
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

export default ScrollToTop;