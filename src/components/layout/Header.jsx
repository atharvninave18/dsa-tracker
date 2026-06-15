import { Box, Typography, IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useThemeMode } from '../../context/ThemeContext';

export default function Header({ tab, onTabChange, onImportExport, onPomodoro }) {
  const { isDark, toggleMode } = useThemeMode();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1, flexShrink: 0 }}>
          DSA Tracker
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={tab}
          onChange={(_, v) => v && onTabChange(v)}
          size="small"
          sx={{
            bgcolor: 'background.default',
            p: 0.5,
            borderRadius: 2,
            '& .MuiToggleButton-root': {
              border: 0,
              px: 2,
              py: 0.75,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              },
            },
          }}
        >
          <ToggleButton value="dashboard">Overview</ToggleButton>
          <ToggleButton value="questions">Questions</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 0.25 }}>
          <Tooltip title="Pomodoro">
            <IconButton size="small" onClick={onPomodoro}><TimerOutlinedIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Import / Export">
            <IconButton size="small" onClick={onImportExport}><UploadFileOutlinedIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Toggle theme">
            <IconButton size="small" onClick={toggleMode}>
              {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
