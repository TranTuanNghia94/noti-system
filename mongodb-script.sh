#!/bin/bash

# Connect to MongoDB and show collections
docker exec -it noti-system-mongodb-1 mongosh -u root -p root_password --authenticationDatabase admin --eval "
use notification_db;
show collections;
" 