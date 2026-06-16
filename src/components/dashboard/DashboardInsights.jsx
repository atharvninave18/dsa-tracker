import { Box, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import Panel from '../common/Panel';

const TYPE_COLOR = {
  success: 'success.main',
  warning: 'warning.main',
  info: 'text.secondary',
};

export default function DashboardInsights({ insights }) {
  return (
    <Panel title="Insights" subtitle="Personalized tips">
      {insights.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Keep solving to unlock insights.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {insights.map((item, i) => {
            const text = typeof item === 'string' ? item : item.text;
            const type = typeof item === 'string' ? 'info' : item.type;
            return (
              <Box key={i} display="flex" gap={1.25} alignItems="flex-start">
                <LightbulbOutlinedIcon sx={{ fontSize: 16, color: TYPE_COLOR[type] || 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" lineHeight={1.5}>
                  {text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Panel>
  );
}
