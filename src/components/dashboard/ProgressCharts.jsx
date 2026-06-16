import { useState } from 'react';
import { Box, Typography } from '@mui/material';
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
import { useTracker } from '../../context/TrackerContext';
import { getTrackerColors } from '../../theme/colors';
import Panel from '../common/Panel';

const STATUS_COLORS = {
  Pending: 'textMuted',
  Done: 'green',
  'Done + Revise': 'amber',
  Flagged: 'blue',
};

export function ActivityChart() {
  const theme = useTheme();
  const { dailySolved } = useTracker();
  const c = getTrackerColors(theme.palette.mode);
  const gridColor = theme.palette.divider;
  const mutedColor = theme.palette.text.secondary;

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
            <Bar dataKey="count" fill={c.accent} radius={[4, 4, 0, 0]} name="Solved" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Panel>
  );
}

export function BreakdownChart() {
  const theme = useTheme();
  const { statusDistribution, stats } = useTracker();
  const c = getTrackerColors(theme.palette.mode);
  const gridColor = theme.palette.divider;

  const pieData = statusDistribution.length > 0 ? statusDistribution : [{ name: 'Pending', value: 1 }];
  const PIE_COLORS = {
    Pending: c.textMuted,
    Done: c.green,
    'Done + Revise': c.amber,
    Flagged: c.blue,
  };

  return (
    <Panel title="Breakdown" subtitle="Status distribution" sx={{ height: '100%' }}>
      <Box height={240} display="flex" flexDirection="column" justifyContent="center" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="center" height={160} position="relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={PIE_COLORS[entry.name] || c.bg4} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <Box position="absolute" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" fontWeight={700}>{stats.done + stats.revise}</Typography>
            <Typography variant="caption" color="text.secondary">completed</Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1.5} flexWrap="wrap" justifyContent="center">
          {statusDistribution.map(({ name, value }) => (
            <Box key={name} display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: PIE_COLORS[name] }} />
              <Typography variant="caption" color="text.secondary">{name}: {value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  );
}

export default function ProgressCharts() {
  return null;
}
