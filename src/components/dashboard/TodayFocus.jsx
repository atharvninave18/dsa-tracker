import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import Panel from '../common/Panel';

export default function TodayFocus({ revisionQueue, weakestSections }) {
  const due = revisionQueue.length;
  const weak = weakestSections[0];

  return (
    <Panel title="Today's focus" subtitle="Suggested next steps">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
        {due > 0 && (
          <Chip
            component={Link}
            to="/questions?filter=review"
            clickable
            label={`${due} due for review`}
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        )}
        {weak && (
          <Chip
            component={Link}
            to={`/questions?topic=${encodeURIComponent(weak.group)}`}
            clickable
            label={`${weak.group} · ${weak.pct}% done`}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        )}
        {due === 0 && !weak && (
          <Typography variant="body2" color="text.secondary">
            You're caught up — pick a topic and keep going.
          </Typography>
        )}
      </Stack>
    </Panel>
  );
}
