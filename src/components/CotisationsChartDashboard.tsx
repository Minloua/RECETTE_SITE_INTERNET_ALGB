import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { MONTHS_2026, type PaymentType } from '../data/mockData';
import type { MemberFinancialSummary } from '../context/AppContext';

type DashboardViewMode = 'MENSUEL' | 'CUMUL' | 'REPARTITION';
type MonthStatusKey = 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD' | 'A_ECHOIR';

interface CotisationsChartDashboardProps {
  financialSummary: MemberFinancialSummary;
  fiscalYear: number;
  monthlyAmount: number;
  currency: string;
  theme: 'light' | 'dark';
  onPayMonths: (months: string[]) => void;
  onOpenNewPayment: (type?: PaymentType) => void;
}

interface MonthlyChartRow {
  key: string;
  short: string;
  label: string;
  status: MonthStatusKey;
  statusLabel: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  cumulativePaid: number;
  cumulativeTarget: number;
  receiptRef?: string;
}

const STATUS_META: Record<
  MonthStatusKey,
  { label: string; lightColor: string; darkColor: string }
> = {
  PAYE: { label: 'Acquitté', lightColor: '#134E4A', darkColor: '#10B981' },
  EN_ATTENTE: { label: 'En attente', lightColor: '#F2B705', darkColor: '#F2B705' },
  EN_RETARD: { label: 'À régulariser', lightColor: '#C2410C', darkColor: '#FB923C' },
  A_ECHOIR: { label: 'À échoir', lightColor: '#D4D4D8', darkColor: '#3F3F46' },
};

interface CustomTooltipPayloadItem {
  payload?: MonthlyChartRow;
}

export const CotisationsChartDashboard: React.FC<CotisationsChartDashboardProps> = ({
  financialSummary,
  fiscalYear,
  monthlyAmount,
  currency,
  theme,
  onPayMonths,
  onOpenNewPayment,
}) => {
  const [viewMode, setViewMode] = useState<DashboardViewMode>('MENSUEL');
  const isDark = theme === 'dark';

  const unitAmount = monthlyAmount > 0 ? monthlyAmount : 5000;
  const annualTarget = MONTHS_2026.length * unitAmount;

  const monthlyData: MonthlyChartRow[] = useMemo(() => {
    let runningPaid = 0;

    return MONTHS_2026.map((m, idx) => {
      const isPaid = financialSummary.paidMonths.includes(m.key);
      const isPending = financialSummary.pendingMonths.includes(m.key);
      const isOverdue = financialSummary.overdueMonths.includes(m.key);

      let status: MonthStatusKey = 'A_ECHOIR';
      if (isPaid) status = 'PAYE';
      else if (isPending) status = 'EN_ATTENTE';
      else if (isOverdue) status = 'EN_RETARD';

      if (isPaid) {
        runningPaid += unitAmount;
      }

      const matchingTx = financialSummary.transactions.find(
        (tx) => tx.type === 'COTISATION_MENSUELLE' && tx.monthYears?.includes(m.key)
      );

      return {
        key: m.key,
        short: m.short,
        label: m.label.replace('2026', String(fiscalYear)),
        status,
        statusLabel: STATUS_META[status].label,
        amount: unitAmount,
        paidAmount: isPaid ? unitAmount : 0,
        pendingAmount: isPending ? unitAmount : 0,
        overdueAmount: isOverdue ? unitAmount : 0,
        cumulativePaid: runningPaid,
        cumulativeTarget: (idx + 1) * unitAmount,
        receiptRef: matchingTx?.receiptNumber,
      };
    });
  }, [financialSummary, fiscalYear, unitAmount]);

  const paidCount = financialSummary.paidMonths.length;
  const pendingCount = financialSummary.pendingMonths.length;
  const overdueCount = financialSummary.overdueMonths.length;
  const upcomingCount = Math.max(0, 12 - paidCount - pendingCount - overdueCount);
  const coveragePct = Math.round((paidCount / 12) * 100);
  const cotisationsPaidAmount = paidCount * unitAmount;
  const remainingAnnualAmount = Math.max(0, annualTarget - cotisationsPaidAmount);

  const donutData = useMemo(
    () =>
      [
        {
          key: 'PAYE' as MonthStatusKey,
          name: 'Acquittées',
          value: paidCount,
          amount: paidCount * unitAmount,
          color: isDark ? STATUS_META.PAYE.darkColor : STATUS_META.PAYE.lightColor,
        },
        {
          key: 'EN_ATTENTE' as MonthStatusKey,
          name: 'En attente',
          value: pendingCount,
          amount: pendingCount * unitAmount,
          color: isDark ? STATUS_META.EN_ATTENTE.darkColor : STATUS_META.EN_ATTENTE.lightColor,
        },
        {
          key: 'EN_RETARD' as MonthStatusKey,
          name: 'À régulariser',
          value: overdueCount,
          amount: overdueCount * unitAmount,
          color: isDark ? STATUS_META.EN_RETARD.darkColor : STATUS_META.EN_RETARD.lightColor,
        },
        {
          key: 'A_ECHOIR' as MonthStatusKey,
          name: 'À échoir',
          value: upcomingCount,
          amount: upcomingCount * unitAmount,
          color: isDark ? STATUS_META.A_ECHOIR.darkColor : STATUS_META.A_ECHOIR.lightColor,
        },
      ].filter((item) => item.value > 0),
    [paidCount, pendingCount, overdueCount, upcomingCount, unitAmount, isDark]
  );

  const contributionBreakdown = useMemo(
    () => [
      {
        category: 'Cotisations',
        fullLabel: 'Cotisations mensuelles acquittées',
        amount: financialSummary.totalCotisations,
        color: isDark ? '#10B981' : '#134E4A',
      },
      {
        category: 'Adhésion',
        fullLabel: 'Droit d’adhésion statutaire',
        amount: financialSummary.totalDroitAdhesion,
        color: isDark ? '#60A5FA' : '#16324F',
      },
      {
        category: 'Mécénat',
        fullLabel: 'Dons & projets du Lycée',
        amount: financialSummary.totalDons,
        color: '#F2B705',
      },
      {
        category: 'En attente',
        fullLabel: 'Versements en cours de validation',
        amount: financialSummary.totalPending,
        color: isDark ? '#FB923C' : '#C2410C',
      },
    ],
    [financialSummary, isDark]
  );

  const axisTickColor = isDark ? '#A1A1AA' : '#4A4A48';
  const gridStrokeColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,19,0.07)';

  const formatCurrencyCompact = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return String(val);
  };

  const renderMonthlyTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: readonly CustomTooltipPayloadItem[];
  }) => {
    if (!active || !payload || !payload[0]?.payload) return null;
    const row = payload[0].payload;
    return (
      <div className="bg-[#141413] text-white border border-white/15 rounded-lg px-3.5 py-2.5 shadow-xl text-xs space-y-1 min-w-[190px]">
        <div className="font-heading font-bold text-sm text-white">{row.label}</div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-300">Statut :</span>
          <span
            className="font-semibold"
            style={{
              color:
                row.status === 'PAYE'
                  ? '#34D399'
                  : row.status === 'EN_ATTENTE'
                  ? '#F2B705'
                  : row.status === 'EN_RETARD'
                  ? '#FB923C'
                  : '#D4D4D8',
            }}
          >
            {row.statusLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-300">Échéance :</span>
          <span className="font-mono font-semibold tabular-nums text-white">
            {row.amount.toLocaleString('fr-FR')} {currency}
          </span>
        </div>
        {row.receiptRef && (
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10 text-[11px] text-zinc-400">
            <span>Réf. reçu :</span>
            <span className="font-mono text-[#F2B705]">{row.receiptRef}</span>
          </div>
        )}
        {row.status === 'EN_RETARD' && (
          <div className="pt-1 text-[10px] text-[#F2B705] font-medium">
            Cliquez sur cette barre pour régler ce mois
          </div>
        )}
      </div>
    );
  };

  const renderCumulTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: readonly CustomTooltipPayloadItem[];
  }) => {
    if (!active || !payload || !payload[0]?.payload) return null;
    const row = payload[0].payload;
    const delta = row.cumulativePaid - row.cumulativeTarget;
    return (
      <div className="bg-[#141413] text-white border border-white/15 rounded-lg px-3.5 py-2.5 shadow-xl text-xs space-y-1 min-w-[210px]">
        <div className="font-heading font-bold text-sm text-white">{row.label}</div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-300">Cumul acquitté :</span>
          <span className="font-mono font-semibold tabular-nums text-[#34D399]">
            {row.cumulativePaid.toLocaleString('fr-FR')} {currency}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-300">Trajectoire statutaire :</span>
          <span className="font-mono font-semibold tabular-nums text-[#F2B705]">
            {row.cumulativeTarget.toLocaleString('fr-FR')} {currency}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10 text-[11px]">
          <span className="text-zinc-400">Écart :</span>
          <span
            className={`font-mono font-semibold tabular-nums ${
              delta >= 0 ? 'text-[#34D399]' : 'text-[#FB923C]'
            }`}
          >
            {delta >= 0 ? `+${delta.toLocaleString('fr-FR')}` : delta.toLocaleString('fr-FR')}{' '}
            {currency}
          </span>
        </div>
      </div>
    );
  };

  const renderBreakdownTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: readonly { payload?: { fullLabel: string; amount: number } }[];
  }) => {
    if (!active || !payload || !payload[0]?.payload) return null;
    const item = payload[0].payload;
    return (
      <div className="bg-[#141413] text-white border border-white/15 rounded-lg px-3.5 py-2.5 shadow-xl text-xs space-y-1">
        <div className="font-semibold text-white">{item.fullLabel}</div>
        <div className="font-mono font-bold tabular-nums text-[#F2B705]">
          {item.amount.toLocaleString('fr-FR')} {currency}
        </div>
      </div>
    );
  };

  return (
    <section
      aria-label="Tableau de bord visuel des cotisations"
      className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-6"
    >
      {/* En-tête + Sélecteur de vue */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#4A4A48] dark:text-[#F2B705]">
            Suivi financier & analytics · Exercice {fiscalYear}
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
            Historique visuel des cotisations
          </h2>
          <p className="text-xs text-[#4A4A48] dark:text-zinc-300 mt-1">
            Visualisez vos mensualités acquittées, la progression cumulée vers l’objectif annuel et vos contributions globales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div
            role="tablist"
            aria-label="Mode d'affichage du graphique des cotisations"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-black/10 dark:border-white/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'MENSUEL'}
              onClick={() => setViewMode('MENSUEL')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'MENSUEL'
                  ? 'bg-[#141413] dark:bg-[#F2B705] text-white dark:text-[#141413]'
                  : 'text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Mensuel</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'CUMUL'}
              onClick={() => setViewMode('CUMUL')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'CUMUL'
                  ? 'bg-[#141413] dark:bg-[#F2B705] text-white dark:text-[#141413]'
                  : 'text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cumul annuel</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'REPARTITION'}
              onClick={() => setViewMode('REPARTITION')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'REPARTITION'
                  ? 'bg-[#141413] dark:bg-[#F2B705] text-white dark:text-[#141413]'
                  : 'text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Contributions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bandeau 4 indicateurs synthétiques (tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
          <div className="text-[11px] font-medium text-[#4A4A48] dark:text-zinc-400">
            Couverture {fiscalYear}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-[#134E4A] dark:text-emerald-400 tabular-nums">
              {coveragePct} %
            </span>
            <span className="text-xs text-[#4A4A48] dark:text-zinc-400 tabular-nums">
              ({paidCount}/12 mois)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
          <div className="text-[11px] font-medium text-[#4A4A48] dark:text-zinc-400">
            Cotisations acquittées
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white tabular-nums">
            {cotisationsPaidAmount.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-sans font-medium text-[#4A4A48] dark:text-zinc-400">
              {currency}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
          <div className="text-[11px] font-medium text-[#4A4A48] dark:text-zinc-400">
            {overdueCount > 0 ? `À régulariser (${overdueCount} mois)` : 'Reste annuel'}
          </div>
          <div
            className={`mt-1 text-xl sm:text-2xl font-heading font-bold tabular-nums ${
              overdueCount > 0
                ? 'text-[#C2410C] dark:text-orange-400'
                : 'text-[#141413] dark:text-white'
            }`}
          >
            {(overdueCount > 0 ? overdueCount * unitAmount : remainingAnnualAmount).toLocaleString(
              'fr-FR'
            )}{' '}
            <span className="text-xs font-sans font-medium text-[#4A4A48] dark:text-zinc-400">
              {currency}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
          <div className="text-[11px] font-medium text-[#4A4A48] dark:text-zinc-400">
            Total tous versements
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-heading font-bold text-[#16324F] dark:text-[#F2B705] tabular-nums">
            {financialSummary.totalPaid.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-sans font-medium text-[#4A4A48] dark:text-zinc-400">
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Zone Graphiques Recharts */}
      {viewMode === 'MENSUEL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Graphique en barres des 12 mois */}
          <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                  Échéancier mensuel Janvier – Décembre {fiscalYear}
                </h3>
                <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                  Mensualité statutaire : {unitAmount.toLocaleString('fr-FR')} {currency} / mois
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#4A4A48] dark:text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#134E4A] dark:text-emerald-400" />
                  <span>Acquitté</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B48200] dark:text-[#F2B705]" />
                  <span>En attente</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C2410C] dark:text-orange-400" />
                  <span>À régulariser</span>
                </span>
              </div>
            </div>

            <div className="w-full h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} vertical={false} />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: axisTickColor, fontSize: 11 }}
                    axisLine={{ stroke: gridStrokeColor }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: axisTickColor, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatCurrencyCompact}
                  />
                  <Tooltip content={renderMonthlyTooltip} cursor={{ fill: 'rgba(242,183,5,0.08)' }} />
                  <Bar
                    dataKey="amount"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                    onClick={(entry) => {
                      const row = entry as unknown as MonthlyChartRow;
                      if (row?.status === 'EN_RETARD' && row?.key) {
                        onPayMonths([row.key]);
                      }
                    }}
                  >
                    {monthlyData.map((row) => {
                      const fill = isDark
                        ? STATUS_META[row.status].darkColor
                        : STATUS_META[row.status].lightColor;
                      return (
                        <Cell
                          key={row.key}
                          fill={fill}
                          style={{ cursor: row.status === 'EN_RETARD' ? 'pointer' : 'default' }}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique Donut de synthèse annuelle */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                Répartition des 12 mois
              </h3>
              <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Objectif annuel : {annualTarget.toLocaleString('fr-FR')} {currency}
              </p>
            </div>

            <div className="relative w-full h-[195px] my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown, name: unknown) => [
                      `${value} mois (${(Number(value) * unitAmount).toLocaleString('fr-FR')} ${currency})`,
                      String(name),
                    ]}
                    contentStyle={{
                      backgroundColor: '#141413',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-bold text-[#141413] dark:text-white tabular-nums">
                  {paidCount}/12
                </span>
                <span className="text-[10px] font-medium text-[#4A4A48] dark:text-zinc-400">
                  mois acquittés
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
              {donutData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between text-xs text-[#141413] dark:text-zinc-200"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {item.value} mois · {item.amount.toLocaleString('fr-FR')} F
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'CUMUL' && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                Progression cumulée des versements vs trajectoire statutaire
              </h3>
              <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Comparaison mois par mois entre votre cumul acquitté et l’échéancier cumulé de {fiscalYear}
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#4A4A48] dark:text-zinc-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-[#134E4A] dark:bg-emerald-400" />
                <span>Cumul acquitté</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-[#F2B705]" />
                <span>Trajectoire attendue</span>
              </span>
            </div>
          </div>

          <div className="w-full h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="algbCumulPaidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isDark ? '#10B981' : '#134E4A'}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={isDark ? '#10B981' : '#134E4A'}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} vertical={false} />
                <XAxis
                  dataKey="short"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={{ stroke: gridStrokeColor }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatCurrencyCompact}
                />
                <Tooltip content={renderCumulTooltip} />
                <Area
                  type="monotone"
                  dataKey="cumulativeTarget"
                  name="Trajectoire statutaire"
                  stroke="#F2B705"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativePaid"
                  name="Cumul acquitté"
                  stroke={isDark ? '#10B981' : '#134E4A'}
                  strokeWidth={2.5}
                  fill="url(#algbCumulPaidGradient)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'REPARTITION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 space-y-3">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                Ventilation par nature de contribution
              </h3>
              <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Montants consolidés sur votre compte adhérent ({currency})
              </p>
            </div>

            {financialSummary.transactions.length === 0 ? (
              <div className="h-[240px] flex flex-col items-center justify-center text-center gap-3">
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 max-w-xs">
                  Aucune transaction enregistrée pour le moment sur cet exercice.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenNewPayment('COTISATION_MENSUELLE')}
                  className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
                >
                  Effectuer mon premier versement
                </button>
              </div>
            ) : (
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contributionBreakdown}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} vertical={false} />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: axisTickColor, fontSize: 11 }}
                      axisLine={{ stroke: gridStrokeColor }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: axisTickColor, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatCurrencyCompact}
                    />
                    <Tooltip
                      content={renderBreakdownTooltip}
                      cursor={{ fill: 'rgba(242,183,5,0.08)' }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {contributionBreakdown.map((item) => (
                        <Cell key={item.category} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-black/5 dark:border-white/10 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white">
                Synthèse comptable {fiscalYear}
              </h3>
              <div className="divide-y divide-black/10 dark:divide-white/10">
                {contributionBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="inline-flex items-center gap-2 text-[#141413] dark:text-zinc-200">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <span>{item.fullLabel}</span>
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-[#141413] dark:text-white whitespace-nowrap">
                      {item.amount.toLocaleString('fr-FR')} {currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#4A4A48] dark:text-zinc-400">
                {financialSummary.transactions.length} opération(s) enregistrée(s)
              </span>
              <button
                type="button"
                onClick={() => onOpenNewPayment('DON_PROJET')}
                className="px-3.5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Soutenir un projet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pied d'action contextuel */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl bg-[#FFF7ED] dark:bg-orange-950/35 border border-[#C2410C]/20 dark:border-orange-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-[#C2410C] dark:text-orange-400 shrink-0 mt-0.5" />
            <div className="text-[#141413] dark:text-zinc-100">
              <strong className="font-semibold">
                {overdueCount} mensualité{overdueCount > 1 ? 's' : ''} en attente de régularisation
              </strong>{' '}
              ({(overdueCount * unitAmount).toLocaleString('fr-FR')} {currency}) — réglez en un clic pour débloquer le quitus annuel et les services membres à jour.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPayMonths(financialSummary.overdueMonths)}
            className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#141413]" />
            <span>Régulariser ({overdueCount} mois)</span>
          </button>
        </div>
      )}
    </section>
  );
};
