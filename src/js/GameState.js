export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.isPlayerTurn = true;
    this.selectedCell = -1;
    this.selectedCharacter = null;
    this.computerMoveDirection = -1;
    this.positions = [];
    this.scores = 0;
  }
}
