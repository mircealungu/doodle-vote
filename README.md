# Doodle Vote

A simple voting website for scheduling meetings.

## Setup

1. Enable Discussions in repository settings (Settings → Features)
3. Go to https://github.com/settings/tokens and create a new token with "write:discussions" permission
4. Edit `app.js` and replace `GITHUB_TOKEN = ''` with your token in quotes
5. Deploy to GitHub Pages: Settings → Pages → Deploy from main branch

## How It Works

- Users select an hour to vote
- Each vote creates/updates a GitHub Discussion
- Votes are counted and displayed

## Customization

Edit `hours` array in `app.js` to change available times.
