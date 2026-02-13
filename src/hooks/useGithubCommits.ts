import { useState, useMemo } from 'react';
import useFetch from './useFetch';
import { fetchGithubCommitHistory } from '../services/github';
import { CommitWeek } from '../types';

interface UseGithubCommitsOptions {
  username?: string;
  year?: number;
}

interface UseGithubCommitsReturn {
  commits: CommitWeek[];
  loading: boolean;
  error: string | null;
  year: number;
  setYear: (year: number) => void;
  availableYears: number[];
  refetch: () => void;
}

const getCurrentYear = (): number => new Date().getFullYear();

const generateYears = (): number[] => {
  const thisYear = getCurrentYear();
  const years: number[] = [];
  for (let y = thisYear; y >= 2008; y--) years.push(y);
  return years;
};

function useGithubCommits(options: UseGithubCommitsOptions = {}): UseGithubCommitsReturn {
  const { 
    username = import.meta.env.VITE_GITHUB_USERNAME,
    year: initialYear = getCurrentYear()
  } = options;

  const [year, setYear] = useState(initialYear);
  const availableYears = useMemo(() => generateYears(), []);

  const fetcher = () => fetchGithubCommitHistory(username, year);

  const { data, loading, error, refetch } = useFetch(fetcher, [username, year]);

  return {
    commits: data ?? [],
    loading,
    error,
    year,
    setYear,
    availableYears,
    refetch,
  };
}

export default useGithubCommits;
