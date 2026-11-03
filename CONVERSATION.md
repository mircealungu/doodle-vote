# Doodle Voting App - Conversation Log

## Project Overview
Created a voting website for scheduling meeting times with support for:
- Multiple hour selection
- Day choice (Tomorrow/Wednesday)
- Email notification to organizer
- Local vote tracking

## Technology Stack
- GitHub Pages for hosting
- Formsubmit.co for form handling
- localStorage for client-side vote persistence
- HTML/CSS/JavaScript

## Setup Steps Completed
1. Created GitHub repo: `mircealungu/doodle-vote`
2. Enabled GitHub Discussions
3. Configured GitHub Pages deployment
4. Set up Formsubmit.co email: `mircea.lungu@gmail.com`

## Key Files
- `index.html` - Main page structure
- `style.css` - Styling with gradient background
- `app.js` - Voting logic
- `CONVERSATION.md` - This file

## Features Implemented
1. Hour grid with 16 time slots (7am-10pm)
2. Click to toggle hour selection (button turns blue when selected)
3. Click any hour to open vote form
4. Form fields: name, selected hours, day choice
5. Form submit sends email to organizer
6. localStorage saves current selection per session

## Technical Notes
- Formsubmit.co requires email confirmation on first use
- votes are NOT centralized (stored in each browser's localStorage)
- To get centralized voting, would need backend (Parse/Back4App or serverless function)
- GitHub PAT was generated but never successfully integrated due to secret scanning

## Deployment
Live at: https://mircealungu.github.io/doodle-vote/

## Future Improvements
- Add Wednesday option to day selection
- Implement centralized voting with backend
- Add vote count display (needs backend or shared storage)
