import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SinglePost from "./pages/SinglePost";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Footer from "./components/Footer";
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
        <main className="flex-1 p-5 md:p-8 bg-bg dark:bg-bg-dark">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<SinglePost />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StrictMode>
  </BrowserRouter>
)
