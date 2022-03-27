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
import PositionedCharacter from './PositionedCharacter';
import Character from './Character';

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
    this.gameState = new GameState();
  }

  init() {
    this.gameState = new GameState();
    this.changeLevel();
    this.addListeners();
  }

  drawLevel() {
    let currentLevel;
    if (this.gameState.currentLevel === 1) currentLevel = themes.prairie;
    if (this.gameState.currentLevel === 2) currentLevel = themes.desert;
    if (this.gameState.currentLevel === 3) currentLevel = themes.arctic;
    if (this.gameState.currentLevel === 4) currentLevel = themes.mountain;

    this.gamePlay.drawUi(currentLevel);
  }

  changeLevel() {
    let playerTeam = [];
    let computerTeam = [];
    let additionalPlayers = 0;
    let maxLevel = 0;

    if (this.gameState.currentLevel === 1) {
      additionalPlayers = 2;
      maxLevel = 2;
    } else if (this.gameState.currentLevel === 2) {
      additionalPlayers = 1;
      maxLevel = 2;
    } else if (this.gameState.currentLevel === 3) {
      additionalPlayers = 2;
      maxLevel = 3;
    } else if (this.gameState.currentLevel === 4) {
      additionalPlayers = 2;
      maxLevel = 4;
    } else {
      alert('You win!');
      return;
    }

    const playerInitPositions = generatePositions(
      this.gameState.positions.length + additionalPlayers,
      this.gamePlay.boardSize, getInitPlayerPosition,
    );
    const computerInitPositions = generatePositions(
      this.gameState.positions.length + additionalPlayers,
      this.gamePlay.boardSize, getInitComputerPosition,
    );

    if (this.gameState.currentLevel === 1) {
      playerTeam = generatePositionedTeam(
        [Bowman, Swordsman], maxLevel - 1, additionalPlayers, playerInitPositions,
      );
    } else {
      playerTeam = generatePositionedTeam(
        playerAllowedTypes, maxLevel - 1, additionalPlayers, playerInitPositions,
      );
    }

    for (let i = 0; i < this.gameState.positions.length; i += 1) {
      const player = this.gameState.positions[i];
      player.position = playerInitPositions[i + additionalPlayers];
      player.character.levelUp();
      playerTeam.push(player);
    }

    computerTeam = generatePositionedTeam(
      computerAllowedTypes, maxLevel,
      this.gameState.positions.length + additionalPlayers, computerInitPositions,
    );

    this.drawLevel();
    this.gameState.positions = playerTeam.concat(computerTeam);
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  addScores() {
    const playerTeam = this.gameState.positions.filter(
      (character) => GameController.isPlayableCharacter(character),
    );
    for (const character of playerTeam) {
      this.gameState.scores += character.character.health;
    }
  }

  getCharacterFromCell(index) {
    for (const position of this.gameState.positions) {
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
    return character.character.type === 'bowman'
           || character.character.type === 'swordsman'
           || character.character.type === 'magician';
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

      const isHorizontal = currentRow === characterRow;
      const isVertical = distance === 0;
      const isDiagonal = distance === Math.abs(characterRow - currentRow);

      if (distance >= 0 && distance < size && (isVertical || isHorizontal || isDiagonal)) {
        if (characterType === 'swordsman' || characterType === 'undead') {
          return Math.abs(currentRow - characterRow) <= 4 && distance <= 4;
        }
        if (characterType === 'bowman' || characterType === 'vampire') {
          return Math.abs(currentRow - characterRow) <= 2 && distance <= 2;
        }
        if (characterType === 'magician' || characterType === 'daemon') {
          return Math.abs(currentRow - characterRow) <= 1 && distance <= 1;
        }
      }
    }

    return false;
  }

  static calculateDamage(attacker, target) {
    return Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
  }

  computerTurn() {
    const computerTeam = this.gameState.positions.filter(
      (character) => !GameController.isPlayableCharacter(character),
    );
    const playerTeam = this.gameState.positions.filter(
      (character) => GameController.isPlayableCharacter(character),
    );

    for (const computerCharacter of computerTeam) {
      for (const playerCharacter of playerTeam) {
        this.gameState.selectedCharacter = computerCharacter;

        if (this.isCharacterCanAttack(playerCharacter.position)) {
          const playerCharacterIndex = this.gameState.positions.indexOf(playerCharacter);
          const damage = GameController.calculateDamage(
            computerCharacter.character,
            playerCharacter.character,
          );

          this.gameState.positions[playerCharacterIndex].character.health -= damage;
          this.gameState.selectedCharacter = null;

          this.gamePlay.showDamage(playerCharacter.position, damage).then(() => {
            if (this.gameState.positions[playerCharacterIndex].character.health <= 0) {
              this.gamePlay.deselectCell(playerCharacter.position);
              this.gameState.positions.splice(playerCharacterIndex, 1);
              playerTeam.splice(playerTeam.indexOf(playerCharacter), 1);

              if (playerTeam.length === 0) {
                alert('Game Over!');
              }
            }
            this.gamePlay.redrawPositions(this.gameState.positions);
          });
          return;
        }
      }
    }

    const randomComputerPlayer = computerTeam[Math.floor(Math.random() * computerTeam.length)];
    const randomCharacterIndex = this.gameState.positions.indexOf(randomComputerPlayer);

    if ((randomComputerPlayer.position % this.gamePlay.boardSize) - 1 < 0) {
      this.gameState.computerMoveDirection = 1;
    }

    if ((randomComputerPlayer.position % this.gamePlay.boardSize) + 1 >= this.gamePlay.boardSize) {
      this.gameState.computerMoveDirection = -1;
    }

    this.gameState.positions[randomCharacterIndex].position += this.gameState.computerMoveDirection;
    this.gamePlay.redrawPositions(this.gameState.positions);
    this.gameState.selectedCharacter = null;
    this.gameState.isPlayerTurn = true;
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
  }

  onCellClick(index) {
    if (this.gameState.currentLevel > 4) {
      return;
    }

    const character = this.getCharacterFromCell(index);
    if (this.gameState.isPlayerTurn && character !== null) {
      if (GameController.isPlayableCharacter(character)) {
        if (this.gameState.selectedCell >= 0) {
          this.gamePlay.deselectCell(this.gameState.selectedCell);
          this.gameState.selectedCell = -1;
        }
        this.gamePlay.selectCell(index);
        this.gameState.selectedCell = index;
        this.gameState.selectedCharacter = character;
      } else if (this.gameState.selectedCharacter === null) {
        GamePlay.showError('Это неигровой персонаж!');
      }
    }

    if (this.gameState.isPlayerTurn && this.gameState.selectedCharacter !== null
              && character === null) {
      const selectedCharacterIndex = this.gameState.positions.indexOf(
        this.gameState.selectedCharacter,
      );
      const selectedCharacterPosition = this.gameState.selectedCharacter.position;

      if (this.isCharacterCanMove(index)) {
        this.gameState.positions[selectedCharacterIndex].position = index;
        this.gamePlay.redrawPositions(this.gameState.positions);
        this.gamePlay.deselectCell(selectedCharacterPosition);
        this.gameState.selectedCharacter = null;

        this.computerTurn();
      }

      return;
    }

    if (this.gameState.isPlayerTurn && this.gameState.selectedCharacter !== null
      && character !== null) {
      const selectedCharacterPosition = this.gameState.selectedCharacter.position;
      if (this.isCharacterCanAttack(index)) {
        const characterIndex = this.gameState.positions.indexOf(character);
        const damage = GameController.calculateDamage(
          this.gameState.selectedCharacter.character,
          character.character,
        );

        this.gameState.positions[characterIndex].character.health -= damage;

        this.gamePlay.showDamage(index, damage).then(() => {
          this.gamePlay.deselectCell(selectedCharacterPosition);
          this.gameState.selectedCharacter = null;

          if (this.gameState.positions[characterIndex].character.health <= 0) {
            this.gameState.positions.splice(characterIndex, 1);
            const computerTeam = this.gameState.positions.filter(
              (c) => !GameController.isPlayableCharacter(c),
            );

            if (computerTeam.length === 0) {
              this.gameState.currentLevel += 1;
              this.addScores();
              this.changeLevel();
            }
          }
          this.gamePlay.redrawPositions(this.gameState.positions);
          this.computerTurn();
        });
      }
    }
  }

  onCellEnter(index) {
    if (this.gameState.currentLevel > 4) {
      return;
    }

    const character = this.getCharacterFromCell(index);
    if (character !== null) {
      if (this.gameState.selectedCell !== -1 && this.gameState.selectedCell !== index) {
        if (GameController.isPlayableCharacter(character)) {
          this.gamePlay.setCursor('pointer');
        } else if (!GameController.isPlayableCharacter(character)) {
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
    if (this.gameState.currentLevel > 4) {
      return;
    }

    this.gamePlay.setCursor('auto');
    if (index !== this.gameState.selectedCell) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
  }

  onNewGame() {
    const { scores } = this.gameState;
    const gamePlay = new GamePlay();
    gamePlay.bindToDOM(document.querySelector('#game-container'));
    this.gamePlay = gamePlay;
    this.init();
    this.gameState.scores = scores;
  }

  onSaveGame() {
    this.stateService.save(this.gameState);
  }

  onLoadGame() {
    try {
      this.gameState = this.stateService.load();
      const positions = [];

      for (const position of this.gameState.positions) {
        const character = Object.setPrototypeOf(position.character, Character.prototype);
        positions.push(new PositionedCharacter(character, position.position));
      }

      this.gameState.positions = positions;

      this.drawLevel();
      this.gamePlay.redrawPositions(this.gameState.positions);
    } catch (error) {
      alert('Load failed!');
    }
  }
}
