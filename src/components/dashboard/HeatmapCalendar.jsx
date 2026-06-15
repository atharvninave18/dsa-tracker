import { useMemo } from 'react';
import { Typography, Box, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useThemeMode } from '../../context/ThemeContext';
import { buildHeatmapGrid } from '../../utils/helpers';
import Panel from '../common/Panel';

// GitHub contribution graph colors
const LEVELS_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const LEVELS_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

const CELL = 11;
const GAP = 3;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getLevel(count, isDark) {
  const palette = isDark ? LEVELS_DARK : LEVELS_LIGHT;
  if (count === 0) return palette[0];
  if (count === 1) return palette[1];
  if (count === 2) return palette[2];
  if (count <= 4) return palette[3];
  return palette[4];
}

function contributionLabel(count) {
  if (count === 0) return 'No problems solved';
  if (count === 1) return '1 problem solved';
  return `${count} problems solved`;
}

export default function HeatmapCalendar({ questions }) {
  const { isDark } = useThemeMode();

  const { weeks, monthLabels, total } = useMemo(
    () => buildHeatmapGrid(questions),
    [questions]
  );

  const palette = isDark ? LEVELS_DARK : LEVELS_LIGHT;

  return (
    <Panel
      title="Contributions"
      subtitle={`${total} problem${total !== 1 ? 's' : ''} solved in the last year`}
      noPadding
    >
      <Box sx={{ p: 2.5, overflowX: 'auto' }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', minWidth: 'max-content' }}>
          {/* Month labels row */}
          <Box sx={{ display: 'flex', ml: '28px', mb: 0.75, height: 14 }}>
            {monthLabels.map((label, i) => (
              <Box
                key={i}
                sx={{
                  width: CELL + GAP,
                  fontSize: '10px',
                  color: 'text.secondary',
                  lineHeight: 1,
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex' }}>
            {/* Day-of-week labels (Mon, Wed, Fri) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${GAP}px`,
                mr: 1,
                pt: `${GAP / 2}px`,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <Box
                  key={i}
                  sx={{
                    height: CELL,
                    fontSize: '9px',
                    color: 'text.secondary',
                    lineHeight: `${CELL}px`,
                    textAlign: 'right',
                    width: 22,
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            {/* Grid: columns = weeks, rows = Sun–Sat */}
            <Box sx={{ display: 'flex', gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                  {week.map((day, di) => (
                    <Tooltip
                      key={di}
                      title={
                        day
                          ? `${contributionLabel(day.count)} on ${format(parseISO(day.date), 'EEEE, MMM d, yyyy')}`
                          : ''
                      }
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          width: CELL,
                          height: CELL,
                          borderRadius: '2px',
                          bgcolor: day ? getLevel(day.count, isDark) : 'transparent',
                          outline: day && day.count === 0 && isDark ? '1px solid #21262d' : 'none',
                          cursor: day ? 'pointer' : 'default',
                          transition: 'outline 0.1s',
                          '&:hover': day
                            ? { outline: `1px solid ${isDark ? '#8b949e' : '#1b1f2426'}` }
                            : {},
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Legend */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              mt: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, mr: 0.25 }}>
              Less
            </Typography>
            {palette.map((color) => (
              <Box
                key={color}
                sx={{ width: CELL, height: CELL, borderRadius: '2px', bgcolor: color }}
              />
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, ml: 0.25 }}>
              More
            </Typography>
          </Box>
        </Box>
      </Box>
    </Panel>
  );
}
