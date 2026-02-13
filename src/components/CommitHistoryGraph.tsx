import { useGithubCommits } from '../hooks';

interface CommitHistoryGraphProps {
  username?: string;
}

const getColor = (count: number): string => {
  if (count === 0) return '#23272f';
  if (count < 2) return '#183153';
  if (count < 5) return '#265d9b';
  if (count < 10) return '#4ea1ff';
  return '#90caff';
};

const CommitHistoryGraph: React.FC<CommitHistoryGraphProps> = ({ username }) => {
  const { commits, loading, error, year, setYear, availableYears } = useGithubCommits({ username });

  if (loading) return (
    <div className="text-center py-12 text-muted dark:text-muted-dark">
      Loading commit history...
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-danger dark:text-danger">
      {error}
    </div>
  );

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-primary dark:text-primary-dark mb-6 text-left">Commit History ({year})</h2>

      <div className="mb-6">
        <label htmlFor="year-select" className="text-muted dark:text-muted-dark mr-2">Year:</label>
        <select
          id="year-select"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="bg-bg2 dark:bg-bg2-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted rounded-lg px-3 py-2 focus:outline-none focus:border-primary dark:focus:border-primary"
        >
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {commits.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-0.5">
              {week.days.map((count, dayIdx) => {
                const firstDayOfYear = new Date(year, 0, 1);
                const firstSundayOffset = (7 - firstDayOfYear.getDay()) % 7;
                const firstSunday = new Date(year, 0, 1 + firstSundayOffset);
                const cellDate = new Date(firstSunday);
                cellDate.setDate(cellDate.getDate() + weekIdx * 7 + dayIdx);
                const isInYear = cellDate.getFullYear() === year;
                let tooltip = '';
                if (isInYear) {
                  if (count > 0) {
                    tooltip = `${cellDate.toLocaleDateString()}: ${count} commit${count !== 1 ? 's' : ''}`;
                  } else {
                    tooltip = cellDate.toLocaleDateString();
                  }
                }
                return (
                  <div
                    key={dayIdx}
                    className="w-3 h-3 rounded-sm"
                    style={{ background: getColor(count) }}
                    title={tooltip}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommitHistoryGraph;
