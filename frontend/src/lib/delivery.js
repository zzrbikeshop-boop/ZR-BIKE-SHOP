// TODO: edit with the shop's real delivery prices: [home delivery, stop desk] in DZD
const SOUTH = [1, 8, 11, 30, 33, 37, 39, 45, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58]
const NORTH = [2, 4, 5, 6, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 31, 34, 35, 36, 40, 41, 42, 43, 44, 46, 48]
export const feeFor = (code, type) => {
  const [home, desk] = SOUTH.includes(code) ? [1450, 1000] : NORTH.includes(code) ? [600, 400] : [800, 550]
  return type === 'desk' ? desk : home
}
