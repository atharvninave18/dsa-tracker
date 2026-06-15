import { Box, Typography, LinearProgress } from '@mui/material';
import Panel from '../common/Panel';

const PLATFORM_COLORS = {
  LeetCode: '#ffa116',
  GFG: '#2f8d46',
  Codeforces: '#1890ff',
  HackerRank: '#00ea64',
  Custom: '#71717a',
};

export default function PlatformBreakdown({ platformStats, total }) {
  if (platformStats.length === 0) {
    return (
      <Panel title="Platforms" subtitle="Where you practice">
        <Typography variant="body2" color="text.secondary">No data yet.</Typography>
      </Panel>
    );
  }

  return (
    <Panel title="Platforms" subtitle="Question distribution">
      <Box display="flex" flexDirection="column" gap={1.5}>
        {platformStats.map(({ name, value }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          const color = PLATFORM_COLORS[name] || PLATFORM_COLORS.Custom;
          return (
            <Box key={name}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Box display="flex" alignItems="center" gap={0.75}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="body2">{name}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{value} · {pct}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': { bgcolor: color },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Panel>
  );
}
