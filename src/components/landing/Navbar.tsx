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

  return (
    <nav className="nav-container sticky top-0 z-50 bg-deep-black/80 backdrop-blur-xl border-b border-[#2F333A]">
      <div className="container mx-auto px-8 py-4 flex items-center relative">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Centered links - absolutely positioned */}
        <div className="nav-links absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
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

        <div className="flex items-center gap-4 ml-auto">
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
                  Sign out
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
            className="nav-cta px-4 py-2 rounded-lg bg-white text-deep-black text-xs font-medium hover:bg-[#C7B8FF] hover:text-white transition-colors duration-200"
          >
            Launch Editor
          </button>
        </div>
      </div>
    </nav>
  );
}
