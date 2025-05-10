import React, { useState, useEffect } from 'react';
import { authRequest } from '../services/authService';
import '../styles/User.css'; 

const User = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await authRequest({
                    url: "/user/profile",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                setUser(response.data);
            } catch (error) {
                setError("Failed to load profile. Please try again later.");
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!user) {
      return (
          <div className="loading">
              {error ? <div className="error-message">{error}</div> : "Loading..."}
          </div>
      );
    }
  

    return (
      <div className="user-profile">
          <div className="user-header">
              <img src={user.avatarUrl} alt="User Avatar" className="user-avatar" />
              <div className="user-info">
                  <h1>{user.username}</h1>
                  <p className="user-bio">{user.bio || "No bio available"}</p>
                  <div className="user-stats">
                      <div>
                          <strong>{user.vouchersPosted}</strong> Vouchers Posted
                      </div>
                      <div>
                          <strong>{user.vouchersSold}</strong> Vouchers Sold
                      </div>
                  </div>
                  <div className="user-theme">
                      <span>Theme: {user.theme}</span>
                  </div>
              </div>
          </div>
          <div className="user-ratings">
              <h3>Ratings</h3>
              {Array.isArray(user.ratings) && user.ratings.length === 0 ? (
                  <p>No ratings yet.</p>
              ) : (
                  Array.isArray(user.ratings) &&
                  user.ratings.map((rating, index) => (
                      <div key={index} className="user-rating">
                          <img src={rating.fromUser.avatarUrl} alt="Rater Avatar" className="rater-avatar" />
                          <div className="rating-details">
                              <span className="rater-name">{rating.fromUser.username}</span>
                              <div className="rating-stars">⭐ {rating.stars}</div>
                              <p className="rating-comment">{rating.comment}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
  );  
};

export default User;
