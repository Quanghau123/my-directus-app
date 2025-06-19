sequenceDiagram
    participant U as Người dùng
    participant FE as Frontend
    participant BE as Backend
    participant D as Directus
    participant DB as Cơ sở dữ liệu
    participant WS as WebSocket

    U->>FE: Gửi thông tin đăng ký
    FE->>BE: Gửi dữ liệu đăng ký
    BE->>D: Tạo tài khoản người dùng trong Directus
    D->>DB: Lưu thông tin người dùng vào cơ sở dữ liệu
    DB-->>D: Trả về kết quả thành công
    D-->>BE: Trả về thông tin người dùng đã tạo
    BE-->>FE: Trả về phản hồi thành công cho frontend
    FE-->>U: Hiển thị thông báo đăng ký thành công
    D->>BE: Gửi webhook cập nhật (nav, rank)
    BE->>WS: Phát sự kiện cho frontend
    WS->>FE: Cập nhật dữ liệu mới (nav, rank)
