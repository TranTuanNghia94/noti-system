db = db.getSiblingDB('notification_db');

db.createUser({
  user: 'root',
  pwd: 'root_password',
  roles: [
    { role: 'readWrite', db: 'notification_db' }
  ]
});

// Create collections
db.createCollection('notifications');