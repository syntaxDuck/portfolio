import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SinglePost from "./pages/SinglePost";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Playground from "./pages/Playground";
import Footer from "./components/Footer";
import TerminalPage from "./pages/demos/TerminalPage";
import GitHubActivityPage from "./pages/demos/GitHubActivityPage";
import CodePlaygroundPage from "./pages/demos/CodePlaygroundPage";
import AsciiArtPage from "./pages/demos/AsciiArtPage";
import AchievementsPage from "./pages/demos/AchievementsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom"

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(
  <BrowserRouter>
    <StrictMode>
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <main className="flex-1 p-5 md:p-8 bg-bg dark:bg-bg2-dark">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<SinglePost />} />
            <Route path="/about" element={<About />} />
            <Route path="/dev/playground" element={<Playground />} />
            <Route path="/demo/terminal" element={<TerminalPage />} />
            <Route path="/demo/github-activity" element={<GitHubActivityPage />} />
            <Route path="/demo/code-playground" element={<CodePlaygroundPage />} />
            <Route path="/demo/ascii-art" element={<AsciiArtPage />} />
            <Route path="/demo/achievements" element={<AchievementsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StrictMode>
  </BrowserRouter>
)
