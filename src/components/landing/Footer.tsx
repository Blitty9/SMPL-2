import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const sections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Changelog'],
    },
    {
      title: 'Resources',
      links: ['Examples'],
    },
  ];

  return (
    <footer className="footer-container bg-deep-black relative pb-0">
      <svg className="absolute top-0 left-0 w-full h-[1px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footerGrid" width="40" height="1" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="#2F333A" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="1" fill="url(#footerGrid)" />
      </svg>

      <div className="container mx-auto px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="footer-brand">
            <Logo />
            <p className="text-[11px] text-graphite-gray mt-2.5 max-w-xs leading-[1.4] font-mono">
              AI-ready blueprints for modern development workflows
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="footer-section">
              <h3 className="text-[10px] font-mono font-semibold mb-2.5 uppercase tracking-widest text-graphite-gray">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => {
                  // Map link names to routes
                  const linkRoutes: Record<string, string> = {
                    'Examples': '/examples',
                  };
                  const route = linkRoutes[link];
                  
                  if (route) {
                    return (
                      <li key={link}>
                        <Link
                          to={route}
                          className="text-[11px] text-graphite-gray hover:text-white transition-colors duration-200"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase()}`}
                        className="text-[11px] text-graphite-gray hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom pt-4 pb-2 border-t border-[#2F333A] flex flex-col md:flex-row justify-between items-center gap-2.5">
          <p className="text-[11px] text-graphite-gray font-mono">
            © 2025 SMPL. Built for developers.
          </p>
          <div className="footer-legal flex gap-5">
            <Link
              to="/privacy"
              className="text-[11px] text-graphite-gray hover:text-white transition-colors duration-200 font-mono"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[11px] text-graphite-gray hover:text-white transition-colors duration-200 font-mono"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
