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
    this.positions = [];
    this.gameState = new GameState();
    this.changeLevel();
    this.addListeners();
  }

  changeLevel() {
    let playerTeam = [];
    let computerTeam = [];

    if (this.gameState.currentLevel === 1) {
      this.gamePlay.drawUi(themes.prairie);
      const playerInitPositions = generatePositions(
        2, this.gamePlay.boardSize, getInitPlayerPosition,
      );
      const computerInitPositions = generatePositions(
        2, this.gamePlay.boardSize, getInitComputerPosition,
      );
      playerTeam = generatePositionedTeam([Bowman, Swordsman], 1, 2, playerInitPositions);
      computerTeam = generatePositionedTeam(computerAllowedTypes, 1, 2, computerInitPositions);
    }
    if (this.gameState.currentLevel === 2) {
      this.gamePlay.drawUi(themes.desert);

      const playersCount = this.positions.length + 1;

      const playerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitPlayerPosition,
      );
      const computerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitComputerPosition,
      );

      playerTeam = generatePositionedTeam(playerAllowedTypes, 2, 1, playerInitPositions);

      for (let i = 0; i < this.positions.length; i += 1) {
        const player = this.positions[i];
        player.position = playerInitPositions[i + 1];
        player.character.levelUp();
        playerTeam.push(player);
      }

      computerTeam = generatePositionedTeam(
        computerAllowedTypes, 2, playersCount, computerInitPositions,
      );
    }
    if (this.gameState.currentLevel === 3) {
      this.gamePlay.drawUi(themes.arctic);

      const playersCount = this.positions.length + 2;

      const playerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitPlayerPosition,
      );
      const computerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitComputerPosition,
      );

      playerTeam = generatePositionedTeam(playerAllowedTypes, 2, 2, playerInitPositions);

      for (let i = 0; i < this.positions.length; i += 1) {
        const player = this.positions[i];
        player.position = playerInitPositions[i + 2];
        player.character.levelUp();
        playerTeam.push(player);
      }

      computerTeam = generatePositionedTeam(
        computerAllowedTypes, 3, playersCount, computerInitPositions,
      );
    }
    if (this.gameState.currentLevel === 4) {
      this.gamePlay.drawUi(themes.mountain);

      const playersCount = this.positions.length + 2;

      const playerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitPlayerPosition,
      );
      const computerInitPositions = generatePositions(
        playersCount, this.gamePlay.boardSize, getInitComputerPosition,
      );

      playerTeam = generatePositionedTeam(playerAllowedTypes, 3, 2, playerInitPositions);

      for (let i = 0; i < this.positions.length; i += 1) {
        const player = this.positions[i];
        player.position = playerInitPositions[i + 2];
        player.character.levelUp();
        playerTeam.push(player);
      }

      computerTeam = generatePositionedTeam(
        computerAllowedTypes, 4, playersCount, computerInitPositions,
      );
    }

    this.positions = playerTeam.concat(computerTeam);
    this.gamePlay.redrawPositions(this.positions);
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
    return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
  }

  computerTurn() {
    const computerTeam = this.positions.filter(
      (character) => !GameController.isPlayableCharacter(character),
    );
    const playerTeam = this.positions.filter(
      (character) => GameController.isPlayableCharacter(character),
    );

    for (const computerCharacter of computerTeam) {
      for (const playerCharacter of playerTeam) {
        this.gameState.selectedCharacter = computerCharacter;

        if (this.isCharacterCanAttack(playerCharacter.position)) {
          const playerCharacterIndex = this.positions.indexOf(playerCharacter);
          const damage = GameController.calculateDamage(
            computerCharacter.character,
            playerCharacter.character,
          );

          this.positions[playerCharacterIndex].character.health -= damage;
          this.gameState.selectedCharacter = null;

          this.gamePlay.showDamage(playerCharacter.position, damage).then(() => {
            if (this.positions[playerCharacterIndex].character.health <= 0) {
              this.gamePlay.deselectCell(playerCharacter.position);
              this.positions.splice(playerCharacterIndex, 1);
              playerTeam.splice(playerTeam.indexOf(playerCharacter), 1);

              if (playerTeam.length === 0) {
                alert('Game Over!');
              }
            }
            this.gamePlay.redrawPositions(this.positions);
          });
          return;
        }
      }
    }

    const randomComputerPlayer = computerTeam[Math.floor(Math.random() * computerTeam.length)];
    const randomCharacterIndex = this.positions.indexOf(randomComputerPlayer);

    if ((randomComputerPlayer.position % this.gamePlay.boardSize) - 1 < 0) {
      this.gameState.computerMoveDirection = 1;
    }

    if ((randomComputerPlayer.position % this.gamePlay.boardSize) + 1 >= this.gamePlay.boardSize) {
      this.gameState.computerMoveDirection = -1;
    }

    this.positions[randomCharacterIndex].position += this.gameState.computerMoveDirection;
    this.gamePlay.redrawPositions(this.positions);
    this.gameState.selectedCharacter = null;
    this.gameState.isPlayerTurn = true;
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.init.bind(this));
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
      const selectedCharacterIndex = this.positions.indexOf(this.gameState.selectedCharacter);
      const selectedCharacterPosition = this.gameState.selectedCharacter.position;

      if (this.isCharacterCanMove(index)) {
        this.positions[selectedCharacterIndex].position = index;
        this.gamePlay.redrawPositions(this.positions);
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
        const characterIndex = this.positions.indexOf(character);
        const damage = GameController.calculateDamage(
          this.gameState.selectedCharacter.character,
          character.character,
        );

        this.positions[characterIndex].character.health -= damage;

        this.gamePlay.showDamage(index, damage).then(() => {
          this.gamePlay.deselectCell(selectedCharacterPosition);
          this.gameState.selectedCharacter = null;

          if (this.positions[characterIndex].character.health <= 0) {
            this.positions.splice(characterIndex, 1);
            const computerTeam = this.positions.filter(
              (c) => !GameController.isPlayableCharacter(c),
            );

            if (computerTeam.length === 0) {
              this.gameState.currentLevel += 1;
              this.changeLevel();
            }
          }
          this.gamePlay.redrawPositions(this.positions);
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
}
