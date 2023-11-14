document.addEventListener('DOMContentLoaded', () => {
    let curr_player = 'X';
    const count_number_of_moves = { 'X': 0, 'O': 0 };
    const cells = document.querySelectorAll('[boxtoplay]');

    let dragged_box = null;

    function StartofTheGame() {
        if (count_number_of_moves['X'] === 3 && count_number_of_moves['O'] === 3) {
            cells.forEach(cell => {
                if (cell.textContent) {
                    cell.setAttribute('draggable', 'true');
                }
            });
        } else {
            cells.forEach(cell => {
                cell.setAttribute('draggable', 'false');
            });
        }
    }

    cells.forEach((cell, index) => {
        cell.setAttribute('data-index', index);

        cell.addEventListener('dragstart', (e) => {
            if (e.target.textContent !== curr_player) {
                e.preventDefault();
                return;
            }
            dragged_box = e.target;
            console.log("e0target", e.target);
        });

        cell.addEventListener('dragover', (e) => {
            e.preventDefault();

        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();

            if (dragged_box.textContent !== curr_player) {
                return;
            }

            const sourceIndex = parseInt(dragged_box.getAttribute('data-index'));
            const targetIndex = parseInt(e.target.getAttribute('data-index'));

            if (isValidMove(sourceIndex, targetIndex, e.target)) {
                // count_number_of_moves[dragged_box.textContent]--;
                // count_number_of_moves[e.target.textContent]--;

                e.target.textContent = dragged_box.textContent;
                dragged_box.textContent = '';

                // count_number_of_moves[e.target.textContent]++;

                if (checkWinner(e.target.textContent)) {
                    setTimeout(() => {
                        alert(e.target.textContent + ' wins!');
                        resetBoard();
                    }, 100);
                    return;
                }

                change_player();
                StartofTheGame();
            }
        });

        cell.addEventListener('click', (e) => {
            if (!e.target.textContent && count_number_of_moves[curr_player] < 3) {
                e.target.textContent = curr_player;
                count_number_of_moves[curr_player]++;

                if (checkWinner(curr_player)) {
                    setTimeout(() => {
                        alert(curr_player + ' wins!');
                        resetBoard();
                    }, 100);
                    return;
                }

                change_player();
                StartofTheGame();
            }
        });
    });

    function change_player() {
        curr_player = curr_player === 'X' ? 'O' : 'X';
    }

    function isValidMove(source, target, targetCell) {
        const checkvalidity = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];

        if ([0, 2, 4, 6, 8].includes(source)) {
            checkvalidity.push([1, 1], [-1, -1], [1, -1], [-1, 1]);
        }

        for (const diff of checkvalidity) {
            if (source + diff[0] + diff[1] * 3 === target && !targetCell.textContent) {
                return true;
            }
        }
        return false;
    }

    function checkWinner(player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6], [1, 4, 6]
        ];

        return winConditions.some(condition => {
            return condition.every(index => {
                return cells[index].textContent === player;
            });
        });
    }

    function resetBoard() {
        cells.forEach(cell => {
            cell.textContent = '';
        });
        curr_player = 'X';
        count_number_of_moves['X'] = 0;
        count_number_of_moves['O'] = 0;
        StartofTheGame();
    }

    StartofTheGame();
});
