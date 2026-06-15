import { Box, Typography } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooksOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmptyOutlined';
import AutorenewIcon from '@mui/icons-material/AutorenewOutlined';
import WhatshotIcon from '@mui/icons-material/WhatshotOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import Panel from '../common/Panel';

function StatItem({ title, value, hint, icon: Icon, color, hintColor }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        py: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.25, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        {hint && (
          <Typography variant="caption" color={hintColor || 'text.secondary'} sx={{ mt: 0.25, display: 'block' }}>
            {hint}
          </Typography>
        )}
      </Box>
      <Box sx={{ color, opacity: 0.85, pt: 0.5 }}>
        <Icon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}

export default function StatCards({ stats, streak, periodStats }) {
  const leftStats = [
    { title: 'Total', value: stats.total, hint: 'In your list', icon: LibraryBooksIcon, color: '#71717a' },
    { title: 'Solved', value: stats.done, hint: `${stats.completionPct}% complete`, icon: CheckCircleIcon, color: '#16a34a', hintColor: 'success.main' },
    { title: 'Pending', value: stats.pending, hint: 'Not started', icon: HourglassEmptyIcon, color: '#2563eb' },
  ];

  const rightStats = [
    { title: 'Revision', value: stats.revision, hint: stats.overdue > 0 ? `${stats.overdue} overdue` : 'Up to date', icon: AutorenewIcon, color: '#dc2626', hintColor: stats.overdue > 0 ? 'error.main' : 'text.secondary' },
    { title: 'Streak', value: `${streak.current}d`, hint: `Best ${streak.longest}d`, icon: WhatshotIcon, color: '#ea580c' },
    { title: 'This week', value: periodStats.weekly, hint: `${periodStats.monthly} this month`, icon: CalendarMonthIcon, color: '#8b5cf6' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2.5,
      }}
    >
      <Panel title="Progress" subtitle="Overall stats">
        {leftStats.map((s) => <StatItem key={s.title} {...s} />)}
      </Panel>
      <Panel title="Activity" subtitle="Streak & schedule">
        {rightStats.map((s) => <StatItem key={s.title} {...s} />)}
      </Panel>
    </Box>
  );
}
