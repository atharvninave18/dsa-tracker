import { Box } from '@mui/material';
import { useDsa } from '../../context/DsaContext';
import { pickRandomQuestion } from '../../utils/helpers';
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
import RevisionQueue from '../common/RevisionQueue';

export default function Dashboard() {
  const {
    stats,
    streak,
    periodStats,
    topicStats,
    revisionQueue,
    questions,
    filters,
    platformStats,
    groupedSectionsAll,
    recentlySolved,
    inProgressQuestions,
    weakestSections,
    insights,
  } = useDsa();
  const { showToast } = useToast();

  const handleRandomPick = () => {
    const q = pickRandomQuestion(questions, filters);
    if (q) {
      showToast(`Try: ${q.name}`, 'info');
      if (q.link) window.open(q.link, '_blank');
    } else {
      showToast('No unsolved questions available', 'warning');
    }
  };

  const handleContinue = (question) => {
    if (question.link) window.open(question.link, '_blank');
    else showToast(`Continue: ${question.name}`, 'info');
  };

  return (
    <Box>
      <PageSectionTitle title="Overview" subtitle="Your DSA practice at a glance" />

      {/* 1 part — hero summary */}
      <PageFull>
        <DashboardHero
          stats={stats}
          streak={streak}
          periodStats={periodStats}
          inProgressQuestions={inProgressQuestions}
          onRandomPick={handleRandomPick}
          onContinue={handleContinue}
        />
      </PageFull>

      {/* 2 parts — key metrics */}
      <PageFull>
        <StatCards stats={stats} streak={streak} periodStats={periodStats} />
      </PageFull>

      {/* 2 parts — charts */}
      <PageSplit left={<ActivityChart />} right={<BreakdownChart />} />

      {/* 1 part — heatmap needs full width */}
      <PageFull>
        <HeatmapCalendar questions={questions} />
      </PageFull>

      {/* 2 parts — goals & insights */}
      <PageSplit left={<GoalTracker />} right={<DashboardInsights insights={insights} />} />

      {/* 2 parts — section progress & activity */}
      <PageSplit
        left={<SectionProgress sections={weakestSections} />}
        right={<RecentActivity recentlySolved={recentlySolved} inProgressQuestions={inProgressQuestions} />}
      />

      {/* 2 parts — platforms & revision */}
      <PageSplit
        left={<PlatformBreakdown platformStats={platformStats} total={stats.total} />}
        right={<RevisionQueue revisionQueue={revisionQueue} />}
      />

      {/* 1 part — full breakdown table */}
      <PageFull sx={{ mb: 0 }}>
        <TopicAnalytics topicStats={topicStats} groupedSectionsAll={groupedSectionsAll} />
      </PageFull>
    </Box>
  );
}
