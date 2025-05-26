import React, { useEffect, useState } from 'react';
import styles from './styles/CommitHistoryGraph.module.css';
import { fetchGithubCommitHistory } from '../services/github';

const GITHUB_USERNAME = process.env.REACT_APP_GITHUB_USERNAME;

const getColor = (count) => {
  if (count === 0) return '#23272f';
  if (count < 2) return '#183153';
  if (count < 5) return '#265d9b';
  if (count < 10) return '#4ea1ff';
  return '#90caff';
};

const getCurrentYear = () => new Date().getFullYear();

const CommitHistoryGraph = ({ username = GITHUB_USERNAME }) => {
  const [data, setData] = useState([]); // Array of 52 weeks, each with 7 days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(getCurrentYear());
  const [availableYears, setAvailableYears] = useState([getCurrentYear()]);

  useEffect(() => {
    // Try to get all years from 2008 (GitHub launch) to now
    const thisYear = getCurrentYear();
    const years = [];
    for (let y = thisYear; y >= 2008; y--) years.push(y);
    setAvailableYears(years);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchGithubCommitHistory(username, year)
      .then(setData)
      .catch(() => setError('Failed to load commit history.'))
      .finally(() => setLoading(false));
  }, [username, year]);

  if (loading) return <div className={styles.loading}>Loading commit history...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <section className={styles.commitSection}>
      <h2 className={styles.heading}>Commit History ({year})</h2>
      <div className={styles.yearSelector}>
        <label htmlFor="year-select">Year: </label>
        <select
          id="year-select"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className={styles.yearDropdown}
        >
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div className={styles.gridWrapper}>
        <div className={styles.gridColumns}>
          {data.map((week, weekIdx) => (
            <div key={weekIdx} className={styles.weekColumn}>
              {week.days.map((count, dayIdx) => {
                // Calculate the date for this cell
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
                    className={styles.daySquare}
                    style={{ background: getColor(count) }}
                    title={tooltip}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Removed graphLabels for start/end of year */}
    </section>
  );
};

export default CommitHistoryGraph;
