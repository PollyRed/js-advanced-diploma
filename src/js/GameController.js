import themes from './themes';
import Bowman from './Bowman';
import Daemon from './Daemon';
import Magician from './Magician';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';
import { generatePositions, generatePositionedTeam } from './generators';

const playerAllowedTypes = [Bowman, Magician, Swordsman];
const computerAllowedTypes = [Daemon, Undead, Vampire];

function getInitPlayerPosition(boardSize) {
  return Math.floor(Math.random() * boardSize) * boardSize
         + Math.round(Math.random());
}

function getInitComputerPosition(boardSize) {
  return Math.floor(Math.random() * boardSize) * boardSize
         + Math.round(Math.random() + boardSize - 2);
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerInitPositions = generatePositions(
      2, this.gamePlay.boardSize, getInitPlayerPosition,
    );
    const computerInitPositions = generatePositions(
      2, this.gamePlay.boardSize, getInitComputerPosition,
    );
    const playerTeam = generatePositionedTeam(playerAllowedTypes, 1, 2, playerInitPositions);
    const computerTeam = generatePositionedTeam(computerAllowedTypes, 1, 2, computerInitPositions);

    const positions = playerTeam.concat(computerTeam);

    this.gamePlay.redrawPositions(positions);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
