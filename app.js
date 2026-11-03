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
    }

    renderHours() {
        const grid = document.getElementById('hours-grid');
        grid.innerHTML = hours.map(hour => 
            `<button class="hour-btn" data-hour="${hour}">${hour}</button>`
        ).join('');

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('hour-btn')) {
                this.showForm(e.target.dataset.hour);
            }
        });
    }

    showForm(hour) {
        const formHTML = `
            <div class="form-container">
                <h3>Submit your vote</h3>
                <p>Selected hour: <strong>${hour}</strong></p>
                <form action="https://formsubmit.co/mircea.lungu@gmail.com" method="POST" target="_blank">
                    <input type="hidden" name="_subject" value="New vote for meeting time">
                    <input type="hidden" name="_next" value="https://mircealungu.github.io/doodle-vote/">
                    <input type="hidden" name="_autoresponse" value="Thanks for voting!">
                    <input type="hidden" name="hour" value="${hour}">
                    <p>
                        <label>Your name: <br>
                            <input type="text" name="name" required style="padding: 8px; margin-top: 10px;">
                        </label>
                    </p>
                    <button type="submit" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">Submit Vote</button>
                </form>
            </div>
        `;
        const statuses = document.getElementById('statuses');
        statuses.innerHTML = formHTML;
    }
}

new Doodle();
