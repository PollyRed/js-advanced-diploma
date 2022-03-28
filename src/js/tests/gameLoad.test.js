import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';

test('Загрузка игры происходит успешно', () => {
  document.body.innerHTML = '<div id="game-container"></div>';
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);

  gameCtrl.init();
  gameCtrl.onSaveGame();

  const localStorageSave = gameCtrl.stateService.load();

  expect(localStorageSave.currentLevel).toBe(1);
  expect(localStorageSave.isPlayerTurn).toBe(true);
  expect(localStorageSave.selectedCell).toBe(-1);
  expect(localStorageSave.selectedCharacter).toBe(null);
  expect(localStorageSave.computerMoveDirection).toBe(-1);
  expect(localStorageSave.scores).toBe(0);
});

test('Загрузка игры завершается с ошибкой', () => {
  document.body.innerHTML = '<div id="game-container"></div>';
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);

  gameCtrl.init();
  gameCtrl.stateService.save();

  expect(() => {
    gameCtrl.stateService.load();
  }).toThrow(new Error('Invalid state'));
});
