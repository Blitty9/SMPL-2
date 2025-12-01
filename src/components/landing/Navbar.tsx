import { Link } from 'react-router-dom';
import Logo from './Logo';

interface NavbarProps {
  onLaunchEditor: () => void;
}

export default function Navbar({ onLaunchEditor }: NavbarProps) {
  const links = [
    { name: 'Product', href: '/product' },
    { name: 'Examples', href: '/examples' },
  ];

  return (
    <nav className="nav-container sticky top-0 z-50 bg-deep-black/80 backdrop-blur-xl border-b border-[#2F333A]">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        <div className="nav-links flex items-center gap-8">
          {links.map((link) => {
            if (link.href.startsWith('/')) {
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-graphite-gray hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              );
            }
            return (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-graphite-gray hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <button
          onClick={onLaunchEditor}
          className="nav-cta px-4 py-2 rounded-lg bg-white text-deep-black text-xs font-medium hover:bg-[#C7B8FF] hover:text-white transition-colors duration-200"
        >
          Launch Editor
        </button>
      </div>
    </nav>
  );
}
