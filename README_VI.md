# Hệ Thống Thông Báo

Hệ thống thông báo dựa trên kiến trúc microservices hỗ trợ nhiều kênh thông báo bao gồm email và Telegram.

## Kiến Trúc Hệ Thống

Hệ thống bao gồm các thành phần sau:
- Kong API Gateway
- Kafka Message Broker
- MongoDB Database
- Notification Service
- Email Service
- Telegram Service

## Yêu Cầu Hệ Thống

- Docker và Docker Compose
- Node.js (cho phát triển local)
- MongoDB (cho phát triển local)
- Kafka (cho phát triển local)

## Cấu Hình

### Biến Môi Trường

1. Tạo file `.env` trong thư mục gốc từ file `.env.example`:
```env
HCP_CLIENT_ID=
HCP_CLIENT_SECRET=
```

2. Tự động tạo file .env:
- Cho Windows:
```bash
./get_secrets.bat
```

- Cho Linux, Mac:
```bash
chmod +x get_secrets.sh
./get_secrets.sh
```

### Cấu Hình Kong

Cấu hình Kong API Gateway nằm trong file `kong/kong.yml`. Bao gồm:
- Các route API
- Cài đặt xác thực
- Giới hạn tốc độ
- Cấu hình CORS

## Triển Khai

### Sử Dụng Docker Compose

1. Khởi động tất cả các service:
```bash
docker-compose up -d
```

2. Kiểm tra các service đang chạy:
```bash
docker-compose ps
```

### Triển Khai Thủ Công

1. Khởi động MongoDB:
```bash
docker-compose up -d mongodb
```

2. Khởi động Kafka và Zookeeper:
```bash
docker-compose up -d zookeeper kafka
```

3. Khởi động Kong:
```bash
docker-compose up -d kong
```

4. Khởi động các service:
```bash
docker-compose up -d notification-service email-service telegram-service
```

## Sử Dụng

`Tài liệu API:`
```bash
http://localhost:8000/docs
```
<br>

`MongoDB:`
```bash
http://localhost:27017
```
<br>

`Kafka UI:`
```bash
http://localhost:8081
```

## Kiểm Tra Thông Báo

#### 1. Gửi thông báo qua email:
Bạn có thể sử dụng một số email để kiểm tra hệ thống thông báo tại `https://yopmail.com/en/`


#### 2. Gửi thông báo qua Telegram
Bạn có thể tìm kiếm bot trong Telegram và gửi tin nhắn cho `@nghia_noti_000_bot`

## Xử Lý Sự Cố

1. Kiểm tra logs của service:
```bash
docker-compose logs <service-name>
```

2. Kiểm tra kết nối mạng:
```bash
docker network inspect notification-network
```

3. Kiểm tra kết nối MongoDB:
```bash
docker-compose exec mongodb mongo -u $MONGODB_USERNAME -p $MONGODB_PASSWORD
```

## Sao Lưu và Khôi Phục

1. Sao lưu dữ liệu MongoDB:
```bash
docker-compose exec mongodb mongodump --out /backup
```

2. Khôi phục từ bản sao lưu:
```bash
docker-compose exec mongodb mongorestore /backup
``` 