import React from "react";
import { useNavigate } from "react-router-dom";
import { createVoucher } from "../services/voucherService";
import "../styles/CreateV.css";

const CreateV = () => {
    const [formData, setFormData] = React.useState({
        title: "",
        voucherType: "",
        category: "",
        validityStart: "",
        validityEnd: "",
        price: 0,
        quantity: 1,
        linkanh: "",
    });

    const navigate = useNavigate();
    const [error, setError] = React.useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createVoucher(formData);
            navigate("/");
        } 
        catch (err) {
            setError(err.message);
        }
    };


    return (
        <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="voucher-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Tạo Voucher</h2>
            <div className="form-group">
                <input name="title" placeholder="Tên voucher" onChange={handleChange} required />
                <input name="voucherType" placeholder="Loại voucher" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <input name="category" placeholder="Danh mục" onChange={handleChange} />
                <input type="number" name="price" placeholder="Giá" onChange={handleChange} />
            </div>
            <div className="form-group">
                <input type="date" name="validityStart" onChange={handleChange} required />
                <input type="date" name="validityEnd" onChange={handleChange} required />
            </div>
            <div className="form-group">
                <input type="number" name="quantity" placeholder="Số lượng" onChange={handleChange} />
                <input name="linkanh" placeholder="Link ảnh" onChange={handleChange} />
            </div>
            <button className="submit-btn" type="submit">Tạo</button>
        </form>
        </div>
      );
};

export default CreateV;

