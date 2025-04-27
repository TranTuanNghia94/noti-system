# Notification System

A microservices-based notification system that supports multiple notification channels including Email and Telegram.

## Architecture

- **API Gateway**: Kong
- **Message Broker**: Apache Kafka
- **Database**: MongoDB
- **Framework**: NestJS
- **Language**: Node.js

## Services

1. **API Gateway**: Manages entry points and routes requests
2. **Notification Service**: Main service for handling notification requests
3. **Email Service**: Handles email notifications via Gmail SMTP
4. **Telegram Service**: Handles Telegram notifications via Bot API

## Prerequisites

- Node.js (Latest LTS version)
- Docker and Docker Compose
- MongoDB
- Apache Kafka
- Kong Gateway

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start the services:
   ```bash
   docker-compose up -d
   ```

## API Documentation

Swagger documentation is available at `/api/docs` when the services are running.

## Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

- `MONGODB_URI`: MongoDB connection string
- `KAFKA_BROKERS`: Kafka broker addresses
- `GMAIL_USER`: Gmail account for sending emails
- `GMAIL_PASS`: Gmail app password
- `TELEGRAM_BOT_TOKEN`: Telegram bot token
- `API_KEY`: API key for authentication 