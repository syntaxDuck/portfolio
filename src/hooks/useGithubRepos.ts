import useFetch from './useFetch';
import { fetchGithubRepos } from '../services/github';
import { GithubRepo } from '../types';

interface UseGithubReposOptions {
  username?: string;
}

interface UseGithubReposReturn {
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useGithubRepos(options: UseGithubReposOptions = {}): UseGithubReposReturn {
  const { username = import.meta.env.VITE_GITHUB_USERNAME } = options;

  const { data, loading, error, refetch } = useFetch(
    () => fetchGithubRepos(username).then(response => response.repos),
    [username]
  );

  return {
    repos: data ?? [],
    loading,
    error,
    refetch,
  };
}

export default useGithubRepos;
