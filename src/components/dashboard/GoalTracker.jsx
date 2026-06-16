import { Typography, Box, LinearProgress, TextField } from '@mui/material';
import { useTracker } from '../../context/TrackerContext';
import Panel from '../common/Panel';

export default function GoalTracker() {
  const { goals, stats, periodStats, setGoals } = useTracker();
  const sheetProgress = goals.sheetTarget > 0 ? Math.min(100, Math.round(((stats.done + stats.revise) / goals.sheetTarget) * 100)) : 0;
  const weeklyProgress = goals.weeklyTarget > 0 ? Math.min(100, Math.round((periodStats.weekly / goals.weeklyTarget) * 100)) : 0;

  return (
    <Panel title="Goals" subtitle="Weekly & sheet targets">
      <Box mb={2.5}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" fontWeight={500}>This week</Typography>
          <Typography variant="caption" color="text.secondary">{periodStats.weekly} / {goals.weeklyTarget}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={weeklyProgress} sx={{ height: 6, borderRadius: 3, mb: 1.5 }} />
        <TextField
          label="Weekly target"
          type="number"
          size="small"
          value={goals.weeklyTarget}
          onChange={(e) => setGoals({ weeklyTarget: parseInt(e.target.value, 10) || 0 })}
          sx={{ width: 120 }}
        />
      </Box>

      <Box>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" fontWeight={500}>Full sheet</Typography>
          <Typography variant="caption" color="text.secondary">{stats.done + stats.revise} / {goals.sheetTarget}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={sheetProgress} sx={{ height: 6, borderRadius: 3, mb: 1.5 }} />
        <TextField
          label="Sheet target"
          type="number"
          size="small"
          value={goals.sheetTarget}
          onChange={(e) => setGoals({ sheetTarget: parseInt(e.target.value, 10) || 0 })}
          sx={{ width: 120 }}
        />
      </Box>
    </Panel>
  );
}
