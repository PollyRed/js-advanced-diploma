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
    this.playerTeam = [];
    this.computerTeam = [];
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
    this.playerTeam = generatePositionedTeam(playerAllowedTypes, 1, 2, playerInitPositions);
    this.computerTeam = generatePositionedTeam(computerAllowedTypes, 1, 2, computerInitPositions);

    this.positions = this.playerTeam.concat(this.computerTeam);

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
    if (this.gameState.selectedCharacter != null) {
      const size = this.gamePlay.boardSize;
      const characterType = this.gameState.selectedCharacter.character.type;
      const characterPosition = this.gameState.selectedCharacter.position;
      const characterRow = Math.floor(characterPosition / size);
      const currentRow = Math.floor(index / size);
      const distance = Math.abs((characterPosition % 8) - (index % 8));

      if (characterPosition === index) {
        return false;
      }

      if (characterType === 'swordsman' || characterType === 'undead') {
        return Math.abs(currentRow - characterRow) <= 1
        && distance <= 1 && distance >= 0 && distance < size;
      }
      if (characterType === 'bowman' || characterType === 'vampire') {
        return Math.abs(currentRow - characterRow) <= 2
        && distance <= 2 && distance >= 0 && distance < size;
      }
      if (characterType === 'magician' || characterType === 'daemon') {
        return Math.abs(currentRow - characterRow) <= 4
        && distance <= 4 && distance >= 0 && distance < size;
      }
    }

    return false;
  }

  isCharacterCanMove(index) {
    if (this.gameState.selectedCharacter != null) {
      const size = this.gamePlay.boardSize;
      const characterType = this.gameState.selectedCharacter.character.type;
      const characterPosition = this.gameState.selectedCharacter.position;
      const characterRow = Math.floor(characterPosition / size);
      const currentRow = Math.floor(index / size);
      const distance = Math.abs((characterPosition % 8) - (index % 8));

      if (characterPosition === index) {
        return false;
      }

      if (characterType === 'swordsman' || characterType === 'undead') {
        return Math.abs(currentRow - characterRow) <= 4
        && distance <= 4 && distance >= 0 && distance < size;
      }
      if (characterType === 'bowman' || characterType === 'vampire') {
        return Math.abs(currentRow - characterRow) <= 2
        && distance <= 2 && distance >= 0 && distance < size;
      }
      if (characterType === 'magician' || characterType === 'daemon') {
        return Math.abs(currentRow - characterRow) <= 1
        && distance <= 1 && distance >= 0 && distance < size;
      }
    }

    return false;
  }

  static calculateDamage(attacker, target) {
    return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
  }

  computerTurn() {
    for (const computerCharacter of this.computerTeam) {
      for (const playerCharacter of this.playerTeam) {
        this.gameState.selectedCharacter = computerCharacter;
        if (this.isCharacterCanAttack(playerCharacter.position)) {
          // attack player character and change turn
        }
      }
    }

    // move random computer character
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    const character = this.getCharacterFromCell(index);
    if (this.gameState.isPlayerTurn && character !== null
        && this.gameState.selectedCharacter === null) {
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
    } else if (this.gameState.isPlayerTurn && this.gameState.selectedCharacter !== null
              && character === null) {
      const selectedCharacterIndex = this.positions.indexOf(this.gameState.selectedCharacter);
      const selectedCharacterPosition = this.gameState.selectedCharacter.position;

      if (this.isCharacterCanMove(index)) {
        this.positions[selectedCharacterIndex].position = index;
        this.gamePlay.redrawPositions(this.positions);
        this.gamePlay.deselectCell(selectedCharacterPosition);
        this.gameState.selectedCharacter = null;
      }
    } else if (this.gameState.isPlayerTurn && this.gameState.selectedCharacter !== null
      && character !== null) {
      const selectedCharacterPosition = this.gameState.selectedCharacter.position;
      if (this.isCharacterCanAttack(index)) {
        const characterIndex = this.positions.indexOf(character);
        const damage = GameController.calculateDamage(
          this.gameState.selectedCharacter.character,
          character.character,
        );

        this.positions[characterIndex].character.health -= damage;

        this.gamePlay.showDamage(index, damage).then(() => {
          this.gamePlay.redrawPositions(this.positions);
          this.gamePlay.deselectCell(selectedCharacterPosition);
          this.gameState.selectedCharacter = null;
          if (this.positions[characterIndex].character.health <= 0) {
            this.positions.splice(characterIndex);
          }
          this.gamePlay.redrawPositions(this.positions);
        });
      }
    }
  }

  onCellEnter(index) {
    const character = this.getCharacterFromCell(index);
    if (character !== null) {
      if (this.gameState.selectedCell !== -1 && this.gameState.selectedCell !== index) {
        if (GameController.isPlayableCharacter(character.character)) {
          this.gamePlay.setCursor('pointer');
        } else if (!GameController.isPlayableCharacter(character.character)) {
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
      if (this.isCharacterCanMove(index)) {
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
