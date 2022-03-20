import themes from './themes';
import Bowman from './Bowman';
import Daemon from './Daemon';
import Magician from './Magician';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';
import { generatePositions, generatePositionedTeam } from './generators';
import GameState from './GameState';
import GamePlay from './GamePlay';

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
    this.positions = [];
    this.gameState = new GameState();
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

    this.positions = playerTeam.concat(computerTeam);

    this.gamePlay.redrawPositions(this.positions);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.addListeners();
  }

  getCharacterFromCell(index) {
    for (const position of this.positions) {
      if (position.position === index) {
        return position;
      }
    }

    return null;
  }

  static getCharacterInfo(character) {
    return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  }

  static isPlayableCharacter(character) {
    return character.type === 'bowman' || character.type === 'swordsman' || character.type === 'magician';
  }

  isCharacterCanAttack(index) {
    return Math.abs(this.gameState.selectedCharacter.position - index) === 1
           || Math.abs(this.gameState.selectedCharacter.position - index) === 7
           || Math.abs(this.gameState.selectedCharacter.position - index) === 8
           || Math.abs(this.gameState.selectedCharacter.position - index) === 9;
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    const character = this.getCharacterFromCell(index);
    if (this.gameState.isPlayerTurn && character !== null) {
      if (GameController.isPlayableCharacter(character.character)) {
        if (this.gameState.selectedCell >= 0) {
          this.gamePlay.deselectCell(this.gameState.selectedCell);
          this.gameState.selectedCell = -1;
        }
        this.gamePlay.selectCell(index);
        this.gameState.selectedCell = index;
        this.gameState.selectedCharacter = character;
      } else {
        GamePlay.showError('Это неигровой персонаж!');
      }
    }
  }

  onCellEnter(index) {
    const character = this.getCharacterFromCell(index);
    if (character !== null) {
      if (this.gameState.selectedCell !== -1 && this.gameState.selectedCell !== index) {
        if (GameController.isPlayableCharacter(character.character)) {
          this.gamePlay.setCursor('pointer');
        } else {
          if (this.isCharacterCanAttack(index)) {
            this.gamePlay.setCursor('crosshair');
            this.gamePlay.selectCell(index, 'red');
          } else {
            this.gamePlay.setCursor('not-allowed');
          }
        }
      }
      const characterInfo = GameController.getCharacterInfo(character.character);
      this.gamePlay.showCellTooltip(characterInfo, index);
    } else if (character === null
              && this.gameState.selectedCell !== -1
              && this.gameState.selectedCell !== index) {
      if (this.isCharacterCanAttack(index)) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.setCursor('auto');
    if (index !== this.gameState.selectedCell) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
  }
}
