import Character from "./Character";
import Team from "./Team";

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  for (const AllowedType of allowedTypes) {
    yield new AllowedType((Math.random() % maxLevel) + 1);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  for (let i = 0; i < characterCount; i += 1) {
    team.addMember(characterGenerator(allowedTypes, maxLevel));
  }
  return team;
}
