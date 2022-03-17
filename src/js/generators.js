import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

function getRandomNumber(minNumber, maxNumber) {
  return Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
}

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const GeneratedCharacter = allowedTypes[getRandomNumber(0, allowedTypes.length)];
  yield new GeneratedCharacter(getRandomNumber(1, maxLevel));
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  for (let i = 0; i < characterCount; i += 1) {
    team.addMember(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return team;
}

export function generatePositions(count, size, callback) {
  const positions = [];

  while (positions.length < count) {
    const position = callback(size);
    if (positions.indexOf(position) === -1) {
      positions.push(position);
    }
  }

  return positions;
}

export function generatePositionedTeam(allowedTypes, maxLevel, characterCount, positions) {
  const team = generateTeam(allowedTypes, maxLevel, characterCount);
  const positionedTeam = [];

  for (let i = 0; i < team.teamMembers.length; i += 1) {
    positionedTeam.push(
      new PositionedCharacter(team.teamMembers[i], positions[i]),
    );
  }

  return positionedTeam;
}
