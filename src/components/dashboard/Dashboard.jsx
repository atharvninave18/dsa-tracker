import { Box } from '@mui/material';
import { useTracker } from '../../context/TrackerContext';
import { useToast } from '../../context/ToastContext';
import { PageFull, PageSplit, PageSectionTitle } from '../layout/PageGrid';
import DashboardHero from './DashboardHero';
import StatCards from './StatCards';
import { ActivityChart, BreakdownChart } from './ProgressCharts';
import HeatmapCalendar from './HeatmapCalendar';
import GoalTracker from './GoalTracker';
import TopicAnalytics from './TopicAnalytics';
import SectionProgress from './SectionProgress';
import RecentActivity from './RecentActivity';
import PlatformBreakdown from './PlatformBreakdown';
import DashboardInsights from './DashboardInsights';
import TrackerRevisionQueue from './TrackerRevisionQueue';
import TodayFocus from './TodayFocus';

export default function Dashboard() {
  const {
    stats,
    streak,
    periodStats,
    revisionQueue,
    questions,
    platformStats,
    groupedSectionsAll,
    recentlySolved,
    weakestSections,
    insights,
    pickRandom,
    loading,
  } = useTracker();
  const { showToast } = useToast();

  const handleRandomPick = () => {
    const q = pickRandom({ status: 'pending' });
    if (q) {
      showToast(`Try: ${q.name}`, 'info');
      if (q.link) window.open(q.link, '_blank');
    } else {
      showToast('No pending questions left — nice work!', 'success');
    }
  };

  if (loading) return null;

  return (
    <Box>
      <PageSectionTitle title="Overview" subtitle="Your DSA practice at a glance" />

      <PageFull>
        <DashboardHero
          stats={stats}
          streak={streak}
          periodStats={periodStats}
          revisionCount={revisionQueue.length}
          onRandomPick={handleRandomPick}
        />
      </PageFull>

      <PageFull>
        <HeatmapCalendar questions={questions} />
      </PageFull>

      <PageFull>
        <TodayFocus revisionQueue={revisionQueue} weakestSections={weakestSections} />
      </PageFull>

      <PageFull>
        <StatCards stats={stats} streak={streak} periodStats={periodStats} />
      </PageFull>

      <PageSplit left={<ActivityChart />} right={<BreakdownChart />} />

      <PageSplit left={<GoalTracker />} right={<DashboardInsights insights={insights} />} />

      <PageSplit
        left={<SectionProgress sections={weakestSections} />}
        right={<RecentActivity recentlySolved={recentlySolved} revisionQueue={revisionQueue} />}
      />

      <PageSplit
        left={<PlatformBreakdown platformStats={platformStats} total={stats.total} />}
        right={<TrackerRevisionQueue revisionQueue={revisionQueue} />}
      />

      {/* <PageFull sx={{ mb: 0 }}>
        <TopicAnalytics groupedSectionsAll={groupedSectionsAll} />
      </PageFull> */}
    </Box>
  );
}
