import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI, subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsResponse, subscribersResponse] = await Promise.all([
        postsAPI.getCreatorPosts(),
        subscriptionsAPI.getSubscribers(),
      ]);

      setPosts(postsResponse.data);
      setSubscribers(subscribersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/creator/edit-post/${postId}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const paidSubscribers = subscribers.filter((sub) => sub.is_paid_subscriber);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Creator Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Welcome back, {user?.username}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subscribers.length}</div>
          <div className="stat-label">Total Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{paidSubscribers.length}</div>
          <div className="stat-label">Paid Subscribers</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-header" style={{ margin: 0 }}>Your Posts</h2>
          <Link to="/creator/new-post" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            You haven't created any posts yet.{' '}
            <Link to="/creator/new-post" style={{ color: '#3498db' }}>
              Create your first post
            </Link>
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>
                      {post.is_paid_content ? (
                        <span className="post-badge">Premium</span>
                      ) : (
                        <span style={{ color: '#27ae60' }}>Free</span>
                      )}
                    </td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="btn btn-secondary"
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;