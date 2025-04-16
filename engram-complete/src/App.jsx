import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import Auth from "./components/auth/Auth";
import NewPage from './components/new_page/new_page';
import ChatInterface from "./components/chat_page/ChatInterface";
import DiaryApp from "./components/diary_page/DiaryApp";
import ReviewPage from "./components/review_page/ReviewPage";

const LandingPage = () => (
  <main className="relative overflow-hidden">
    <div className="pt-[4.75rem] lg:pt-[5.25rem] content-wrapper">
      <Header />
      <Hero />
      <Benefits />
      <Collaboration />
      <Services />
      <Pricing />
      <Roadmap />
      <Footer />
    </div>
    <ButtonGradient />
  </main>
);

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="app-background" />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/new_page" element={<NewPage />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/diary" element={<DiaryApp />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
