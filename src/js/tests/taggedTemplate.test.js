import GameController from '../GameController';
import Bowman from '../Bowman';

test('Проверка тегированного шаблона', () => {
  const character = new Bowman(1);
  const result = GameController.getCharacterInfo(character);
  const expected = '🎖1 ⚔25 🛡25 ❤100';

  expect(result).toBe(expected);
});
