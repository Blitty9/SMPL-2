import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { trackEvent, AnalyticsEvents } from '../../lib/analytics';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  onLaunchEditor: () => void;
}

export default function Navbar({ onLaunchEditor }: NavbarProps) {
  const { user, signOut, loading } = useAuth();
  const links = [
    { name: 'Product', href: '/product' },
    { name: 'Examples', href: '/examples' },
  ];

  const handleSignOut = async () => {
    trackEvent({ name: 'User Signed Out' });
    await signOut();
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="nav-container sticky top-0 z-50 bg-deep-black/80 backdrop-blur-xl border-b border-[#2F333A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between relative">
        <Link to="/" className="hover:opacity-80 transition-opacity z-10 flex-shrink-0">
          <Logo />
        </Link>

        {/* Centered links - hidden on mobile, visible on desktop */}
        <div className="nav-links hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8">
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

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto">
          {!loading && (
            <>
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign out</span>
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </>
          )}
          <button
            onClick={() => {
              trackEvent({ name: AnalyticsEvents.LAUNCH_EDITOR_CLICKED });
              onLaunchEditor();
            }}
            className="nav-cta px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-white text-deep-black text-xs font-medium hover:bg-[#C7B8FF] hover:text-white transition-colors duration-200"
          >
            <span className="hidden lg:inline">Launch Editor</span>
            <span className="lg:hidden">Editor</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden z-10 p-2 -mr-2 text-graphite-gray hover:text-white transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2F333A] bg-deep-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-graphite-gray hover:text-white transition-colors duration-200 py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#2F333A] space-y-2">
              {!loading && (
                <>
                  {user ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </Button>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                        <Button variant="ghost" size="sm" className="w-full">
                          Sign in
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                        <Button size="sm" className="w-full">Sign up</Button>
                      </Link>
                    </>
                  )}
                </>
              )}
              <button
                onClick={() => {
                  trackEvent({ name: AnalyticsEvents.LAUNCH_EDITOR_CLICKED });
                  onLaunchEditor();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white text-deep-black text-sm font-medium hover:bg-[#C7B8FF] hover:text-white transition-colors duration-200"
              >
                Launch Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
