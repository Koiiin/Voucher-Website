import { useState, useEffect } from 'react';
import { authRequest } from '../services/authService';
import '../styles/User.css'; 

const User = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [vouchers, setVouchers] = useState([]);


    const handleUseVoucher = async (voucherId) => {
    try {
        console.log("Trying to delete voucher:", voucherId);
        const response = await authRequest({
            method: "DELETE",
            url: `/vouchers/deleteVoucher/${voucherId}`
        });

        console.log("Delete response:", response.data);

        setVouchers(prev => prev.filter(voucher => voucher._id !== voucherId));
    } 
    catch (error) {
        console.error("Failed to use (delete) voucher:", error);
        setError("Failed to use voucher. Please try again later.");
    }
}

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

    useEffect(() => {
        if (!user || !user._id) return;

        const fetchVouchers = async () => {
            try {
                const response = await authRequest({
                    url: `/user/${user._id}/vouchers`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                setVouchers(response.data.data || []);
            } 
            catch (error) {
                setError("Failed to load vouchers. Please try again later.");
                console.error('Error fetching vouchers:', error);
            }
        };
        fetchVouchers();
    }, [user]);

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
                        <div><strong>{user.vouchersPosted}</strong> Vouchers Posted</div>
                        <div><strong>{user.vouchersSold}</strong> Vouchers Sold</div>
                    </div>
                    <div className="user-theme">
                        <span>Theme: {user.theme}</span>
                    </div>
                </div>
            </div>

            {vouchers.map((voucher) => (
                <div key={voucher._id} className="user-card">
                    <div className="user-card-left">
                        <h3>{voucher.title}</h3>
                        <p>Loại: {voucher.voucherType}</p>
                        {voucher.category && <p>Danh mục: {voucher.category}</p>}
                        <p>Bắt đầu: {new Date(voucher.validityStart).toLocaleDateString()}</p>
                        <p>HSD: {new Date(voucher.validityEnd).toLocaleDateString()}</p>
                    </div>
                    <div className="user-card-right">
                        <p className="discount">Giảm <span className="discount-amount">{voucher.price}</span> đ</p>
                        <p>Đơn hàng tối thiểu: {voucher.minSpend}đ</p>
                        <p>Số lượng: {voucher.quantity}</p>
                        <div className="button-group">
                            <button className="banner-button" onClick={() => handleUseVoucher(voucher._id)}>Sử Dụng</button>
                        </div>
                    </div>
                </div>
            ))}


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