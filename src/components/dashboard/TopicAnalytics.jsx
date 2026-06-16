import { Box, Typography, LinearProgress } from '@mui/material';
import Panel from '../common/Panel';

export default function TopicAnalytics({ groupedSectionsAll }) {
  const sections = groupedSectionsAll.filter((s) => s.total > 0);

  return (
    <Panel title="Topic progress" subtitle="All patterns on the sheet">
      {sections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Loading topics…</Typography>
      ) : (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
          {sections.map((s) => {
            const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
            return (
              <Box key={s.key}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '75%' }}>{s.group}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.done}/{s.total}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 5,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: pct === 100 ? 'success.main' : 'primary.main',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Panel>
  );
}
