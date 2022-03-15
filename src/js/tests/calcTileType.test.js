import { calcTileType } from '../utils';

test.each([
  [0, 'top-left'],
  [7, 'top-right'],
  [2, 'top'],
  [16, 'left'],
  [23, 'right'],
  [56, 'bottom-left'],
  [63, 'bottom-right'],
  [59, 'bottom'],
  [10, 'center'],
])(
  'Определение типа клетки по индексу',
  (index, expected) => {
    const boardSize = 8;
    const result = calcTileType(index, boardSize);
    expect(result).toBe(expected);
  },
);
