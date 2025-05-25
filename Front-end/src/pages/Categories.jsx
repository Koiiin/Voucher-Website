import React, {useEffect, useState}from 'react';
import { getUserVouchers } from "../services/voucherService";
import  UserCard  from "../components/Uservoucher";
import "../styles/Categories.css"; 

const UserVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserVouchers = async () => {
      try {
        const data = await getUserVouchers();
        console.log("Vouchers fetched:", data);
        setVouchers(Array.isArray(data) ? data : []);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserVouchers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách Voucher của bạn</h1>
      <div className="voucher-grid">
        {vouchers.map((voucher) => (
          <UserCard key={voucher._id} voucher={voucher} />
        ))}
      </div>
    </div>
  );
}



export default UserVoucher;
  