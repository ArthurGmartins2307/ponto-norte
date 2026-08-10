import { useGetLogisticsData, getGetLogisticsDataQueryKey } from '@workspace/api-client-react';
import { ArrowUpRight, Clock3, Database, RefreshCw } from 'lucide-react';
import { ErrorState, EmptyState } from '@/components/data-states';
import { PageHeading } from '@/components/ops-shell';

function formatTimestamp(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function History() {
  const query = useGetLogisticsData({ query: { queryKey: getGetLogisticsDataQueryKey(), refetchInterval: 300000, staleTime: 240000 } });
  const data = query.data;
  return (
    <>
      <PageHeading eyebrow="Dados / Capturas recentes" title="Histórico" description="A primeira linha é a observação ao vivo atual. Capturas anteriores ficam disponíveis quando o coletor persistir o histórico.">
        <button onClick={() => query.refetch()} className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold shadow-sm transition-colors hover:border-primary hover:text-primary lg:self-auto" data-testid="button-refresh-history"><RefreshCw size={15} className={query.isFetching ? 'animate-spin' : ''} /> Atualizar</button>
      </PageHeading>
      {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : query.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm" data-testid="state-history-loading">
          {[1, 2, 3, 4].map((item) => <div className="flex gap-5 border-b border-border p-5" key={item}><div className="skeleton h-10 w-10 rounded-xl" /><div className="flex-1 space-y-2"><div className="skeleton h-3 w-1/4 rounded" /><div className="skeleton h-3 w-2/3 rounded" /></div></div>)}
        </div>
      ) : !data ? <EmptyState title="Nenhuma captura encontrada" description="Assim que a coleta retornar uma observação, ela aparecerá aqui." /> : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-card-border bg-card shadow-sm" data-testid="history-observations">
            <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-secondary p-2 text-primary"><Database size={18} /></div><div><h2 className="font-display text-lg font-bold">Observações capturadas</h2><p className="mt-1 text-xs text-muted-foreground">Fonte operacional · ordenado por captura</p></div></div><span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">01 registro disponível</span></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead><tr className="border-b border-border bg-muted/45 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground"><th className="px-6 py-3 font-medium">Captura</th><th className="px-6 py-3 font-medium">Dólar</th><th className="px-6 py-3 font-medium">Euro</th><th className="px-6 py-3 font-medium">Temperatura</th><th className="px-6 py-3 font-medium">Estado</th></tr></thead>
                <tbody>
                  <tr className="bg-accent/[.06] transition-colors hover:bg-accent/[.11]" data-testid="row-history-current">
                    <td className="px-6 py-5"><div className="flex items-center gap-2.5"><span className="pulse-dot h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" /><div><p className="text-sm font-bold">Agora</p><p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><Clock3 size={12} /> {formatTimestamp(data.timestamp)}</p></div></div></td>
                    <td className="px-6 py-5"><span className="font-mono-data text-sm font-medium">R$ {data.dolar}</span><span className="ml-2 text-[10px] text-[hsl(var(--chart-3))]"><ArrowUpRight size={12} className="inline" /> vivo</span></td>
                    <td className="px-6 py-5"><span className="font-mono-data text-sm font-medium">R$ {data.euro}</span><span className="ml-2 text-[10px] text-[hsl(var(--chart-3))]"><ArrowUpRight size={12} className="inline" /> vivo</span></td>
                    <td className="px-6 py-5 font-mono-data text-sm">{data.temperatura}°C</td>
                    <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--chart-3)/.12)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--chart-3))]">atual</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div className="flex gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-xs leading-5 text-muted-foreground" data-testid="history-empty-context"><Database size={17} className="mt-0.5 shrink-0 text-primary" /><p><span className="font-bold text-foreground">Histórico persistido ainda não disponível.</span> A API atual entrega somente a observação corrente. Quando o serviço expuser uma coleção de capturas, ela será exibida nesta mesma tabela.</p></div>
        </div>
      )}
    </>
  );
}