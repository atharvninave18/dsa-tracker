import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Panel from '../common/Panel';

function RingProgress({ value, size = 80 }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.1} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" fontWeight={700} lineHeight={1}>{value}%</Typography>
      </Box>
    </Box>
  );
}

export default function DashboardHero({
  stats,
  streak,
  periodStats,
  revisionCount,
  onRandomPick,
}) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <Panel sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={2.5}>
          <Box color="primary.main"><RingProgress value={stats.completionPct} /></Box>
          <Box minWidth={0}>
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>{greeting}</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {stats.done + stats.revise} of {stats.total} completed
              {streak.current > 0 && ` · ${streak.current}d streak`}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={1.5}>
              <Button component={Link} to="/questions" variant="contained" size="small" startIcon={<MenuBookOutlinedIcon />}>
                Question bank
              </Button>
              <Button variant="outlined" size="small" startIcon={<ShuffleIcon />} onClick={onRandomPick}>
                Random
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            borderLeft: { md: 1 },
            borderColor: { md: 'divider' },
            pl: { md: 3 },
          }}
        >
          {[
            { label: 'Pending', value: stats.pending },
            { label: 'To revise', value: stats.revise },
            { label: 'Due review', value: revisionCount },
          ].map(({ label, value }) => (
            <Box key={label} textAlign="center">
              <Typography variant="h5" fontWeight={700}>{value}</Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
          <Box sx={{ gridColumn: '1 / -1', pt: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {periodStats.weekly} solved this week · {periodStats.monthly} this month
            </Typography>
          </Box>
        </Box>
      </Box>
    </Panel>
  );
}
