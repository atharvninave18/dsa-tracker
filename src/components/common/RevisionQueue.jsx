import { Typography, Box, Link, Chip } from '@mui/material';
import { formatDate, isOverdue } from '../../utils/helpers';
import Panel from './Panel';
import DifficultyBadge from './DifficultyBadge';

export default function RevisionQueue({ revisionQueue }) {
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
            const overdue = isOverdue(q.reviewDate) && q.status !== 'Done';
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
                  ...(overdue && { borderLeft: '2px solid', borderLeftColor: 'error.main', pl: 1, ml: -1 }),
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
                  {q.reviewDate && (
                    <Typography variant="caption" color={overdue ? 'error.main' : 'text.secondary'}>
                      {overdue ? 'Overdue · ' : ''}{formatDate(q.reviewDate)}
                    </Typography>
                  )}
                </Box>
                <DifficultyBadge difficulty={q.difficulty} />
                {overdue && (
                  <Chip label="Due" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.625rem' }} />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Panel>
  );
}
