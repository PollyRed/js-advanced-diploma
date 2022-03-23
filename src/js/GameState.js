export default class GameState {
  constructor() {
    this.isPlayerTurn = true;
    this.selectedCell = -1;
    this.selectedCharacter = null;
    this.computerMoveDirection = -1;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
