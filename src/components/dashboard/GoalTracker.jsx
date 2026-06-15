import { Typography, Box, LinearProgress, TextField, Select, MenuItem, FormControl } from '@mui/material';
import { useDsa } from '../../context/DsaContext';
import { PLATFORMS } from '../../constants';
import Panel from '../common/Panel';

export default function GoalTracker() {
  const { goals, stats, dispatch } = useDsa();
  const progress = goals.target > 0 ? Math.min(100, Math.round((stats.done / goals.target) * 100)) : 0;
  const remaining = Math.max(0, goals.target - stats.done);

  return (
    <Panel title="Goal" subtitle="Track your target">
      <Box display="flex" alignItems="baseline" gap={0.5} mb={0.5}>
        <Typography variant="h3" fontWeight={700} letterSpacing="-0.03em">{stats.done}</Typography>
        <Typography variant="body1" color="text.secondary">/ {goals.target}</Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        {remaining === 0 ? 'Target reached' : `${remaining} remaining`} on {goals.platform}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          mb: 2,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            bgcolor: progress >= 100 ? 'success.main' : 'text.primary',
            borderRadius: 4,
          },
        }}
      />

      <Box display="flex" gap={1.5}>
        <TextField
          label="Target"
          type="number"
          size="small"
          value={goals.target}
          onChange={(e) => dispatch({ type: 'SET_GOALS', payload: { target: parseInt(e.target.value, 10) || 0 } })}
          sx={{ width: 90 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={goals.platform}
            onChange={(e) => dispatch({ type: 'SET_GOALS', payload: { platform: e.target.value } })}
            displayEmpty
          >
            {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    </Panel>
  );
}
