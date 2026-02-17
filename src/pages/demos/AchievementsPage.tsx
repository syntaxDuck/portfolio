import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface GitHubRepo {
  stargazers_count: number;
}

interface GitHubEvent {
  type: string;
}

const GITHUB_USERNAME = 'syntaxDuck';

const allAchievements: Omit<Achievement, 'earned' | 'earnedDate'>[] = [
  { id: 'starstruck', title: 'Starstruck', description: 'Created a repository that has 1000 stars', icon: '⭐' },
  { id: 'quickdraw', title: 'Quickdraw', description: 'Created a GitHub App within 5 minutes of the first pull request', icon: '⚡' },
  { id: 'yolo', title: 'YOLO', description: 'Merged a pull request without code review', icon: '🚀' },
  { id: 'public_sponsor', title: 'Sponsor Open Source', description: 'Sponsored an open source developer', icon: '💝' },
  { id: 'galaxy_brain', title: 'Galaxy Brain', description: 'Accepted 10 answers on your PRs or commits', icon: '🧠' },
  { id: 'pair_extraordinaire', title: 'Pair Extraordinaire', description: 'Co-authored a commit with another developer', icon: '🤝' },
  { id: 'pull_shark', title: 'Pull Shark', description: 'Created 16 pull requests', icon: '🦈' },
  { id: 'ace', title: 'Ace', description: 'Successfully merged a PR on the first review', icon: '🎯' },
  { id: 'mars_explorer', title: 'Mars Explorer', description: 'Pushed 1000 commits during GitHub Global Campus', icon: '🪐' },
  { id: 'arctic_code', title: 'Arctic Code Vault', description: 'Contributed code to repositories in the Arctic Code Vault', icon: '❄️' },
];

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalCommits: 0,
    totalPRs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`),
        ]);

        const userData = await userRes.json();
        const reposData = await reposRes.json();
        const eventsData = await eventsRes.json();

        const totalStars = reposData.reduce((acc: number, repo: GitHubRepo) => acc + repo.stargazers_count, 0);
        
        const pushEvents = eventsData.filter((e: GitHubEvent) => e.type === 'PushEvent').length;

        setStats({
          totalRepos: userData.public_repos || 0,
          totalStars,
          totalCommits: pushEvents,
          totalPRs: eventsData.filter((e: GitHubEvent) => e.type === 'PullRequestEvent').length,
        });

        const earnedAchievements: Achievement[] = allAchievements.map(ach => {
          let earned = false;
          let earnedDate: string | undefined;

          switch (ach.id) {
            case 'starstruck':
              earned = totalStars >= 1000;
              break;
            case 'pull_shark':
              earned = pushEvents >= 16;
              break;
            case 'galaxy_brain':
              earned = userData.public_repos >= 10;
              break;
            default:
              earned = Math.random() > 0.7;
              if (earned) {
                earnedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
              }
          }

          return { ...ach, earned, earnedDate };
        });

        setAchievements(earnedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        const fallbackAchievements = allAchievements.map(ach => ({
          ...ach,
          earned: false,
        }));
        setAchievements(fallbackAchievements);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">Achievements</h1>
        <p className="text-muted dark:text-muted-dark">
          GitHub achievements and milestones
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted text-center">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{stats.totalRepos}</div>
          <div className="text-sm text-muted dark:text-muted-dark">Repositories</div>
        </div>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted text-center">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{stats.totalStars}</div>
          <div className="text-sm text-muted dark:text-muted-dark">Total Stars</div>
        </div>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted text-center">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{stats.totalCommits}</div>
          <div className="text-sm text-muted dark:text-muted-dark">Events</div>
        </div>
        <div className="p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted text-center">
          <div className="text-2xl font-bold text-primary dark:text-primary-dark">{earnedCount}</div>
          <div className="text-sm text-muted dark:text-muted-dark">Achievements</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border transition-colors ${
                achievement.earned
                  ? 'bg-bg2 dark:bg-bg2-dark border-primary dark:border-primary-dark'
                  : 'bg-bg dark:bg-bg-dark border-borderMuted opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.earned ? 'text-text dark:text-text-dark' : 'text-muted'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted dark:text-muted-dark mt-1">
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.earnedDate && (
                    <div className="text-xs text-primary dark:text-primary-dark mt-2">
                      Earned: {achievement.earnedDate}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted">
        <div className="text-sm text-muted dark:text-muted-dark">
          Note: Some achievements are simulated for demo purposes. GitHub's achievement API is limited.
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
