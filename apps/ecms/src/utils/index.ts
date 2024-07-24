/**
 * 获取随机数
 * @param min
 * @param max
 * @returns
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机数组
 */
export function getRandomArray(options: {
  count: number;
  min: number;
  max: number;
}) {
  const { count, min, max } = options;

  // 确保最小值和最大值在合理的范围内，并且最小值小于最大值
  if (
    min >= max ||
    count <= 0 ||
    isNaN(min) ||
    isNaN(max) ||
    !Number.isInteger(count)
  ) {
    throw new Error(
      "Invalid parameters. min must be less than max, and count must be a positive integer."
    );
  }
  const array: number[] = [];
  for (let i = 0; i < count; i++) {
    // 生成一个[min, max)范围内的随机数
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    array.push(randomNum);
  }

  return array;
}
/**
 * 生成随机数组
 */
export function getRandomArray2(max: number) {
  let arr = [];
  for (let i = 0; i < max; i++) {
    arr.push(i);
  }
  return arr;
}
