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
    { title: 'Total', value: stats.total, hint: 'On the sheet', icon: LibraryBooksIcon, color: 'text.secondary' },
    { title: 'Done', value: stats.done, hint: `${stats.completionPct}% complete`, icon: CheckCircleIcon, color: 'success.main', hintColor: 'success.main' },
    { title: 'Pending', value: stats.pending, hint: 'Not started', icon: HourglassEmptyIcon, color: 'info.main' },
  ];

  const rightStats = [
    { title: 'To revise', value: stats.revise, hint: stats.overdue > 0 ? `${stats.overdue} overdue` : 'On schedule', icon: AutorenewIcon, color: 'warning.main', hintColor: stats.overdue > 0 ? 'warning.main' : 'text.secondary' },
    { title: 'Streak', value: `${streak.current}d`, hint: `Best ${streak.longest}d`, icon: WhatshotIcon, color: 'warning.main' },
    { title: 'This week', value: periodStats.weekly, hint: `${periodStats.monthly} this month`, icon: CalendarMonthIcon, color: 'primary.light' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
      <Panel title="Progress" subtitle="Sheet stats">
        {leftStats.map((s) => <StatItem key={s.title} {...s} />)}
      </Panel>
      <Panel title="Activity" subtitle="Streak & schedule">
        {rightStats.map((s) => <StatItem key={s.title} {...s} />)}
      </Panel>
    </Box>
  );
}
