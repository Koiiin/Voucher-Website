const fetch = require('node-fetch');

// Gọi API backend để lấy danh sách voucher hợp lệ
async function fetchValidVouchers() {
  try {
    const res = await fetch('http://localhost:3000/api/vouchers/getValidVouchers');
    const data = await res.json();

    console.log("✅ Voucher từ API:", data); // Log kiểm tra

    return data;
  } catch (err) {
    console.error('❌ Lỗi khi lấy voucher:', err.message);
    return [];
  }
}

const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const vouchers = await fetchValidVouchers();

    // Hiển thị tất cả voucher hợp lệ
    let voucherText = "Hiện tại chưa có voucher nào.";
    if (vouchers.length > 0) {
      voucherText = vouchers.map(v => `
      🎁 Tên: ${v.title}
      📂 Loại: ${v.voucherType}
      🏷️ Danh mục: ${v.category}
      📦 Số lượng còn lại: ${v.quantity}
      💰 Giá: ${v.price === 0 ? 'Miễn phí' : `${v.price} VNĐ`}
      ---`
    ).join('\n\n');
  }


    const fullPrompt = `
Người dùng hỏi: "${message}"

🎉 Dưới đây là danh sách voucher đang giảm giá hiện có:

${voucherText}

👉 Hãy trả lời người dùng dựa trên danh sách trên. Nếu không liên quan đến voucher, phản hồi như một trợ lý AI thông minh và thân thiện.
    `.trim();

    console.log("📝 Prompt gửi sang AI:\n", fullPrompt); // Debug prompt

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: fullPrompt }],
        stream: false
      }),
    });

    if (!response.ok) throw new Error(`❌ Chatbot fetch failed: ${response.statusText}`);

    const data = await response.json();
    const reply = data.message?.content || '❓ Chatbot không có phản hồi.';
    
    res.json({ reply });

  } catch (error) {
    console.error('🚨 Lỗi chatbot:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ trong chatbot' });
  }
};

module.exports = { getChatResponse };
