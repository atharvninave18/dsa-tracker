import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  Collapse,
  Stack,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useDsa } from '../../context/DsaContext';
import { STATUSES, DIFFICULTIES, PLATFORMS, TAGS, SORT_OPTIONS } from '../../constants';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import Panel from '../common/Panel';

export default function FilterBar({ searchRef }) {
  const { filters, sortBy, sortOrder, dispatch } = useDsa();
  const [expanded, setExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput, 200);

  const setFilter = (key, value) => dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });

  const resetFilters = () => {
    setSearchInput('');
    dispatch({ type: 'RESET_FILTERS' });
  };

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch({ type: 'SET_FILTERS', payload: { search: debouncedSearch } });
    }
  }, [debouncedSearch, filters.search, dispatch]);

  const activeCount =
    filters.status.length +
    filters.difficulty.length +
    filters.platform.length +
    filters.tags.length +
    (filters.favoritesOnly ? 1 : 0);

  return (
    <Panel noPadding sx={{ mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
          <TextField
            inputRef={searchRef}
            placeholder="Search questions..."
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
          />

          <Stack direction="row" spacing={1} flexShrink={0}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                value={sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: { sortBy: e.target.value, sortOrder } })}
              >
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                border: 1,
                borderColor: activeCount ? 'text.primary' : 'divider',
                borderRadius: 2,
                width: 36,
                height: 36,
              }}
            >
              <TuneIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>

        {activeCount > 0 && !expanded && (
          <Stack direction="row" spacing={1} mt={1.5} alignItems="center">
            <Typography variant="caption" color="text.secondary">{activeCount} filter{activeCount > 1 ? 's' : ''} active</Typography>
            <Button size="small" onClick={resetFilters} sx={{ minWidth: 0, px: 1 }}>
              Clear
            </Button>
          </Stack>
        )}

        <Collapse in={expanded}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={2} flexWrap="wrap" useFlexGap>
            {[
              { key: 'status', label: 'Status', options: STATUSES },
              { key: 'difficulty', label: 'Difficulty', options: DIFFICULTIES },
              { key: 'platform', label: 'Platform', options: PLATFORMS },
            ].map(({ key, label, options }) => (
              <FormControl key={key} size="small" sx={{ minWidth: 140 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                  multiple
                  label={label}
                  value={filters[key]}
                  onChange={(e) => setFilter(key, e.target.value)}
                  input={<OutlinedInput label={label} />}
                  renderValue={(sel) => sel.length ? `${sel.length} selected` : 'All'}
                >
                  {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            ))}

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                label="Tags"
                value={filters.tags}
                onChange={(e) => setFilter('tags', e.target.value)}
                input={<OutlinedInput label="Tags" />}
                renderValue={(sel) => sel.length ? `${sel.length} selected` : 'All'}
              >
                {TAGS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>

            <Chip
              label="Favorites"
              variant={filters.favoritesOnly ? 'filled' : 'outlined'}
              onClick={() => setFilter('favoritesOnly', !filters.favoritesOnly)}
              size="small"
            />

            {activeCount > 0 && (
              <Button size="small" startIcon={<CloseIcon />} onClick={resetFilters}>
                Reset
              </Button>
            )}
          </Stack>
        </Collapse>
      </Box>
    </Panel>
  );
}
