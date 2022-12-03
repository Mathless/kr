function createScoreTable(score) {
	score.sort((a, b) => b[1] - a[1]);

	const tableHead = `
                <table class="score-table">
                    <thead>
                        <tr class='highlight-row'>
                            <th>Username</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

	const tableFoot = `
                    </tbody>
                </table>
            `;

	const count = score.length;
	let tableBody = '';

	for (let i = 0; i < count; i += 1) {
		const currUsername = score[i][0];
		const currScore = score[i][1];

		tableBody += `
                    <tr>
                        <td>${currUsername}</td>
                        <td>${currScore}</td>
                    </tr>
                `;
	}

	return tableHead + tableBody + tableFoot;
}
function scoreTable() {
	const e = document.querySelector('.score-table');
	// remove the last list item
	if (e != null) e.parentElement.removeChild(e);
	document.querySelector('.container')
		.insertAdjacentHTML(
			'afterbegin',
			createScoreTable(JSON.parse(localStorage.scores || '[]')),
		);
}

window.scoreTable = scoreTable;
