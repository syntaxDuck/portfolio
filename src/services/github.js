// src/services/github.js
import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";

// Set your GitHub username here
export const fetchGithubRepos = async (
  username = "your-github-username",
  per_page = 4,
  page = 1
) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/users/${username}/repos`,
      { params: { sort: "updated", direction: "desc", per_page, page } }
    );
    // Get total count from the Link header if available (GitHub doesn't provide total count in this endpoint)
    // We'll fetch the user's public_repos count for total pages
    const userResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/users/${username}`
    );
    const totalCount = userResponse.data.public_repos;
    return { repos: response.data, totalCount };
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return { repos: [], totalCount: 0 };
  }
};
