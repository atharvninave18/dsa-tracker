import { useState } from 'react';
import { Box, Typography, LinearProgress, Tabs, Tab } from '@mui/material';
import Panel from '../common/Panel';

export default function TopicAnalytics({ topicStats, groupedSectionsAll }) {
  const [tab, setTab] = useState(0);

  const topicSections = groupedSectionsAll.filter((s) => s.groupType !== 'pattern');
  const patternSections = groupedSectionsAll.filter((s) => s.groupType === 'pattern');

  const renderSections = (sections) => {
    if (sections.length === 0) {
      return <Typography variant="body2" color="text.secondary">No sections yet.</Typography>;
    }
    return (
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        {sections.slice(0, 10).map((s) => {
          const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
          return (
            <Box key={s.key}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>{s.group}</Typography>
                <Typography variant="caption" color="text.secondary">{s.done}/{s.total}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 5,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: pct === 100 ? 'success.main' : 'text.primary',
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderTags = () => {
    const top = topicStats.slice(0, 10);
    if (top.length === 0) {
      return <Typography variant="body2" color="text.secondary">Add tags to see breakdown.</Typography>;
    }
    return (
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        {top.map(({ tag, total, done, pct }) => (
          <Box key={tag}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>{tag}</Typography>
              <Typography variant="caption" color="text.secondary">{done}/{total}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={pct} sx={{ height: 5 }} />
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Panel
      title="Progress breakdown"
      subtitle="Sections and tags"
      action={
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 32, mr: 1, '& .MuiTab-root': { minHeight: 32, py: 0, px: 1.5, fontSize: '0.75rem' } }}>
          <Tab label="Topics" />
          <Tab label="Patterns" />
          <Tab label="Tags" />
        </Tabs>
      }
    >
      {tab === 0 && renderSections(topicSections)}
      {tab === 1 && renderSections(patternSections)}
      {tab === 2 && renderTags()}
    </Panel>
  );
}
