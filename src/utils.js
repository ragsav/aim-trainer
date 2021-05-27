export function handleKeyDown(e, finishGame) {
  if (e.keyCode === 32 || e.keyCode === 27) {
    finishGame();
  }
}
