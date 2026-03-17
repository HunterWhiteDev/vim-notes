### Vim Notes

## What is this?

This is an open-source, self-hosted, dockerized app that stores your notes in markdown files and has vim motions enabled in the editor.

## Why does this exist?

I had a problem with a simple solution: I wanted a self hosted notes app that supported vim motions. But not just vim motions while editing. I wanted to be able to control the entire app and note taking process with just my keyboard. So I invented this.

## Getting started

Deploying the app is simple and only requires configuring a few .env files.

# Step 1)

Clone the repo. `https://github.com/HunterWhiteDev/vim-notes.git`

# Step 2)

Copy the .env.example files `cp .env.example .env && cp api/.env.example api/.env`
You will need to change the vales in the .env files according to how you want to run your server. Setup the correct ports, an initial admin account, and whether you want to enable anyone to sign up for your hosted version of the app.

# Step 3)

Spin up the docker container. `docker compose up -d --build`
This command will build the docker images and serve the front-end client and back-end api. It may be possible that on the first run the drizzle migrations may fail. Running `docker compose down` andthen `docker compose up -d` again should fix this.

# Step 4

Set up your web server. By default the front-end lives on port 5173 and the backend lives in port 5001. You will need to configure your web server depending on if you use apache or nginx to properly forward requests properly.
