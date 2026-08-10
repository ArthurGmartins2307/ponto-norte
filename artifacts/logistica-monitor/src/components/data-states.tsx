import { AlertTriangle, CheckCircle2, CloudOff, RefreshCw, ServerCrash } from 'lucide-react';

export function ErrorState({ onRetry, compact = false }: { onRetry: () => void; compact?: boolean }) {
  return (
    <div className={`flex ${compact ? 'min-h-[180px]' : 'min-h-[360px]'} flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/[.04] p-8 text-center`} data-testid="state-error">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><ServerCrash size={22} /></div>
      <h2 className="font-display text-lg font-bold">Não foi possível atualizar os dados</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">A fonte de coleta não respondeu. Tente novamente para retomar o monitoramento.</p>
      <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-retry-data">
        <RefreshCw size={15} /> Tentar novamente
      </button>
    </div>
  );
}

export function LimitationNotice() {
  return (
    <div className="flex gap-3 rounded-2xl border border-accent/35 bg-accent/[.11] p-4" data-testid="notice-weather-limitation">
      <div className="mt-0.5 text-accent-foreground"><CloudOff size={19} /></div>
      <div>
        <p className="text-sm font-bold text-foreground">Leitura meteorológica parcial</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">O coletor obrigatório fornece apenas a temperatura atual. Portanto, há dados insuficientes para confirmar tempestade. Para elevar o nível de alerta, precisamos de um campo de <span className="font-mono text-foreground">precipitação</span> ou <span className="font-mono text-foreground">storm_warning</span> na API.</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center" data-testid="state-empty">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><AlertTriangle size={20} /></div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function HealthyMark({ label = 'Operacional' }: { label?: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--chart-3)/.12)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--chart-3))]" data-testid="status-healthy"><CheckCircle2 size={12} /> {label}</span>;
}