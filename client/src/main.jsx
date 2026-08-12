import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import Lobby from "./Pages/Lobby.jsx";
import ArticleLayout from "./Pages/ArticleLayout.jsx";
import VideoPage from "./Pages/VideoPage.jsx";
import VideoListPage from "./Pages/VideoListPage.jsx";
import ArticlePage from "./Pages/ArticlePage.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import ResearchPage from "./Pages/ResearchPage.jsx";
import PublicationsPage from "./Pages/PublicationsPage.jsx";
import TeamPage from "./Pages/TeamPage.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Lobby />} />
          <Route path='articles' element={<ArticleLayout />} />
          <Route path='articles/:id' element={<ArticlePage />} />
          <Route path='videos' element={<VideoListPage />} />
          <Route path='videos/:id' element={<VideoPage />} />
          <Route path='research' element={<ResearchPage />} />
          <Route path='publications' element={<PublicationsPage />} />
          <Route path='team' element={<TeamPage />} />
          <Route path='admin' element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
