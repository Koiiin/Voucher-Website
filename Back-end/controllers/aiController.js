const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const suggestVoucher = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Nhận lịch sử mua hàng từ request
    const { history } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Bạn là một trợ lý AI giúp gợi ý voucher dựa trên lịch sử mua sắm."},
                { role: "user", content: `Dựa trên lịch sử này: ${JSON.stringify(history)}, hãy đề xuất 3 voucher phù hợp.`},
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        res.status(200).json({
            suggestions: response.choices[0].message.content
        });
    } catch(error) {
        res.status(500).json({
            message: 'Lỗi khi gọi API OpenAI',
            error: error.message
        });
    }
}

module.exports = { suggestVoucher };
