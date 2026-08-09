import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';

const ArticleLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-bg-main min-h-screen pt-40 pb-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <header className="mb-16">
          <span className="eyebrow">Research Center</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-main mb-6 tracking-tight">
            Scientific <span className="text-brand-primary accent-soften">Insights</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Exploring the intersection of applied machine learning, conservation, and linguistic translation.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-16 items-start">
          <aside className="lg:col-span-1 space-y-12 lg:sticky lg:top-32">
            <ArticleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ArticleFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <div className="bg-ink rounded-3xl p-8 shadow-elevated relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-4 opacity-40">Newsletter</h4>
                 <p className="text-sm text-white/70 mb-6 font-medium">Get research summaries delivered to your inbox.</p>
                 <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white mb-4 focus:outline-none focus:border-brand-primary transition-all" />
                 <button className="w-full btn-primary py-3 text-[10px] uppercase tracking-widest justify-center bg-white text-ink hover:bg-white/90">Subscribe</button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </aside>

          <main className="lg:col-span-3">
             <ArticleGrid selectedCategory={selectedCategory} searchTerm={searchTerm} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArticleLayout;
