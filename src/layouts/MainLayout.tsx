import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '@components/ThemeToggle';
import { Button } from '@components/Button';
import { ToastHost } from '@ui/ToastHost';
import { useAuth } from '@hooks/useAuth';
import { useUiStore } from '@stores/uiStore';
import { APP_NAME } from '@constants/index';
import { cn } from '@utils/index';

const navItems = [
  { to: '/home', label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
  { to: '/marketplace', label: 'Marketplace', icon: 'M6 6l15 6-9 3-6-9zM3 12v9M6 15l-2 3M12 15v6' },
  { to: '/inventory', label: 'Inventory', icon: 'M9 4h6l1 4H8l1-4zM4 8h16v12H4V8z' },
  { to: '/orders', label: 'Orders', icon: 'M5 5h14v16H5V5zM9 10h6M9 14h6M9 18h4' },
  { to: '/chat', label: 'Chat', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { to: '/world', label: '3D World', icon: 'M12 2l10 5-10 5L2 7l10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { to: '/profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { to: '/settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
];

function NavItem({ to, label, icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={to}
      end={to === '/home'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-600/20 text-primary-300'
            : 'text-surface-400 hover:bg-surface-800 hover:text-surface-100',
        )
      }
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
        <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </NavLink>
  );
}

export function MainLayout() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full bg-surface-950 text-surface-100">
      <aside
        className={cn(
          'flex shrink-0 flex-col border-r border-surface-800 bg-surface-900 transition-all duration-200',
          sidebarOpen ? 'w-60' : 'w-0 border-r-0',
        )}
      >
        {sidebarOpen && (
          <div className="flex h-full w-60 flex-col">
            <div className="flex h-16 items-center gap-2 border-b border-surface-800 px-5">
              <div className="size-3 rounded-full bg-accent-500 shadow-glow" />
              <span className="font-display text-lg font-bold text-white">{APP_NAME}</span>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
            <div className="border-t border-surface-800 p-3">
              <div className="mb-2 truncate text-sm text-surface-300">
                {user?.displayName ?? user?.username ?? 'Guest'}
              </div>
              <Button variant="secondary" size="sm" className="w-full" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-surface-800 bg-surface-900/60 px-4 backdrop-blur">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-white focus-ring"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastHost />
    </div>
  );
}
