import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import Panel from '../common/Panel';

export default function SectionProgress({ sections }) {
  if (sections.length === 0) {
    return (
      <Panel title="Section progress" subtitle="By topic & pattern">
        <Typography variant="body2" color="text.secondary">
          Complete questions to see which topics need work.
        </Typography>
      </Panel>
    );
  }

  return (
    <Panel title="Section progress" subtitle="Areas that need the most work">
      <Box display="flex" flexDirection="column" gap={2}>
        {sections.map((section) => (
          <Box key={section.key}>
            <Box display="flex" alignItems="center" gap={1} mb={0.75}>
              <Chip
                label="Topic"
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.625rem', fontWeight: 600 }}
              />
              <Typography variant="body2" fontWeight={500} noWrap flex={1}>
                {section.group}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {section.done}/{section.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={section.pct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  bgcolor: section.pct === 100 ? 'success.main' : section.pct < 30 ? 'error.main' : 'text.primary',
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Panel>
  );
}
