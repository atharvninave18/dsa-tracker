/** Shared grid layout for question list header + rows */
export const QUESTION_ROW_MIN_WIDTH = 860;

export const QUESTION_ROW_GRID = {
  display: { xs: 'none', md: 'grid' },
  gridTemplateColumns: '36px 36px minmax(220px, 1fr) 136px 92px 132px 112px',
  alignItems: 'center',
  columnGap: 2,
  px: 2,
};

export const QUESTION_ROW_GRID_MOBILE = {
  display: { xs: 'flex', md: 'none' },
  flexDirection: 'column',
  gap: 1.5,
  px: 2,
  py: 1.5,
};
