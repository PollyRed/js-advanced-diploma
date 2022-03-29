import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../Bowman';

test('Проверка возможности перемещения', () => {
  document.body.innerHTML = '<div id="game-container"></div>';
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameController = new GameController(gamePlay, stateService);

  gameController.init();
  const character = new Bowman(1);
  const positionedCharacter = new PositionedCharacter(character, 0);
  gameController.gameState.positions.push(positionedCharacter);
  gameController.gameState.selectedCharacter = positionedCharacter;

  expect(gameController.isCharacterCanMove(10)).toBe(false);
  expect(gameController.isCharacterCanMove(1)).toBe(true);
});

test('Проверка возможности атаки', () => {
  document.body.innerHTML = '<div id="game-container"></div>';
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameController = new GameController(gamePlay, stateService);

  gameController.init();
  const character = new Bowman(1);
  const positionedCharacter = new PositionedCharacter(character, 0);
  gameController.gameState.positions.push(positionedCharacter);
  gameController.gameState.selectedCharacter = positionedCharacter;

  expect(gameController.isCharacterCanAttack(30)).toBe(false);
  expect(gameController.isCharacterCanAttack(10)).toBe(true);
});
