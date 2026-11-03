const hours = [
    '7am', '8am', '9am', '10am',
    '11am', '12pm', '1pm', '2pm',
    '3pm', '4pm', '5pm', '6pm',
    '7pm', '8pm', '9pm', '10pm'
];

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

    loadVotes() {
        const statuses = document.getElementById('statuses');
        const votes = JSON.parse(localStorage.getItem('doodleVotes') || '{}');
        this.displayResults(votes);
    }

    displayResults(votes) {
        const statuses = document.getElementById('statuses');
        statuses.innerHTML = '';

        const sortedHours = hours.filter(h => votes[h])
            .sort((a, b) => votes[b] - votes[a]);

        sortedHours.forEach(hour => {
            const count = votes[hour];
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
        const votes = JSON.parse(localStorage.getItem('doodleVotes') || '{}');
        votes[hour] = (votes[hour] || 0) + 1;
        localStorage.setItem('doodleVotes', JSON.stringify(votes));
        
        const button = event.target;
        button.classList.add('disabled');

        this.displayResults(votes);
        alert(`Vote for ${hour} recorded!`);
    }
}

new Doodle();
