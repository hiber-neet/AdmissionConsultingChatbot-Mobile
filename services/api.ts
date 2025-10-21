export const chatApi = {
  async sendMessage(_userId: string, text: string) {
    // Giả lập delay
    await new Promise((r) => setTimeout(r, 1000));

    // Phản hồi mô phỏng
    if (text.toLowerCase().includes("học phí")) {
      return "Học phí trung bình tại Đại học FPT là khoảng 27 triệu đồng/học kỳ (tùy ngành).";
    }
    if (text.toLowerCase().includes("ngành")) {
      return "Các ngành tiêu biểu gồm: Kỹ thuật phần mềm, Quản trị kinh doanh, Trí tuệ nhân tạo, Thiết kế đồ họa, Ngôn ngữ Anh, và nhiều ngành khác.";
    }

    return `Bạn hỏi: "${text}" — Chatbot sẽ sớm cập nhật câu trả lời chi tiết hơn!`;
  },
};
