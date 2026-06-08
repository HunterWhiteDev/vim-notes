#!/bin/bash
git pull origin main
sudo docker compose down api client
sudo docker compose up api client -d --build
