import { Box, Typography, Link } from '@mui/material';
import Panel from '../common/Panel';
import { formatDateTime } from '../../utils/helpers';

export default function RecentActivity({ recentlySolved, revisionQueue }) {
  const hasActivity = recentlySolved.length > 0 || revisionQueue.length > 0;

  return (
    <Panel title="Recent activity" subtitle="Latest updates">
      {!hasActivity ? (
        <Typography variant="body2" color="text.secondary">
          Mark questions as done to see activity here.
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {revisionQueue.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: '0.06em', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                Due for review
              </Typography>
              {revisionQueue.slice(0, 3).map((q) => (
                <ActivityRow key={q.id} question={q} meta={q.topic} />
              ))}
            </Box>
          )}

          {recentlySolved.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: '0.06em', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                Recently solved
              </Typography>
              {recentlySolved.map((q) => (
                <ActivityRow key={q.id} question={q} meta={formatDateTime(q.solvedAt)} />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Panel>
  );
}

function ActivityRow({ question, meta }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.75,
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
      }}
    >
      <Box flex={1} minWidth={0}>
        {question.link ? (
          <Link href={question.link} target="_blank" rel="noopener noreferrer" underline="hover" color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500, display: 'block' }} noWrap>
            {question.name}
          </Link>
        ) : (
          <Typography variant="body2" fontWeight={500} noWrap>{question.name}</Typography>
        )}
        <Typography variant="caption" color="text.secondary">{meta}</Typography>
      </Box>
    </Box>
  );
}
