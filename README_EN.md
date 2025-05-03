# Notification System

A microservices-based notification system that supports multiple notification channels including email and Telegram.

## System Architecture

## Preparation

1. Clone the repository:
```bash
git clone <repository-url>
cd noti-system
```

The system consists of the following components:
- Kong API Gateway
- Kafka Message Broker
- MongoDB Database
- Notification Service
- Email Service
- Telegram Service

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (for local development)
- Kafka (for local development)

## Configuration

### Environment Variables

1. Create a `.env` file in the root directory from `.env.example` file:
```env
HCP_CLIENT_ID=
HCP_CLIENT_SECRET=
```

2. Auto gen .env file:
- For Windows:
```bash
./get_secrets.bat
```

- For Linux, Mac:
```bash
chmod +x get_secrets.sh
./get_secrets.sh
```
### Kong Configuration

The Kong API Gateway configuration is located in `kong/kong.yml`. It includes:
- API routes
- Authentication settings
- Rate limiting
- CORS configuration

## Deployment

### Using Docker Compose

1. Start all services:
```bash
docker-compose up -d
```

2. Verify services are running:
```bash
docker-compose ps
```

### Manual Deployment

1. Start MongoDB:
```bash
docker-compose up -d mongodb
```

2. Start Kafka and Zookeeper:
```bash
docker-compose up -d zookeeper kafka
```

3. Start Kong:
```bash
docker-compose up -d kong
```

4. Start the services:
```bash
docker-compose up -d notification-service email-service telegram-service
```

## Usage

`API docs:`
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

## Troubleshooting

1. Check service logs:
```bash
docker-compose logs <service-name>
```

2. Verify network connectivity:
```bash
docker network inspect notification-network
```

3. Check MongoDB connection:
```bash
docker-compose exec mongodb mongo -u $MONGODB_USERNAME -p $MONGODB_PASSWORD
```


- Track MongoDB performance

## Backup and Recovery

1. Backup MongoDB data:
```bash
docker-compose exec mongodb mongodump --out /backup
```

2. Restore from backup:
```bash
docker-compose exec mongodb mongorestore /backup
```

