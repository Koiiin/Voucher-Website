function VoucherCard({ title, voucherType, category, validityStart, validityEnd, price, quantity, linkanh }) {
  return (
    <div className="voucher-card">
      <h3>{title}</h3>
      <img src={linkanh} alt={title} style={{ width: "200px", height: "auto" }} />
      <p>Loại: {voucherType}</p>
      <p>Danh mục: {category}</p>
      <p>Giá: {price} VND</p>
      <p>Số lượng: {quantity}</p>
      <p>Thời gian áp dụng: {new Date(validityStart).toLocaleDateString()} - {new Date(validityEnd).toLocaleDateString()}</p>
    </div>
  );
}
export default VoucherCard;

