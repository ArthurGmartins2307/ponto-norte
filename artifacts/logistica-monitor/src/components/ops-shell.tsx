import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity,
  ChevronRight,
  CircleHelp,
  CloudSun,
  Command,
  History,
  Menu,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  Route as RouteIcon,
  ShieldCheck,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Visão geral', icon: Activity, testId: 'link-overview' },
  { href: '/rotas', label: 'Rotas', icon: Navigation, testId: 'link-routes' },
  { href: '/historico', label: 'Histórico', icon: History, testId: 'link-history' },
];

export function OpsShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="noise-layer min-h-[100dvh] bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${collapsed ? 'md:w-[78px]' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        data-testid="navigation-sidebar"
      >
        <div className="flex h-[88px] items-center justify-between border-b border-sidebar-border px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" data-testid="link-brand" onClick={() => setMobileOpen(false)}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <RouteIcon size={21} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display truncate text-[17px] font-bold tracking-tight text-sidebar-accent-foreground">Ponto Norte</p>
                <p className="font-mono text-[9px] uppercase tracking-[.22em] text-sidebar-foreground/55">control room</p>
              </div>
            )}
          </Link>
          <button className="hidden rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:block" onClick={() => setCollapsed((v) => !v)} data-testid="button-toggle-sidebar" aria-label="Alternar menu lateral">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <button className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-mobile-menu" aria-label="Fechar menu">
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          {!collapsed && <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/45">Operação</p>}
          <nav className="space-y-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const active = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  data-testid={item.testId}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'} ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={18} className={active ? 'text-sidebar-primary' : 'text-sidebar-foreground/55 group-hover:text-sidebar-primary'} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && active && <ChevronRight size={14} className="ml-auto text-sidebar-primary" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-5">
          <div className={`mb-4 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3 ${collapsed ? 'flex justify-center' : ''}`} data-testid="status-system-card">
            <div className="flex items-center gap-2">
              <span className="pulse-dot h-2 w-2 rounded-full bg-sidebar-primary" />
              {!collapsed && <span className="font-mono text-[10px] uppercase tracking-[.14em] text-sidebar-foreground/70">Sistema operacional</span>}
            </div>
            {!collapsed && <p className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/45">Coleta automática a cada 5 min</p>}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2 border-t border-sidebar-border pt-4 text-xs text-sidebar-foreground/45">
              <CircleHelp size={14} />
              <span>Precisa de suporte?</span>
              <span className="ml-auto font-mono text-[10px] text-sidebar-foreground/65">v1.0.4</span>
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-30 bg-sidebar/40 md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-mobile-overlay" aria-label="Fechar menu" />}
      <main className={`min-h-[100dvh] transition-[padding] duration-300 md:pl-[252px] ${collapsed ? 'md:pl-[78px]' : ''}`}>
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-border bg-card p-2 text-muted-foreground md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-mobile-menu" aria-label="Abrir menu">
              <Menu size={19} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <Radio size={15} className="text-accent-foreground" />
              <span className="font-mono uppercase tracking-[.14em]">monitoramento ao vivo</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground lg:flex" data-testid="status-live-connection">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--chart-3))]" />
              Conexão estável
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground" data-testid="button-command-menu" aria-label="Abrir atalhos">
              <Command size={16} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" data-testid="avatar-operator">OP</div>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-9">{children}</div>
      </main>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="animate-rise-in">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-[-.035em] text-foreground md:text-[42px]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function MetricSkeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton h-8 rounded-md ${className}`} aria-label="Carregando" data-testid="skeleton-metric" />;
}