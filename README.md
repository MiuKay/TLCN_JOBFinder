# XÂY DỰNG WEBSITE ĐĂNG TIN TUYỂN DỤNG VÀ TÌM VIỆC LÀM CÓ TỰ ĐỘNG SÀNG LỌC CV PHÙ HỢP

## Mô Tả Dự Án

**Job Finder** là một nền tảng website giúp người tìm việc và nhà tuyển dụng kết nối với nhau một cách hiệu quả. Website cung cấp các tính năng đăng tin tuyển dụng, tìm kiếm việc làm và sàn lọc CV tự động, giúp cả ứng viên và nhà tuyển dụng tối ưu hóa quá trình tìm kiếm và tuyển dụng.

Dự án này được thực hiện bởi sinh viên:

- **Võ Chí Khương**        - MSSV: 21110221
- **Phạm Ngọc Đăng Khoa**  - MSSV: 21110214

## Tính Năng Chính

Website **Job Finder** cung cấp các tính năng chính sau:

1. **Đăng tin tuyển dụng**:
   - Nhà tuyển dụng có thể đăng các tin tuyển dụng với thông tin công việc chi tiết.
   - Quản lý các tin tuyển dụng đã đăng, chỉnh sửa hoặc xóa tin.

2. **Tìm kiếm việc làm**:
   - Người tìm việc có thể tìm kiếm các công việc phù hợp với mình dựa trên các tiêu chí như ngành nghề, vị trí, mức lương, v.v.
   - Hỗ trợ tìm kiếm nâng cao với các bộ lọc linh hoạt.

3. **Tích hợp sàn lọc CV tự động**:
   - Hệ thống sử dụng công nghệ trí tuệ nhân tạo (AI) hoặc thuật toán để tự động phân loại và lọc CV của ứng viên.
   - Giúp nhà tuyển dụng dễ dàng tìm được ứng viên phù hợp với yêu cầu công việc mà không cần duyệt qua từng CV thủ công.

4. **Quản lý hồ sơ ứng viên**:
   - Ứng viên có thể tạo và quản lý hồ sơ cá nhân, bao gồm thông tin cá nhân, kinh nghiệm làm việc, kỹ năng, và các chứng chỉ.
   - Ứng viên có thể chia sẻ CV hay cũng có thể nhận các công việc gợi ý qua mail.

5. **Cập nhật**:
   - Người dùng quản lý được hồ sơ của mình đã được nhà tuyển dụng xem hay chưa.
   - Nhà tuyển dụng nhận xem được thống kê khi có ứng viên mới nộp CV cho công việc của họ.

## Các Vai Trò Người Dùng

Website **Job Finder** có 4 vai trò người dùng chính, mỗi vai trò sẽ có quyền truy cập và tính năng riêng:

### 1. **Ứng Viên**:
   - **Tạo hồ sơ cá nhân**: Cập nhật thông tin cá nhân, kinh nghiệm làm việc, kỹ năng và các chứng chỉ.
   - **Tìm kiếm công việc**: Tìm kiếm công việc theo các tiêu chí như ngành nghề, vị trí, mức lương, v.v.
   - **Nộp hồ sơ xin việc**: Gửi hồ sơ và thư xin việc cho nhà tuyển dụng.
   - **Nhận mail**: Nhận mail về các công việc mới phù hợp với hồ sơ khi chia sẻ CV.

### 2. **Người Tuyển Dụng**:
   - **Đăng tin tuyển dụng**: Đăng các công việc tuyển dụng để tìm ứng viên phù hợp.
   - **Quản lý tin tuyển dụng**: Chỉnh sửa hoặc xóa các tin tuyển dụng.
   - **Sử dụng sàn lọc CV tự động**: Xem xét kết quả lọc CV tự động để tìm ứng viên phù hợp.
   - **Xem hồ sơ ứng viên**: Xem thông tin chi tiết về ứng viên và mời ứng viên phỏng vấn.

### 3. **Công Ty**:
   - **Quản lý thông tin công ty**: Công ty có thể chỉnh sửa, cập nhật thông tin về công ty của mình.
   - **Đăng tin tuyển dụng**: Công ty có thể đăng tin tuyển dụng trên nền tảng và tìm kiếm ứng viên phù hợp.
   - **Quản lý danh sách tuyển dụng**: Quản lý các tin tuyển dụng của công ty và các ứng viên nộp hồ sơ.

### 4. **Admin**:
   - **Quản lý người dùng**: Admin có thể tạo, xem, chặn tài khoản người dùng (ứng viên, nhà tuyển dụng, công ty).
   - **Quản lý tin tuyển dụng**: Admin có thể duyệt hoặc từ chối các tin tuyển dụng.
   - **Quản lý dữ liệu hệ thống**: Admin có quyền kiểm tra và quản lý toàn bộ dữ liệu người dùng và thông tin trên hệ thống.
   - **Xem thống kê**: Admin có thể xem thống kê và báo cáo về hoạt động của nền tảng.

## Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ hiện đại để xây dựng và phát triển website **Job Finder**:

- **Frontend**: 
  - HTML, CSS, SCSS, JavaScript
  - ReactJS (hoặc các framework khác nếu sử dụng)
  - Tailwind CSS (hoặc các framework CSS khác để tạo giao diện đẹp)
  
- **Backend**:
  - Node.js với Express
  - MySQL (tùy thuộc vào cấu trúc dữ liệu)
  
- **Authentication**: 
  - JWT (JSON Web Token) cho hệ thống bảo mật và xác thực người dùng.
  - Mã hóa mật khẩu

- **Sàn Lọc CV Tự Động**:
  - Sử dụng AI/Thuật toán phân tích CV (có thể sử dụng các thư viện hoặc API AI như TensorFlow hoặc các công cụ xử lý ngôn ngữ tự nhiên để trích xuất thông tin từ CV).
  
## Hướng Dẫn Cài Đặt

### Cài Đặt Backend

1. Clone repository về máy tính của bạn:
    ```bash
    git clone https://github.com/username/job-finder.git
    ```
2. Di chuyển vào thư mục backend:
    ```bash
    cd TLCN_JobFinderBE
    ```
3. Cài đặt các dependencies:
    ```bash
    npm install
    ```
4. Cấu hình thông tin kết nối cơ sở dữ liệu trong file `.env`.
5. Chạy server backend:
    ```bash
    npm start
    ```

### Cài Đặt Frontend

1. Di chuyển vào thư mục frontend:
    ```bash
    cd TLCN_JobFinderFE
    ```
2. Cài đặt các dependencies:
    ```bash
    npm install
    ```
3. Cấu hình thông tin kết nối cơ sở dữ liệu trong file `.env`.
4. Chạy server frontend:
    ```bash
    npm start
    ```

## Cách Sử Dụng

1. Truy cập vào website thông qua trình duyệt web của bạn.
2. **Đối với ứng viên**:
   - Tạo tài khoản và đăng nhập.
   - Tạo hồ sơ xin việc và nộp đơn cho các công việc phù hợp.
   - Quản lý được hồ sơ đã xem hay chưa.

3. **Đối với nhà tuyển dụng**:
   - Đăng ký tài khoản và đăng nhập.
   - Đăng tin tuyển dụng với thông tin chi tiết về công việc.
   - Quản lý các công việc đã đăng và duyệt hồ sơ ứng viên thông qua sàn lọc CV tự động.

4. **Đối với công ty**:
   - Đăng nhập vào tài khoản công ty.
   - Quản lý thông tin công ty và các tin tuyển dụng của công ty.

5. **Đối với admin**:
   - Đăng nhập vào tài khoản admin để quản lý người dùng, dữ liệu và các tin tuyển dụng trên hệ thống.

## Đội Ngũ Phát Triển

- **Võ Chí Khương**        - MSSV: 21110221
- **Phạm Ngọc Đăng Khoa**  - MSSV: 21110214

## Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào hoặc muốn liên hệ với nhóm phát triển, vui lòng gửi email đến:

- Email: khuongchet2003@gmail.com (Võ Chí Khương)
- Email: 	khoapham1172003@gmail.com (Phạm Ngọc Đăng Khoa)

## License

Dự án này được cấp phép theo giấy phép MIT.
