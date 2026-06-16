import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useThemeMode } from '../../context/ThemeContext';

const NAV = [
  { to: '/', label: 'Overview', exact: true },
  { to: '/questions', label: 'Questions', exact: false },
];

function isNavActive(pathname, to, exact) {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function Header({ onImportExport, onPomodoro }) {
  const { isDark, toggleMode } = useThemeMode();
  const { pathname } = useLocation();

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
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          height: 57,
        }}
      >
        <Typography
          component={Link}
          to="/"
          variant="subtitle1"
          fontWeight={700}
          sx={{
            mr: 1,
            flexShrink: 0,
            letterSpacing: '-0.3px',
            textDecoration: 'none',
            color: 'text.primary',
          }}
        >
          DSA{' '}
          <Box component="span" sx={{ color: 'primary.light' }}>
            Tracker
          </Box>
        </Typography>

        <Box
          sx={{
            display: 'flex',
            bgcolor: 'background.default',
            p: 0.5,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            gap: 0.25,
          }}
        >
          {NAV.map(({ to, label, exact }) => {
            const active = isNavActive(pathname, to, exact);
            return (
              <Button
                key={to}
                component={Link}
                to={to}
                size="small"
                sx={{
                  px: 2,
                  py: 0.75,
                  minWidth: 0,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  color: active ? 'primary.light' : 'text.secondary',
                  bgcolor: active ? 'action.selected' : 'transparent',
                  textDecoration: 'none',
                  '&:hover': {
                    bgcolor: active ? 'action.selected' : 'action.hover',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 0.25 }}>
          <Tooltip title="Pomodoro">
            <IconButton size="small" onClick={onPomodoro}>
              <TimerOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import / Export">
            <IconButton size="small" onClick={onImportExport}>
              <UploadFileOutlinedIcon fontSize="small" />
            </IconButton>
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
