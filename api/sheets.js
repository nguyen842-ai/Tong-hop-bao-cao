// File: api/sheets.js
export default async function handler(req, res) {
    // Thêm header CORS để frontend (GitHub Pages/Local) không bị trình duyệt chặn
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // ID file Google Sheet CHÍNH XÁC của dự án mới
    const SPREADSHEET_ID = '1Xtwk_Y7UGKNw2YC9c4kblae71mHahzr7GqV-sfiie6E';
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; 

    if (!API_KEY) {
        return res.status(500).json({ error: 'Chưa cấu hình biến môi trường GOOGLE_SHEETS_API_KEY trên Vercel.' });
    }

    // Lấy duy nhất ô A1 ở Sheet tên D
    const range = 'D!A1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }
        
        // Bóc tách đúng nội dung text của ô A1 trả về cho frontend
        let textResult = "";
        if (data.values && data.values.length > 0 && data.values[0].length > 0) {
            textResult = data.values[0][0];
        }
        
        res.status(200).json({ text: textResult });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi kết nối đến hệ thống Google Sheets.' });
    }
}
