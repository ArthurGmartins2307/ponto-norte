import { useGetLogisticsData, getGetLogisticsDataQueryKey } from '@workspace/api-client-react';
import { ArrowRight, CloudSun, MapPin, RefreshCw, Thermometer } from 'lucide-react';
import { ErrorState, LimitationNotice, HealthyMark } from '@/components/data-states';
import { MetricSkeleton, PageHeading } from '@/components/ops-shell';

function formatTime(timestamp?: string) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

const routes = [
  { id: 'sp-campinas', name: 'São Paulo → Campinas', code: 'SP-010', window: '07:00 — 11:30', load: 'Eletrônicos', state: 'Monitorar' },
  { id: 'sp-santos', name: 'São Paulo → Santos', code: 'BR-050', window: '08:30 — 13:00', load: 'Bens de consumo', state: 'Monitorar' },
  { id: 'sp-jundiai', name: 'São Paulo → Jundiaí', code: 'SP-348', window: '10:00 — 14:30', load: 'Perecíveis', state: 'Monitorar' },
];

export default function Routes() {
  const query = useGetLogisticsData({ query: { queryKey: getGetLogisticsDataQueryKey(), refetchInterval: 300000, staleTime: 240000 } });
  const temperature = query.data?.temperatura;
  return (
    <>
      <PageHeading eyebrow="Operação / Malha ativa" title="Rotas" description="Acompanhe o contexto disponível antes de liberar cada janela de transporte.">
        <button onClick={() => query.refetch()} className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold shadow-sm transition-colors hover:border-primary hover:text-primary lg:self-auto" data-testid="button-refresh-routes">
          <RefreshCw size={15} className={query.isFetching ? 'animate-spin' : ''} /> Atualizar contexto
        </button>
      </PageHeading>
      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm" data-testid="metric-active-routes"><p className="font-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">Rotas acompanhadas</p><p className="mt-3 font-display text-3xl font-bold">03</p><p className="mt-1 text-xs text-muted-foreground">na malha São Paulo</p></div>
            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm" data-testid="metric-route-temperature"><p className="font-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">Temperatura de referência</p>{temperature === undefined ? <MetricSkeleton className="mt-3 w-20" /> : <p className="mt-3 font-display text-3xl font-bold">{temperature}°</p>}<p className="mt-1 text-xs text-muted-foreground">São Paulo · leitura atual</p></div>
            <div className="rounded-2xl border border-accent/35 bg-accent/[.12] p-5 shadow-sm" data-testid="metric-route-alert"><p className="font-mono text-[10px] uppercase tracking-[.17em] text-accent-foreground">Alertas confirmados</p><p className="mt-3 font-display text-3xl font-bold">00</p><p className="mt-1 text-xs text-muted-foreground">sem sinal meteorológico suficiente</p></div>
          </section>

          <section className="rounded-2xl border border-card-border bg-card shadow-sm" data-testid="route-monitoring-table">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="font-display text-lg font-bold">Janela operacional</h2><p className="mt-1 text-xs text-muted-foreground">Rotas com saída prevista para hoje</p></div><HealthyMark label="malha estável" /></div>
            <div className="divide-y divide-border">
              {routes.map((route) => (
                <div key={route.id} className="grid gap-4 p-5 transition-colors hover:bg-muted/40 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center sm:p-6" data-testid={`row-route-${route.id}`}>
                  <div className="flex items-start gap-3"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><MapPin size={17} /></div><div><p className="text-sm font-bold">{route.name}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{route.code} · {route.load}</p></div></div>
                  <div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Janela</p><p className="mt-1 text-sm font-semibold">{route.window}</p></div>
                  <div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Contexto</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground"><CloudSun size={14} /> parcial</p></div>
                  <div className="flex items-center gap-2"><span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-accent-foreground">monitorar</span><ArrowRight size={16} className="text-muted-foreground" /></div>
                </div>
              ))}
            </div>
          </section>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <LimitationNotice />
            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm" data-testid="card-route-guidance"><div className="flex gap-3"><div className="rounded-xl bg-secondary p-2 text-primary"><Thermometer size={18} /></div><div><p className="text-sm font-bold">Como interpretar</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Temperatura sozinha não determina risco de trânsito. Confirme condições em uma fonte meteorológica com precipitação e avisos.</p></div></div></div>
          </div>
        </div>
      )}
    </>
  );
}