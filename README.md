# Doodle Vote

A simple voting website for scheduling meetings.

## Setup

1. Create a new GitHub repository
2. Enable "Discussions" in repository settings (Settings → Features)
3. Create a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope
4. Edit `app.js`:
   - Set `GITHUBOwner` to your GitHub username
   - Set `GITHUB_REPO` to your repository name
   - Set `GITHUB_TOKEN` to your personal access token
5. Deploy to GitHub Pages: Settings → Pages → Deploy from main branch

## How It Works

- Users select an hour to vote
- Each vote creates/updates a GitHub Discussion
- Votes are counted and displayed

## Customization

Edit `hours` array in `app.js` to change available times.
