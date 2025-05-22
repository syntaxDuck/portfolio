// src/services/github.js
import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";

// Set your GitHub username here
export const fetchGithubRepos = async (
  username = process.env.REACT_APP_GITHUB_USERNAME
) => {
  try {
    let allRepos = [];
    let page = 1;
    let per_page = 100;
    let fetched;
    do {
      const headers = {};
      const token = getGithubToken();
      if (token) headers['Authorization'] = `token ${token}`;
      const reposResponse = await axios.get(
        `${GITHUB_API_BASE_URL}/users/${username}/repos`,
        { params: { per_page, page }, headers }
      );
      fetched = reposResponse.data;
      allRepos = allRepos.concat(fetched);
      page++;
    } while (fetched.length === per_page);
    return { repos: allRepos };
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return { repos: [] };
  }
};

export const fetchGithubCommitHistory = async (
  username = process.env.REACT_APP_GITHUB_USERNAME,
  year = new Date().getFullYear()
) => {
  // Fetch commit activity for all public repos and sum by day for each week for the selected year
  try {
    // Fetch all repos (handle pagination)
    let allRepos = [];
    let page = 1;
    let per_page = 100;
    let fetched;
    do {
      const headers = {};
      const token = getGithubToken();
      if (token) headers['Authorization'] = `token ${token}`;
      const reposResponse = await axios.get(
        `${GITHUB_API_BASE_URL}/users/${username}/repos`,
        { params: { per_page, page }, headers }
      );
      fetched = reposResponse.data;
      allRepos = allRepos.concat(fetched);
      page++;
    } while (fetched.length === per_page);
    const repos = allRepos;
    // weekData: array of 53 weeks, each week is { days: [0,0,0,0,0,0,0] }
    const weekData = Array.from({ length: 52 }, () => ({
      days: [0, 0, 0, 0, 0, 0, 0],
    }));
    const now = new Date();
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
    const startOfYear = new Date(year, 0, 1);
    await Promise.all(
      repos.map(async (repo) => {
        try {
          const headers = {};
          const token = getGithubToken();
          if (token) headers['Authorization'] = `token ${token}`;
          const activityRes = await axios.get(
            `${GITHUB_API_BASE_URL}/repos/${username}/${repo.name}/stats/commit_activity`,
            { headers }
          );
          const activity = activityRes.data;
          if (Array.isArray(activity) && activity.length > 0) {
            // Each activity[i] is a week: { week: unix timestamp, total, days: [7 numbers] }
            activity.forEach((week, i) => {
              const weekStart = new Date(week.week * 1000);
              if (weekStart >= startOfYear && weekStart <= endOfYear) {
                week.days.forEach((count, d) => {
                  // Find the week index for this year
                  const weekOfYear = Math.floor(
                    (weekStart - startOfYear) / (7 * 24 * 60 * 60 * 1000)
                  );
                  if (weekOfYear >= 0 && weekOfYear < 53) {
                    weekData[weekOfYear].days[d] += count;
                  }
                });
              }
            });
          }
        } catch (e) {
          // Ignore errors for individual repos
        }
      })
    );
    // Remove empty trailing weeks for a cleaner graph
    while (
      weekData.length > 0 &&
      weekData[weekData.length - 1].days.every((v) => v === 0)
    ) {
      weekData.pop();
    }
    // Always return 52 weeks, even if some are empty or in the future
    const fullYearWeeks = Array.from(
      { length: 52 },
      (_, i) => weekData[i] || { days: [0, 0, 0, 0, 0, 0, 0] }
    );
    return fullYearWeeks;
  } catch (error) {
    console.error("Error fetching commit history:", error);
    return Array.from({ length: 52 }, () => ({ days: [0, 0, 0, 0, 0, 0, 0] }));
  }
};

// Helper to get GitHub token from env
const getGithubToken = () => process.env.REACT_APP_GITHUB_TOKEN;
