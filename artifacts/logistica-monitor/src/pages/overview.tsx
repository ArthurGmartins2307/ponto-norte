import { useMemo, useState } from 'react';
import { useGetLogisticsData, useHealthCheck, getGetLogisticsDataQueryKey, getHealthCheckQueryKey } from '@workspace/api-client-react';
import { ArrowUpRight, CloudSun, Coins, Info, RefreshCw, ShieldAlert, Thermometer, TimerReset, TrendingUp, Wind } from 'lucide-react';
import { LimitationNotice, ErrorState, HealthyMark } from '@/components/data-states';
import { MetricSkeleton, PageHeading } from '@/components/ops-shell';

function formatTime(timestamp?: string) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }).format(date);
}

function parseRate(value: string | undefined) {
  if (!value) return null;
  const numeric = Number(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(numeric) ? numeric : null;
}

function QuoteCard({ label, code, value, tone, icon: Icon, testId }: { label: string; code: string; value?: string; tone: 'amber' | 'teal'; icon: typeof Coins; testId: string }) {
  const numeric = parseRate(value);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-card-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" data-testid={testId}>
      <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full blur-2xl ${tone === 'amber' ? 'bg-accent/20' : 'bg-[hsl(var(--chart-3)/.14)]'}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">{code}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === 'amber' ? 'bg-accent/15 text-accent-foreground' : 'bg-[hsl(var(--chart-3)/.12)] text-[hsl(var(--chart-3))]'}`}><Icon size={18} /></div>
      </div>
      <div className="relative mt-7 flex items-end justify-between">
        <div>
          {value === undefined ? <MetricSkeleton className="w-32" /> : <p className="font-mono-data text-[31px] font-medium tracking-[-.06em] text-foreground" data-testid={`${testId}-value`}>R$ {value}</p>}
          <p className="mt-1 text-[11px] text-muted-foreground">{numeric ? 'cotação de referência' : 'aguardando cotação'}</p>
        </div>
        <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--chart-3))]"><ArrowUpRight size={14} /> ao vivo</span>
      </div>
    </article>
  );
}

export default function Overview() {
  const query = useGetLogisticsData({ query: { queryKey: getGetLogisticsDataQueryKey(), refetchInterval: 300000, staleTime: 240000 } });
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 60000, staleTime: 30000 } });
  const [showSources, setShowSources] = useState(false);
  const data = query.data;
  const temperature = data?.temperatura === undefined ? null : Number(data.temperatura);
  const stale = data?.timestamp ? Date.now() - new Date(data.timestamp).getTime() > 15 * 60 * 1000 : false;
  const healthLabel = health.data?.status ? 'serviço de coleta online' : 'checando serviço';
  const gaugeWidth = useMemo(() => Math.min(100, Math.max(12, ((temperature ?? 24) + 5) * 2.3)), [temperature]);

  return (
    <>
      <PageHeading eyebrow="Centro de comando / São Paulo" title="Visão geral" description="Cotações e condições que movem as decisões de rota de hoje.">
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">Última leitura</p>
            <p className="mt-1 text-xs font-semibold text-foreground" data-testid="text-last-update-heading">{formatTime(data?.timestamp)}</p>
          </div>
          <button onClick={() => query.refetch()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary" data-testid="button-refresh-overview">
            <RefreshCw size={15} className={query.isFetching ? 'animate-spin' : ''} /> Atualizar
          </button>
        </div>
      </PageHeading>

      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="md:col-span-2 xl:col-span-2">
              <div className="relative h-full min-h-[184px] overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-md" data-testid="card-operation-status">
                <div className="data-grid absolute inset-0 opacity-10" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[.19em] text-primary-foreground/60">Status da operação</p>
                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Janela de decisão aberta</h2>
                    </div>
                    <HealthyMark label="estável" />
                  </div>
                  <div className="mt-7 flex items-end justify-between gap-4">
                    <p className="max-w-[320px] text-xs leading-5 text-primary-foreground/65">
                      {data?.dolar !== 'Erro' && data?.euro !== 'Erro'
                        ? 'Cotações carregadas. Condição meteorológica parcial — sem confirmação de chuva ou tempestade.'
                        : 'Temperatura carregada. Cotações indisponíveis no momento; use Atualizar para tentar novamente.'}
                    </p>
                    <ShieldAlert className="hidden shrink-0 text-accent sm:block" size={34} strokeWidth={1.4} />
                  </div>
                </div>
              </div>
            </div>
            <QuoteCard label="Dólar americano" code="USD / BRL" value={data?.dolar} tone="amber" icon={Coins} testId="card-usd-quote" />
            <QuoteCard label="Euro" code="EUR / BRL" value={data?.euro} tone="teal" icon={TrendingUp} testId="card-eur-quote" />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <article className="rounded-2xl border border-card-border bg-card p-6 shadow-sm" data-testid="card-weather-route">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground"><CloudSun size={14} className="text-primary" /> Condição de rota</div>
                  <h2 className="mt-2 font-display text-xl font-bold">São Paulo · eixo metropolitano</h2>
                </div>
                <div className="rounded-xl bg-secondary p-2.5 text-primary"><Thermometer size={19} /></div>
              </div>
              <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-end">
                <div className="flex items-end gap-3">
                  {temperature === null ? <MetricSkeleton className="h-14 w-28" /> : <span className="font-display text-6xl font-bold tracking-[-.08em]" data-testid="text-temperature">{temperature}<sup className="ml-1 align-top text-2xl">°C</sup></span>}
                  <span className="mb-2 text-sm text-muted-foreground">temperatura atual</span>
                </div>
                <div className="flex-1 pb-1">
                  <div className="mb-2 flex justify-between font-mono text-[10px] text-muted-foreground"><span>faixa operacional</span><span>{temperature === null ? '—' : temperature < 18 ? 'frio' : temperature > 31 ? 'calor' : 'moderada'}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${gaugeWidth}%` }} /></div>
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>10°</span><span>25°</span><span>40°</span></div>
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-3">
                <div><p className="text-[10px] uppercase tracking-[.12em] text-muted-foreground">Impacto no trânsito</p><p className="mt-1 text-sm font-bold">não avaliado</p></div>
                <div><p className="text-[10px] uppercase tracking-[.12em] text-muted-foreground">Precipitação</p><p className="mt-1 text-sm font-bold text-muted-foreground">sem dado</p></div>
                <div className="col-span-2 sm:col-span-1"><p className="text-[10px] uppercase tracking-[.12em] text-muted-foreground">Vento</p><p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-muted-foreground"><Wind size={14} /> sem dado</p></div>
              </div>
            </article>

            <article className="rounded-2xl border border-card-border bg-card p-6 shadow-sm" data-testid="card-risk-status">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground"><ShieldAlert size={14} className="text-accent-foreground" /> Risco de rota</div>
                <Info size={16} className="text-muted-foreground" />
              </div>
              <div className="mt-6 flex items-center gap-5">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-secondary">
                  <div className="absolute inset-[-10px] rounded-full border-[10px] border-accent border-b-transparent border-l-transparent" />
                  <span className="font-display text-2xl font-bold">—</span>
                </div>
                <div><p className="font-display text-lg font-bold">Dados insuficientes</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Sem precipitação e alertas de tempestade, a avaliação fica limitada.</p></div>
              </div>
              <div className="mt-6 rounded-xl bg-muted/70 p-3 text-xs leading-5 text-muted-foreground" data-testid="status-route-risk">
                <span className="font-bold text-foreground">Sem alerta ativo.</span> Isso não significa céu limpo; significa que o coletor ainda não possui o sinal necessário para confirmar um evento.
              </div>
            </article>
          </section>

          <LimitationNotice />

          <section className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
            <article className="rounded-2xl border border-card-border bg-card p-6 shadow-sm" data-testid="card-data-provenance">
              <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold">Qualidade da leitura</h2><span className="rounded-md bg-secondary px-2 py-1 font-mono text-[10px] text-primary">LIVE</span></div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Cotação e temperatura</span><span className="font-semibold text-[hsl(var(--chart-3))]">disponível</span></div>
                <div className="flex items-center justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Atualização</span><span className="font-mono text-xs" data-testid="text-last-update">{formatTime(data?.timestamp)}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Saúde da API</span><span className="font-semibold text-[hsl(var(--chart-3))]" data-testid="status-api-health">{health.isLoading ? 'verificando' : healthLabel}</span></div>
              </div>
              <button onClick={() => setShowSources((v) => !v)} className="mt-5 flex items-center gap-2 text-xs font-bold text-primary hover:underline" data-testid="button-toggle-sources">{showSources ? 'Ocultar contexto' : 'Ver contexto da fonte'} <Info size={14} /></button>
              {showSources && <p className="mt-3 border-l-2 border-accent pl-3 text-xs leading-5 text-muted-foreground" data-testid="text-source-context">Dados coletados pelo serviço operacional interno. As cotações são referências de decisão, não indicação financeira. O timestamp representa a captura no servidor.</p>}
            </article>
            <article className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-sm" data-testid="card-decision-note">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(135deg,transparent_30%,hsl(var(--secondary))_30%,hsl(var(--secondary))_31%,transparent_31%)] opacity-70" />
              <div className="relative">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground"><TimerReset size={14} className="text-primary" /> Próxima janela de coleta</div>
                <div className="mt-5 flex items-baseline gap-3"><span className="font-display text-4xl font-bold">05:00</span><span className="text-sm text-muted-foreground">minutos</span></div>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">A próxima leitura atualiza as cotações e temperatura automaticamente. Rotas não são bloqueadas por ausência de dados meteorológicos.</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary"><span className="pulse-dot h-2 w-2 rounded-full bg-primary" /> monitoramento contínuo</div>
              </div>
            </article>
          </section>
        </div>
      )}
    </>
  );
}