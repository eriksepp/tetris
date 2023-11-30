export const scoreboard = {
    allCurrentScores: undefined,
    currentPage: 1,
    totalPages: undefined,
}

const constantDOMElements = {
    navPageNumberEl: document.getElementById("navPageNumber"),
    scoresWrappersEl: document.getElementsByClassName("scoresWrapper"),
}

export function updatePageNumber(reset) {
    if (reset) {
        //Update total page amount
        scoreboard.totalPages = Math.ceil(scoreboard.allCurrentScores.length / 5);
    }

    //Update current page number
    constantDOMElements.navPageNumberEl.innerHTML = scoreboard.currentPage +
        "/" +
        scoreboard.totalPages;
}

export function updateScoreboard() {
    //Update top scores
    for (let i = 0; i < 5; i++) {
        const scoreEntryElements = constantDOMElements.scoresWrappersEl[i].children;
        let scoreEntryData = scoreboard.allCurrentScores[i + (5 * (scoreboard.currentPage - 1))];

        //If last score pages don't have 5 entries, fill last ones with empty data
        if (scoreEntryData === undefined) {
            scoreEntryData = {
                rank: "",
                name: "",
                score: "",
                time: "",
            }
        }

        scoreEntryElements[0].textContent = scoreEntryData["rank"];
        scoreEntryElements[1].textContent = scoreEntryData["name"];
        scoreEntryElements[2].textContent = scoreEntryData["score"];
        scoreEntryElements[3].textContent = scoreEntryData["time"];
    }
}

//For moving to next scoreboard page
export function nextScoresPage() {
    if (scoreboard.currentPage === scoreboard.totalPages) {
        scoreboard.currentPage = 1;
    } else {
        scoreboard.currentPage += 1;
    }

    updatePageNumber();
    updateScoreboard();
}

//For moving to previous scoreboard page
export function prevScoresPage() {
    if (scoreboard.currentPage === 1) {
        scoreboard.currentPage = scoreboard.totalPages;
    } else {
        scoreboard.currentPage -= 1;
    }

    updatePageNumber();
    updateScoreboard();
}