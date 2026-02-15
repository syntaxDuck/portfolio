import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityEvent {
  id: number;
  type: string;
  repo: string;
  description: string;
  timestamp: string;
}

const GITHUB_USERNAME = 'syntaxDuck';

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  PushEvent: { label: 'PUSH', color: 'text-success' },
  PullRequestEvent: { label: 'PR', color: 'text-primary' },
  IssuesEvent: { label: 'ISSUE', color: 'text-warning' },
  WatchEvent: { label: 'STAR', color: 'text-secondary' },
  ForkEvent: { label: 'FORK', color: 'text-muted' },
  CreateEvent: { label: 'CREATE', color: 'text-success' },
  DeleteEvent: { label: 'DELETE', color: 'text-danger' },
  PullRequestReviewEvent: { label: 'REVIEW', color: 'text-primary' },
  IssueCommentEvent: { label: 'COMMENT', color: 'text-muted' },
};

const GitHubActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=20`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const parsed: ActivityEvent[] = data.map((event: any) => ({
        id: event.id,
        type: event.type,
        repo: event.repo.name,
        description: getEventDescription(event),
        timestamp: new Date(event.created_at).toLocaleString(),
      }));
      
      setActivities(parsed);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching GitHub activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventDescription = (event: any): string => {
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 0;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''}`;
      case 'PullRequestEvent':
        return `${event.payload.action} PR #${event.payload.pull_request.number}: ${event.payload.pull_request.title}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue #${event.payload.issue.number}: ${event.payload.issue.title}`;
      case 'WatchEvent':
        return 'Starred a repository';
      case 'ForkEvent':
        return 'Forked a repository';
      case 'CreateEvent':
        return `Created ${event.payload.ref_type}: ${event.payload.ref || event.payload.master_branch}`;
      case 'PullRequestReviewEvent':
        return `Reviewed PR #${event.payload.pull_request.number}`;
      case 'IssueCommentEvent':
        return `Commented on issue #${event.payload.issue.number}`;
      default:
        return event.type;
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">Live GitHub Activity</h1>
          <p className="text-muted dark:text-muted-dark">
            Real-time feed of my GitHub activity
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-muted dark:text-muted-dark">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchActivities}
            className="px-4 py-2 bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark text-sm hover:opacity-90 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted hover:border-primary dark:hover:border-primary-dark transition-colors"
              >
                <div className={`font-mono text-xs font-bold ${eventTypeLabels[activity.type]?.color || 'text-muted'}`}>
                  {eventTypeLabels[activity.type]?.label || activity.type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={`https://github.com/${activity.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary dark:text-primary-dark hover:underline font-medium"
                    >
                      {activity.repo}
                    </a>
                  </div>
                  <p className="text-sm text-muted dark:text-muted-dark truncate">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-muted dark:text-muted-dark whitespace-nowrap font-mono">
                  {activity.timestamp}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-8 p-4 bg-bg2 dark:bg-bg2-dark border border-borderMuted">
        <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Auto-refreshes every 30 seconds
        </div>
      </div>
    </div>
  );
};

export default GitHubActivityPage;
