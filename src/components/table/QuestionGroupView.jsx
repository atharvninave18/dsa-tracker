import { memo, useMemo, useState } from 'react';
import { Box, Typography, IconButton, Collapse, Chip, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import QuestionListItem from './QuestionListItem';

const SectionBlock = memo(function SectionBlock({
  section,
  selectedSet,
  onToggleSelect,
  onUpdate,
  onNotes,
  onDelete,
  defaultOpen,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const pct = section.total > 0 ? Math.round((section.done / section.total) * 100) : 0;
  const isPattern = section.groupType === 'pattern';

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          bgcolor: 'background.default',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <IconButton size="small" sx={{ p: 0.25 }} onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>

        <Chip
          label={isPattern ? 'Pattern' : 'Topic'}
          size="small"
          variant="outlined"
          sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600 }}
        />

        <Typography variant="subtitle2" fontWeight={600} flex={1}>
          {section.group}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 48, textAlign: 'right' }}>
          {section.done}/{section.total}
        </Typography>

        <Box sx={{ width: 64, display: { xs: 'none', sm: 'block' } }}>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 4 }} />
        </Box>
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          {section.questions.map((q) => (
            <QuestionListItem
              key={q.id}
              question={q}
              selected={selectedSet.has(q.id)}
              onToggleSelect={onToggleSelect}
              onUpdate={onUpdate}
              onNotes={onNotes}
              onDelete={onDelete}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
});

function QuestionGroupView({
  groupedSections,
  selectedIds,
  onToggleSelect,
  onUpdate,
  onNotes,
  onDelete,
}) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  if (groupedSections.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No questions to display
      </Typography>
    );
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {groupedSections.map((section, i) => (
        <SectionBlock
          key={section.key}
          section={section}
          selectedSet={selectedSet}
          onToggleSelect={onToggleSelect}
          onUpdate={onUpdate}
          onNotes={onNotes}
          onDelete={onDelete}
          defaultOpen={i === 0}
        />
      ))}
    </Box>
  );
}

export default memo(QuestionGroupView);
