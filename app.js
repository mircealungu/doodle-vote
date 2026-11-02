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
            const response = await fetch('https://api.github.com/repos/mircealungu/doodle-vote/discussions?state=all&direction=desc&per_page=100');
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const discussions = await response.json();
            const counts = {};

            for (const discussion of discussions) {
                if (discussion.title.startsWith('Vote: ')) {
                    const hour = discussion.title.replace('Vote: ', '');
                    counts[hour] = (counts[hour] || 0) + 1;
                }
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

        const sortedHours = hours.filter(h => counts[h] > 0)
            .sort((a, b) => counts[b] - counts[a]);

        sortedHours.forEach(hour => {
            const count = counts[hour];
            const div = document.createElement('div');
            div.className = 'status-item';
            div.innerHTML = `<span>${hour}</span><span class="count">Votes: ${count}</span>`;
            statuses.appendChild(div);
        });

        if (statuses.children.length === 0) {
            statuses.innerHTML = '<div class="loading">No votes yet. Be the first!</div>';
        }
    }

    handleVote(hour) {
        selectedHour = hour;
        this.showForm();
    }

    showForm() {
        const formHTML = `
            <div class="form-container">
                <h3>Submit your vote</h3>
                <p>Selected hour: <strong>${selectedHour}</strong></p>
                <form action="https://formsubmit.co/mircea.lungu@gmail.com" method="POST" id="vote-form">
                    <input type="hidden" name="_subject" value="New vote for meeting time">
                    <input type="hidden" name="_next" value="https://mircealungu.github.io/doodle-vote/">
                    <input type="hidden" name="hour" value="${selectedHour}">
                    <p>
                        <label>Your name:<br>
                            <input type="text" name="name" required>
                        </label>
                    </p>
                    <button type="submit">Submit Vote</button>
                </form>
            </div>
        `;
        const formContainer = document.getElementById('statuses');
        formContainer.innerHTML = formHTML;
    }
}

new Doodle();
