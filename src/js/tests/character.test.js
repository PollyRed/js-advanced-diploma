import Character from '../Character';
import Bowman from '../Bowman';

test('Запрет на создание персонажа через "new"', () => {
  expect(() => {
    const getCharacter = () => new Character(1);
    getCharacter();
  }).toThrow();
});

test('Создание персонажа через наследование', () => {
  const getCharacter = () => new Bowman(1);
  getCharacter();
});
