import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const { user, isCreator } = useAuth();

  useEffect(() => {
    fetchPosts();
    if (user && !isCreator) {
      fetchSubscriptionStatus();
    }
  }, [user, isCreator]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionsAPI.getSubscriptionStatus();
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const canViewContent = (post) => {
    if (isCreator) return true;
    if (!post.is_paid_content) return true;
    return subscriptionStatus?.is_paid_subscriber;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Newsletter Feed</h1>
        <p style={{ color: '#7f8c8d' }}>
          {user && !isCreator && subscriptionStatus?.is_paid_subscriber
            ? 'You have access to all premium content'
            : 'Subscribe to access premium content'}
        </p>
      </div>

      {user && !isCreator && !subscriptionStatus?.is_paid_subscriber && (
        <div className="alert alert-info">
          Want to access premium content?{' '}
          <Link to="/subscribe" style={{ fontWeight: 'bold' }}>
            Subscribe now
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No posts available yet.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div>
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">
                  Published on {new Date(post.created_at).toLocaleDateString()} by{' '}
                  {post.author_username}
                </div>
              </div>
              {post.is_paid_content && (
                <span className="post-badge">Premium</span>
              )}
            </div>

            {canViewContent(post) ? (
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div>
                <p className="post-excerpt">
                  This is premium content. Subscribe to read the full article.
                </p>
                <Link to="/subscribe" className="btn btn-primary">
                  Subscribe to Read
                </Link>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;