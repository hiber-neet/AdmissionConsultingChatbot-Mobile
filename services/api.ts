export const chatApi = {
  async sendMessage(_userId: string, text: string): Promise<string> {
    try {
      // Giả lập delay
      await new Promise((r) => setTimeout(r, Math.random() * 1000 + 500));

      const query = text.toLowerCase();
      
      // Phản hồi về học phí
      if (query.includes("học phí") || query.includes("hoc phi") || query.includes("tuition")) {
        return "Học phí tại Đại học FPT là:\n• Kỹ thuật phần mềm: 27 triệu/kỳ\n• Quản trị kinh doanh: 22 triệu/kỳ\n• Thiết kế đồ họa: 25 triệu/kỳ\n\nCó học bổng lên đến 100% cho thí sinh xuất sắc!";
      }
      
      // Phản hồi về ngành học
      if (query.includes("ngành") || query.includes("chương trình") || query.includes("program")) {
        return "Các ngành đào tạo tại FPT University:\n• Kỹ thuật phần mềm\n• Quản trị kinh doanh\n• An toàn thông tin\n• Thiết kế đồ họa số\n• Digital Marketing\n• Thiết kế Game\n\nBạn muốn tìm hiểu chi tiết ngành nào?";
      }
      
      // Phản hồi về xét tuyển
      if (query.includes("xét tuyển") || query.includes("tuyển sinh") || query.includes("admission")) {
        return "Phương thức xét tuyển FPT 2025:\n• Xét học bạ THPT (18.0/30 điểm)\n• Xét điểm thi THPT QG\n• Xét tuyển thẳng (có giải, chứng chỉ)\n\nThời gian: Từ tháng 1-8/2025";
      }
      
      // Phản hồi về học bổng
      if (query.includes("học bổng") || query.includes("hoc bong") || query.includes("scholarship")) {
        return "Chương trình học bổng FPT:\n• 100% học phí: GPA ≥ 3.6\n• 75% học phí: GPA ≥ 3.2\n• 50% học phí: GPA ≥ 2.8\n• Học bổng tài năng\n• Học bổng khuyến khích";
      }
      
      // Phản hồi về cơ sở
      if (query.includes("cơ sở") || query.includes("co so") || query.includes("campus") || query.includes("địa chỉ")) {
        return "Hệ thống cơ sở FPT University:\n• Hà Nội\n• TP.HCM\n• Đà Nẵng\n• Cần Thơ\n• Quy Nhon\n\nMỗi cơ sở đều có đầy đủ tiện ích học tập hiện đại!";
      }
      
      // Phản hồi về việc làm
      if (query.includes("việc làm") || query.includes("viec lam") || query.includes("job") || query.includes("career")) {
        return "Cam kết việc làm FPT:\n• 95% sinh viên có việc làm sau tốt nghiệp\n• Mức lương khởi điểm: 8-15 triệu\n• Hơn 600 doanh nghiệp đối tác\n• Hỗ trợ tìm việc trọn đời";
      }
      
      // Phản hồi chào hỏi
      if (query.includes("xin chào") || query.includes("hello") || query.includes("hi") || query.includes("chào")) {
        return "Xin chào! 👋 Tôi là trợ lý ảo tuyển sinh FPT University. Tôi có thể giúp bạn tìm hiểu về:\n• Chương trình đào tạo\n• Học phí & học bổng\n• Quy trình xét tuyển\n• Cơ hội việc làm\n\nBạn muốn hỏi gì ạ?";
      }
      
      // Phản hồi cảm ơn
      if (query.includes("cảm ơn") || query.includes("cam on") || query.includes("thank")) {
        return "Rất vui được hỗ trợ bạn! 😊 Nếu bạn có thêm câu hỏi nào khác về FPT University, đừng ngại hỏi nhé. Chúc bạn may mắn với hành trình học tập!";
      }

      // Phản hồi mặc định
      return `Cảm ơn bạn đã hỏi về "${text}". Hiện tại tôi chưa có thông tin chi tiết về vấn đề này. Bạn có thể:\n\n• Liên hệ hotline: 1900 636939\n• Email: tuyen.sinh@fpt.edu.vn\n• Hoặc hỏi tôi về học phí, ngành học, xét tuyển, học bổng nhé!`;
      
    } catch (error) {
      console.error('Chat API Error:', error);
      throw new Error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    }
  },
};
