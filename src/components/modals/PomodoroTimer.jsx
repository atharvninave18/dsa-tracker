import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Stack,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import { POMODORO_DEFAULTS } from '../../constants';
import { loadPomodoroSettings } from '../../utils/storage';

export default function PomodoroTimer({ open, onClose }) {
  const [settings] = useState(() => loadPomodoroSettings() || POMODORO_DEFAULTS);
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('work');
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef(null);

  const totalSeconds = phase === 'work'
    ? settings.workMinutes * 60
    : phase === 'break'
      ? settings.breakMinutes * 60
      : settings.longBreakMinutes * 60;

  const advancePhase = useCallback(() => {
    if (phase === 'work') {
      setSessionCount((prev) => {
        const next = prev + 1;
        if (next % settings.sessionsBeforeLongBreak === 0) {
          setPhase('longBreak');
          setSecondsLeft(settings.longBreakMinutes * 60);
        } else {
          setPhase('break');
          setSecondsLeft(settings.breakMinutes * 60);
        }
        return next;
      });
    } else {
      setPhase('work');
      setSecondsLeft(settings.workMinutes * 60);
    }
  }, [phase, settings]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setPhase('work');
    setSessionCount(0);
    setSecondsLeft(settings.workMinutes * 60);
  }, [settings.workMinutes]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleRunning = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          advancePhase();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const phaseLabel = { work: 'Focus', break: 'Short Break', longBreak: 'Long Break' };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Pomodoro Timer
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" spacing={2} py={2}>
          <Typography variant="overline" color="text.secondary">
            {phaseLabel[phase]} · Session {sessionCount}
          </Typography>
          <Typography variant="h2" fontWeight={700} fontFamily="monospace">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </Typography>
          <Box width="100%">
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" onClick={toggleRunning} size="large">
              {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={reset}><RestartAltIcon /></IconButton>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
