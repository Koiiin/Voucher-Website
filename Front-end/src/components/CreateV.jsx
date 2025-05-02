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
                {/* <input name="category" placeholder="Danh mục" onChange={handleChange} /> */}
                <select name="category" placeholder="Danh mục" onChange={handleChange} required>
                    <option value="">--Chọn danh mục--</option>
                    <option value={"clothes"}>Thời trang</option>
                    <option value={"food"}>Thực phẩm</option>
                    <option value={"electronics"}>Điện tử</option>
                    <option value={"home"}>Nhà cửa</option>
                    <option value={"travel"}>Du lịch</option>
                    <option value={"health"}>Sức khỏe</option>
                    <option value={"sports"}>Thể thao</option>
                    <option value={"beauty"}>Làm đẹp</option>
                    <option value={"books"}>Sách</option>
                    <option value={"toys"}>Đồ chơi</option>
                    <option value={"gifts"}>Quà tặng</option>
                    <option value={"pets"}>Thú cưng</option>
                    <option value={"furniture"}>Nội thất</option>
                    <option value={"automotive"}>Ô tô</option>
                    <option value={"accessories"}>Phụ kiện</option>
                    <option value={"stationery"}>Văn phòng phẩm</option>
                    <option value={"baby"}>Trẻ em</option>
                    <option value={"garden"}>Vườn</option>
                    <option value={"music"}>Âm nhạc</option>
                    <option value={"movies"}>Phim ảnh</option>
                    <option value={"games"}>Trò chơi</option>
                    <option value={"software"}>Phần mềm</option>
                    <option value={"services"}>Dịch vụ</option>
                    <option value={"others"}>Khác</option>
                </select>
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

