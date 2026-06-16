import { useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTracker } from '../context/TrackerContext';
import QuestionsTracker from '../components/questions/QuestionsTracker';
import StatPill from '../components/common/StatPill';

export default function QuestionsPage() {
  const { searchRef } = useOutletContext();
  const { loading, stats } = useTracker();

  const pct = stats.total ? Math.round(((stats.done + stats.revise) / stats.total) * 100) : 0;

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {!loading && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            px: 3,
            py: 1.25,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <StatPill value={`${pct}%`} label="complete" />
          <StatPill value={stats.done} label="done" color="success.main" strongColor="success.main" />
          <StatPill value={stats.revise} label="to revise" color="warning.main" strongColor="warning.main" />
          <StatPill value={stats.flagged} label="flagged" color="info.main" strongColor="info.main" />
        </Box>
      )}

      <QuestionsTracker searchRef={searchRef} />
    </Box>
  );
}
