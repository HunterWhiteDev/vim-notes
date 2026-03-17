#!/bin/bash
git pull main
sudo docker compose down 
sudo docker compose up -d --build
