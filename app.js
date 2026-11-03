const hours = [
    '7am', '8am', '9am', '10am',
    '11am', '12pm', '1pm', '2pm',
    '3pm', '4pm', '5pm', '6pm',
    '7pm', '8pm', '9pm', '10pm'
];

let selectedHours = [];
let selectedDay = 'tomorrow';

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
        grid.innerHTML = hours.map(hour => {
            const isSelected = selectedHours.includes(hour);
            return `<button class="hour-btn ${isSelected ? 'selected' : ''}" data-hour="${hour}">${hour}</button>`;
        }).join('');

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('hour-btn')) {
                this.toggleHour(e.target.dataset.hour);
            }
        });
    }

    toggleHour(hour) {
        const index = selectedHours.indexOf(hour);
        if (index > -1) {
            selectedHours.splice(index, 1);
        } else {
            selectedHours.push(hour);
        }
        this.renderHours();
        localStorage.setItem('selectedHours', JSON.stringify(selectedHours));
    }

    loadVotes() {
        const saved = localStorage.getItem('selectedHours');
        if (saved) {
            selectedHours = JSON.parse(saved);
            this.renderHours();
        }
    }

    showForm() {
        const formHTML = `
            <div class="form-container">
                <h3>Submit your vote</h3>
                <p>Selected hours: <strong>${selectedHours.length > 0 ? selectedHours.join(', ') : 'None'}</strong></p>
                <p>Day: <strong>${selectedDay}</strong></p>
                <form action="https://formsubmit.co/mircea.lungu@gmail.com" method="POST" target="_blank">
                    <input type="hidden" name="_subject" value="New vote for meeting time">
                    <input type="hidden" name="_next" value="https://mircealungu.github.io/doodle-vote/">
                    <input type="hidden" name="_autoresponse" value="Thanks for voting!">
                    <input type="hidden" name="hours" value="${selectedHours.join(', ')}">
                    <input type="hidden" name="day" value="${selectedDay}">
                    <p>
                        <label>Your name: <br>
                            <input type="text" name="name" required style="padding: 8px; margin-top: 10px;">
                        </label>
                    </p>
                    <div style="margin-top: 15px;">
                        <label><input type="radio" name="day" value="tomorrow" checked> Tomorrow</label>
                        <label style="margin-left: 10px;"><input type="radio" name="day" value="Wednesday"> Wednesday</label>
                    </div>
                    <button type="submit" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">Submit Vote</button>
                </form>
            </div>
        `;
        const statuses = document.getElementById('statuses');
        statuses.innerHTML = formHTML;
    }
}

new Doodle();
