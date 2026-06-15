import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useDsa } from '../../context/DsaContext';
import Panel from '../common/Panel';

export function ActivityChart() {
  const theme = useTheme();
  const { dailySolved } = useDsa();
  const gridColor = theme.palette.divider;
  const mutedColor = theme.palette.text.secondary;
  const barColor = theme.palette.mode === 'dark' ? '#ffffff' : '#18181b';

  return (
    <Panel title="Activity" subtitle="Daily solves — last 30 days" sx={{ height: '100%' }}>
      <Box height={240} sx={{ mt: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailySolved} barSize={8}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: mutedColor }} axisLine={false} tickLine={false} interval="preserveEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: mutedColor }} axisLine={false} tickLine={false} width={20} />
            <Tooltip
              cursor={{ fill: theme.palette.action.hover }}
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${gridColor}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} name="Solved" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Panel>
  );
}

export function BreakdownChart() {
  const theme = useTheme();
  const { difficultyDistribution, statusDistribution, stats } = useDsa();
  const [tab, setTab] = useState(0);
  const gridColor = theme.palette.divider;

  const hasDifficultyData = difficultyDistribution.some((d) => d.value > 0);
  const difficultyData = hasDifficultyData
    ? difficultyDistribution.filter((d) => d.value > 0)
    : [{ name: 'No data', value: 1 }];

  const COLORS = {
    Easy: '#16a34a',
    Medium: '#d97706',
    Hard: '#dc2626',
    'No data': theme.palette.mode === 'dark' ? '#27272a' : '#e4e4e7',
  };

  return (
    <Panel
      title="Breakdown"
      subtitle="Difficulty & status"
      sx={{ height: '100%' }}
      action={
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ minHeight: 32, mr: 1, '& .MuiTab-root': { minHeight: 32, py: 0, px: 1.5, fontSize: '0.75rem' } }}
        >
          <Tab label="Difficulty" />
          <Tab label="Status" />
        </Tabs>
      }
    >
      <Box height={240} display="flex" flexDirection="column" justifyContent="center">
        {tab === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%" position="relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                  {difficultyData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name] || COLORS['No data']} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <Box position="absolute" display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h5" fontWeight={700}>{stats.done}</Typography>
              <Typography variant="caption" color="text.secondary">solved</Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 0, display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {hasDifficultyData ? difficultyDistribution.map(({ name, value }) => (
                <Box key={name} display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[name] }} />
                  <Typography variant="caption" color="text.secondary">{name}: {value}</Typography>
                </Box>
              )) : (
                <Typography variant="caption" color="text.secondary">No data yet</Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1.5} px={0.5} justifyContent="center" height="100%">
            {statusDistribution.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">No questions yet</Typography>
            ) : (
              statusDistribution.map(({ name, value }) => {
                const total = statusDistribution.reduce((s, d) => s + d.value, 0);
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return (
                  <Box key={name}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" fontWeight={500}>{name}</Typography>
                      <Typography variant="caption" color="text.secondary">{value} · {pct}%</Typography>
                    </Box>
                    <Box sx={{ height: 5, bgcolor: 'action.hover', borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%', width: `${pct}%`, borderRadius: 2,
                        bgcolor: name === 'Done' ? 'success.main' : name === 'In Progress' ? 'info.main' : name === 'Revision Required' ? 'error.main' : 'text.secondary',
                      }} />
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Box>
    </Panel>
  );
}

/** @deprecated use ActivityChart + BreakdownChart in PageSplit */
export default function ProgressCharts() {
  return null;
}
