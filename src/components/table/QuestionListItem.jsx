import { memo, useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StatusBadge from '../common/StatusBadge';
import DifficultyBadge from '../common/DifficultyBadge';
import { STATUSES, DIFFICULTIES } from '../../constants';
import { isOverdue } from '../../utils/helpers';
import { QUESTION_ROW_GRID, QUESTION_ROW_GRID_MOBILE } from './questionRowLayout';

const dateInputSx = {
  width: '100%',
  maxWidth: 132,
  fontSize: '0.8125rem',
  py: 0.625,
  px: 1,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: 'background.paper',
  fontFamily: 'inherit',
  cursor: 'pointer',
  '&:focus': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 1,
  },
};

function StatusCell({ status, onSelect }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', '&:hover': { opacity: 0.85 } }}
      >
        <StatusBadge status={status} />
      </Box>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {STATUSES.map((s) => (
          <MenuItem key={s} selected={s === status} onClick={() => { onSelect(s); setAnchor(null); }}>
            <StatusBadge status={s} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function DifficultyCell({ difficulty, onSelect }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', '&:hover': { opacity: 0.85 } }}
      >
        <DifficultyBadge difficulty={difficulty} />
      </Box>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {DIFFICULTIES.map((d) => (
          <MenuItem key={d} selected={d === difficulty} onClick={() => { onSelect(d); setAnchor(null); }}>
            <DifficultyBadge difficulty={d} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function ActionButtons({ question, onDelete, onNotes }) {
  const hasNotes = Boolean(question.notes?.trim());

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.25}>
      {question.link && (
        <Tooltip title="Open">
          <IconButton size="small" component={Link} href={question.link} target="_blank" rel="noopener noreferrer">
            <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={hasNotes ? 'Edit notes' : 'Add notes'}>
        <IconButton
          size="small"
          onClick={() => onNotes(question)}
          sx={{
            opacity: hasNotes ? 1 : 0.45,
            color: hasNotes ? 'primary.main' : 'text.secondary',
            '&:hover': { opacity: 1 },
          }}
        >
          <StickyNote2OutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => onDelete(question.id)}><DeleteOutlinedIcon sx={{ fontSize: 16 }} /></IconButton>
      </Tooltip>
    </Box>
  );
}

const QuestionListItem = memo(function QuestionListItem({
  question,
  selected,
  onToggleSelect,
  onUpdate,
  onNotes,
  onDelete,
}) {
  const status = STATUSES.includes(question.status) ? question.status : 'Pending';
  const difficulty = DIFFICULTIES.includes(question.difficulty) ? question.difficulty : 'Medium';
  const overdue = isOverdue(question.reviewDate) && status !== 'Done';
  const reviewValue = question.reviewDate ? question.reviewDate.slice(0, 10) : '';

  const rowSx = {
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: selected ? 'action.selected' : 'transparent',
    transition: 'background-color 0.15s',
    '&:hover': { bgcolor: selected ? 'action.selected' : 'action.hover' },
    ...(overdue && { boxShadow: 'inset 3px 0 0 #dc2626' }),
  };

  return (
    <Box sx={rowSx}>
      {/* Desktop: aligned grid row */}
      <Box sx={{ ...QUESTION_ROW_GRID, py: 1.25 }}>
        <Box display="flex" justifyContent="center">
          <Checkbox size="small" checked={selected} onChange={() => onToggleSelect(question.id)} sx={{ p: 0.5 }} />
        </Box>

        <Box display="flex" justifyContent="center">
          <IconButton
            size="small"
            onClick={() => onUpdate(question.id, { isFavorite: !question.isFavorite })}
            sx={{ p: 0.5, opacity: question.isFavorite ? 1 : 0.35, '&:hover': { opacity: 1 } }}
          >
            {question.isFavorite ? <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Box>

        <Box minWidth={0} pr={1}>
          {question.link ? (
            <Link
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="text.primary"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {question.name}
            </Link>
          ) : (
            <Typography
              variant="body2"
              fontWeight={500}
              noWrap
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {question.name}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            {question.platform}
          </Typography>
        </Box>

        <StatusCell status={status} onSelect={(s) => onUpdate(question.id, { status: s })} />

        <DifficultyCell difficulty={difficulty} onSelect={(d) => onUpdate(question.id, { difficulty: d })} />

        <Box display="flex" justifyContent="center">
          <Box
            component="input"
            type="date"
            value={reviewValue}
            onChange={(e) => onUpdate(question.id, { reviewDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            sx={{ ...dateInputSx, color: overdue ? 'error.main' : 'text.primary' }}
          />
        </Box>

        <ActionButtons question={question} onDelete={onDelete} onNotes={onNotes} />
      </Box>

      {/* Mobile: stacked card row */}
      <Box sx={QUESTION_ROW_GRID_MOBILE}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Checkbox size="small" checked={selected} onChange={() => onToggleSelect(question.id)} sx={{ p: 0.5, mt: -0.25 }} />
          <IconButton
            size="small"
            onClick={() => onUpdate(question.id, { isFavorite: !question.isFavorite })}
            sx={{ p: 0.5, mt: -0.25, opacity: question.isFavorite ? 1 : 0.35 }}
          >
            {question.isFavorite ? <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
          </IconButton>
          <Box flex={1} minWidth={0}>
            {question.link ? (
              <Link href={question.link} target="_blank" rel="noopener noreferrer" underline="hover" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {question.name}
              </Link>
            ) : (
              <Typography variant="body2" fontWeight={500}>{question.name}</Typography>
            )}
            <Typography variant="caption" color="text.secondary">{question.platform}</Typography>
          </Box>
          <ActionButtons question={question} onDelete={onDelete} onNotes={onNotes} />
        </Box>
        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" pl={6.5}>
          <StatusCell status={status} onSelect={(s) => onUpdate(question.id, { status: s })} />
          <DifficultyCell difficulty={difficulty} onSelect={(d) => onUpdate(question.id, { difficulty: d })} />
          <Box
            component="input"
            type="date"
            value={reviewValue}
            onChange={(e) => onUpdate(question.id, { reviewDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            sx={{ ...dateInputSx, color: overdue ? 'error.main' : 'text.primary' }}
          />
        </Box>
      </Box>
    </Box>
  );
});

export default QuestionListItem;
