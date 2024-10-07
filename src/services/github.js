// src/services/github.js
import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";

export const fetchGitHubRepos = async (username) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/users/${username}/repos`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
};
