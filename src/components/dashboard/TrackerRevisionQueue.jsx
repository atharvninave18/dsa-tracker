import { Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate, isOverdue } from '../../utils/helpers';
import Panel from '../common/Panel';

export default function TrackerRevisionQueue({ revisionQueue }) {
  return (
    <Panel
      title="Revision queue"
      subtitle={revisionQueue.length > 0 ? `${revisionQueue.length} due` : 'All caught up'}
    >
      {revisionQueue.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No revisions scheduled.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={0}>
          {revisionQueue.slice(0, 8).map((q) => {
            const overdue = q.nextReviewDate && isOverdue(q.nextReviewDate);
            return (
              <Box
                key={q.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1.25,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                  ...(overdue && { borderLeft: '2px solid', borderLeftColor: 'warning.main', pl: 1, ml: -1 }),
                }}
              >
                <Box flex={1} minWidth={0}>
                  {q.link ? (
                    <Link href={q.link} target="_blank" rel="noopener noreferrer" underline="hover" color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500, display: 'block' }} noWrap>
                      {q.name}
                    </Link>
                  ) : (
                    <Typography variant="body2" fontWeight={500} noWrap>{q.name}</Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {q.topic}
                    {q.nextReviewDate && ` · ${overdue ? 'Overdue · ' : ''}${formatDate(q.nextReviewDate)}`}
                  </Typography>
                </Box>
                {q.status === 'revise' && (
                  <Typography variant="caption" color="warning.main" sx={{ flexShrink: 0 }}>Revise</Typography>
                )}
              </Box>
            );
          })}
          {revisionQueue.length > 8 && (
            <Typography
              component={RouterLink}
              to="/questions?filter=review"
              variant="caption"
              color="primary.light"
              sx={{ pt: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              View all {revisionQueue.length} →
            </Typography>
          )}
        </Box>
      )}
    </Panel>
  );
}
