import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiListArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';

// PUBLIC_INTERFACE
export default function ArticleDetail() {
  /** Article detail page to show a single item based on ID. */
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => { (async () => {
    const res = await apiListArticles();
    const found = (res.items || []).find(a => a.id === id);
    setArticle(found || null);
  })(); }, [id]);

  if (!article) {
    return <div className="card" style={{ padding: 16 }}>Article not found.</div>;
  }

  return <ArticleCard article={article} />;
}
