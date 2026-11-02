const GITHUBOwner = 'YOUR_GITHUB_USERNAME';
const GITHUB_REPO = 'YOUR_REPO_NAME';
const GITHUB_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN';
const DISCUSSION_NUMBER = null;

const hours = [
    '7am', '8am', '9am', '10am',
    '11am', '12pm', '1pm', '2pm',
    '3pm', '4pm', '5pm', '6pm',
    '7pm', '8pm', '9pm', '10pm'
];

let selectedHour = null;

class Doodle {
    constructor() {
        this.init();
    }

    init() {
        this.renderHours();
        this.loadVotes();
    }

    renderHours() {
        const grid = document.getElementById('hours-grid');
        grid.innerHTML = hours.map(hour => 
            `<button class="hour-btn" data-hour="${hour}">${hour}</button>`
        ).join('');

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('hour-btn')) {
                this.handleVote(e.target.dataset.hour);
            }
        });
    }

    async loadVotes() {
        const statuses = document.getElementById('statuses');
        statuses.innerHTML = '<div class="loading">Loading votes...</div>';

        try {
            const counts = {};
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(
                    `https://api.github.com/repos/${GITHUBOwner}/${GITHUB_REPO}/discussions?state=all&direction=desc&per_page=100&page=${page}`,
                    { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `token ${GITHUB_TOKEN}` } }
                );

                if (!response.ok) throw new Error(`API error: ${response.status}`);

                const discussions = await response.json();
                if (discussions.length === 0) hasMore = false;

                for (const discussion of discussions) {
                    if (discussion.title.startsWith('Vote: ')) {
                        const hour = discussion.title.replace('Vote: ', '');
                        counts[hour] = (counts[hour] || 0) + 1;
                    }
                }
                page++;
            }

            this.displayResults(counts);
        } catch (error) {
            console.error('Error loading votes:', error);
            statuses.innerHTML = `<div class="error">Error loading votes: ${error.message}</div>`;
        }
    }

    displayResults(counts) {
        const statuses = document.getElementById('statuses');
        statuses.innerHTML = '';

        hours.forEach(hour => {
            const count = counts[hour] || 0;
            if (count > 0) {
                const div = document.createElement('div');
                div.className = 'status-item';
                div.innerHTML = `<span>${hour}</span><span class="count">Votes: ${count}</span>`;
                statuses.appendChild(div);
            }
        });

        if (statuses.children.length === 0) {
            statuses.innerHTML = '<div class="loading">No votes yet. Be the first!</div>';
        }
    }

    async handleVote(hour) {
        selectedHour = hour;
        this.updateButtonStyles();

        const statuses = document.getElementById('statuses');
        statuses.innerHTML = '<div class="loading">Submitting vote...</div>';

        try {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `token ${GITHUB_TOKEN}` }
            });

            if (!userResponse.ok) throw new Error('Could not fetch user info');

            const user = await userResponse.json();
            const username = user.login;

            const existingDiscussion = await this.findExistingVote(username);
            
            if (existingDiscussion) {
                await this.updateDiscussion(existingDiscussion, hour);
            } else {
                await this.createDiscussion(hour, username);
            }

            await this.loadVotes();
            alert(`Vote for ${hour} recorded!`);
        } catch (error) {
            console.error('Error submitting vote:', error);
            statuses.innerHTML = `<div class="error">Error submitting vote: ${error.message}</div>`;
            alert(`Failed to submit vote: ${error.message}`);
        }
    }

    updateButtonStyles() {
        document.querySelectorAll('.hour-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.classList.add('disabled');
        });
    }

    async findExistingVote(username) {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUBOwner}/${GITHUB_REPO}/discussions?state=all&direction=desc&per_page=100&page=${page}`,
                { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `token ${GITHUB_TOKEN}` } }
            );

            if (!response.ok) return null;

            const discussions = await response.json();
            if (discussions.length === 0) hasMore = false;

            for (const discussion of discussions) {
                if (discussion.author?.login === username) {
                    return discussion;
                }
            }
            page++;
        }
        return null;
    }

    async createDiscussion(hour, username) {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUBOwner}/${GITHUB_REPO}/discussions`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Vote: ${hour}`,
                    body: `@${username} votes for ${hour}`,
                    category_id: null
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create discussion');
        }
    }

    async updateDiscussion(discussion, hour) {
        const response = await fetch(discussion.url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Vote: ${hour}`,
                body: `@${discussion.author?.login || 'user'} updates vote to ${hour}`
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update discussion');
        }
    }
}

new Doodle();
