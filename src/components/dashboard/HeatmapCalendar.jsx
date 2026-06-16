import { useMemo } from 'react';
import { Typography, Box, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useThemeMode } from '../../context/ThemeContext';
import { getTrackerColors } from '../../theme/colors';
import { buildHeatmapGrid } from '../../utils/helpers';
import Panel from '../common/Panel';

function getHeatmapLevels(isDark) {
  const c = getTrackerColors(isDark ? 'dark' : 'light');
  return [
    isDark ? c.bg3 : c.bg4,
    alphaGreen(c.green, 0.25),
    alphaGreen(c.green, 0.45),
    alphaGreen(c.green, 0.65),
    c.green,
  ];
}

function alphaGreen(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const GAP = 3;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getLevel(count, isDark) {
  const palette = getHeatmapLevels(isDark);
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

  const palette = getHeatmapLevels(isDark);
  const c = getTrackerColors(isDark ? 'dark' : 'light');

  return (
    <Panel
      title="Activity heatmap"
      subtitle={`${total} problem${total !== 1 ? 's' : ''} solved in the last year`}
      noPadding
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 }, width: '100%' }}>
        <Box sx={{ width: '100%', minWidth: 0 }}>
          {/* Month labels row */}
          <Box
            sx={{
              display: 'flex',
              ml: { xs: '24px', sm: '28px' },
              mb: 0.75,
              height: 14,
              width: 'calc(100% - 28px)',
            }}
          >
            {monthLabels.map((label, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  minWidth: 0,
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

          <Box sx={{ display: 'flex', width: '100%' }}>
            {/* Day-of-week labels */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${GAP}px`,
                mr: 1,
                flexShrink: 0,
                pt: `${GAP / 2}px`,
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    minHeight: 10,
                    maxHeight: 16,
                    fontSize: '9px',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: { xs: 18, sm: 22 },
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            {/* Grid: columns = weeks, rows = Sun–Sat — stretches to full width */}
            <Box sx={{ display: 'flex', gap: `${GAP}px`, flex: 1, minWidth: 0 }}>
              {weeks.map((week, wi) => (
                <Box
                  key={wi}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${GAP}px`,
                  }}
                >
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
                          width: '100%',
                          aspectRatio: '1',
                          maxHeight: 16,
                          borderRadius: '2px',
                          bgcolor: day ? getLevel(day.count, isDark) : 'transparent',
                          outline: day && day.count === 0 && isDark ? `1px solid ${c.bg4}` : 'none',
                          cursor: day ? 'pointer' : 'default',
                          transition: 'outline 0.1s, transform 0.1s',
                          '&:hover': day
                            ? { outline: `1px solid ${c.textMuted}`, transform: 'scale(1.15)' }
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
                sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color }}
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
