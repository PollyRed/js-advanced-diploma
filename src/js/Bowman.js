import Character from './Character';

export default class Bowerman extends Character {
  constructor(level, type = 'Bowman') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
  }
}
