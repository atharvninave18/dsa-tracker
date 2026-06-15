import { memo, useState } from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Link,
  Select,
  MenuItem,
  TextField,
  Box,
  Collapse,
  Tooltip,
  Typography,
} from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReactMarkdown from 'react-markdown';
import StatusBadge from '../common/StatusBadge';
import DifficultyBadge from '../common/DifficultyBadge';
import { STATUSES, DIFFICULTIES } from '../../constants';
import { formatDate, isOverdue } from '../../utils/helpers';

const QuestionRow = memo(function QuestionRow({
  question,
  selected,
  onToggleSelect,
  onUpdate,
  onEdit,
  onDelete,
  rowIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
}) {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(question.reviewDate) && question.status !== 'Done';

  return (
    <>
      <TableRow
        hover
        selected={selected}
        draggable
        onDragStart={() => onDragStart?.(rowIndex)}
        onDragOver={(e) => onDragOver?.(e, rowIndex)}
        onDragEnd={onDragEnd}
        sx={overdue ? { boxShadow: 'inset 2px 0 0 #dc2626' } : undefined}
      >
        <TableCell padding="checkbox" sx={{ width: 48 }}>
          <Checkbox size="small" checked={selected} onChange={() => onToggleSelect(question.id)} />
        </TableCell>

        <TableCell sx={{ minWidth: 200 }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <IconButton
              size="small"
              onClick={() => onUpdate(question.id, { isFavorite: !question.isFavorite })}
              sx={{ mt: -0.25, opacity: question.isFavorite ? 1 : 0.4, '&:hover': { opacity: 1 } }}
            >
              {question.isFavorite ? <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
            </IconButton>
            <Box minWidth={0}>
              {question.link ? (
                <Link
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  color="text.primary"
                  sx={{ fontWeight: 500, fontSize: '0.875rem', display: 'block' }}
                >
                  {question.name}
                </Link>
              ) : (
                <Typography variant="body2" fontWeight={500}>{question.name}</Typography>
              )}
              <Typography variant="caption" color="text.secondary">{question.platform}</Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell sx={{ width: 140 }}>
          <Select
            size="small"
            value={question.status}
            onChange={(e) => onUpdate(question.id, { status: e.target.value })}
            variant="outlined"
            renderValue={(v) => <StatusBadge status={v} />}
            sx={{
              minWidth: 130,
              '& .MuiOutlinedInput-notchedOutline': { border: 0 },
              '& .MuiSelect-select': { py: 0.5, px: 0 },
            }}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}><StatusBadge status={s} /></MenuItem>
            ))}
          </Select>
        </TableCell>

        <TableCell sx={{ width: 100 }}>
          <Select
            size="small"
            value={question.difficulty}
            onChange={(e) => onUpdate(question.id, { difficulty: e.target.value })}
            variant="outlined"
            renderValue={(v) => <DifficultyBadge difficulty={v} />}
            sx={{
              minWidth: 90,
              '& .MuiOutlinedInput-notchedOutline': { border: 0 },
              '& .MuiSelect-select': { py: 0.5, px: 0 },
            }}
          >
            {DIFFICULTIES.map((d) => (
              <MenuItem key={d} value={d}><DifficultyBadge difficulty={d} /></MenuItem>
            ))}
          </Select>
        </TableCell>

        <TableCell sx={{ width: 130 }}>
          <TextField
            type="date"
            size="small"
            variant="outlined"
            value={question.reviewDate ? question.reviewDate.slice(0, 10) : ''}
            onChange={(e) =>
              onUpdate(question.id, { reviewDate: e.target.value ? new Date(e.target.value).toISOString() : '' })
            }
            sx={{
              width: 130,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
              '& input': { fontSize: '0.8125rem', color: overdue ? 'error.main' : undefined, py: 0.75 },
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 160 }}>
            {question.tags.join(', ') || '—'}
          </Typography>
        </TableCell>

        <TableCell align="right" sx={{ width: 100, whiteSpace: 'nowrap' }}>
          {question.link && (
            <Tooltip title="Open">
              <IconButton size="small" component={Link} href={question.link} target="_blank" rel="noopener noreferrer">
                <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="small" onClick={() => onEdit(question)}>
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(question.id)}>
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          {question.notes && (
            <Typography
              component="button"
              variant="caption"
              onClick={() => setExpanded(!expanded)}
              sx={{ ml: 0.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              {expanded ? 'Hide' : 'Notes'}
            </Typography>
          )}
        </TableCell>
      </TableRow>

      {question.notes && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0, borderBottom: expanded ? undefined : 'none' }}>
            <Collapse in={expanded}>
              <Box sx={{ py: 2, pl: 7, pr: 2, bgcolor: 'background.default', borderRadius: 1, my: 1 }}>
                <ReactMarkdown>{question.notes}</ReactMarkdown>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Updated {formatDate(question.lastUpdated)}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

export default QuestionRow;
