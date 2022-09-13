import { deletedBits, genericPrint } from './helper.js';
import jsonData from './data.json' assert { type: 'json' };

let round = 0;

export function encrypt(input, key) {
  let newKey = [];
  key.forEach((bit, idx) => {
    if (idx % 8 !== 0) {
      newKey.push(bit);
    }
  });
  deletedBits(key);
  let movedBits = Array(64).fill(0);
  jsonData['.initial-permutation-table'].forEach((idx, i) => {
    movedBits[idx - 1] = input[i];
  });
  genericPrint(movedBits, '.moved-bits', 1);
  let left = movedBits.slice(0, 32);
  let right = movedBits.slice(32, 64);
  genericPrint(left, '.split-bits', 0);
  genericPrint(right, '.split-bits', 1);
  rounds(input, newKey, 0, left, right);
}

async function rounds(input, key, delay, left, right) {
  let leftKey = key.slice(0, 28);
  let rightKey = key.slice(28, 56);
  if (round === 0) {
    genericPrint(leftKey, '.shift-key', 0);
    genericPrint(rightKey, '.shift-key', 1);
  }
  let temp = leftKey.shift();
  leftKey.push(temp);
  temp = rightKey.shift();
  rightKey.push(temp);

  let fullKey = leftKey.concat(rightKey);
  let newKey = [];
  jsonData['.compression-permutation-table'].forEach((idx) => {
    newKey.push(fullKey[idx - 1]);
  });

  if (round === 0) genericPrint(newKey, '.compression-permutation', 1);

  let expandedLeft = expand(left);
  let expandedRight = expand(right);

  let xorRes = [];

  if (round % 2 === 0) {
    xorRes = xor(expandedRight, newKey);
  } else {
    xorRes = xor(expandedLeft, newKey);
  }

  let sBoxRes = [];

  for (let i = 0; i < 8; i++) {
    let row = xorRes[i * 6] * 2 + xorRes[i * 6 + 5];
    let col =
      xorRes[i * 6 + 1] * 8 +
      xorRes[i * 6 + 2] * 4 +
      xorRes[i * 6 + 3] * 2 +
      xorRes[i * 6 + 4];
    let sBox = jsonData[jsonData['.sbox-table'][i]];
    let binary = (sBox[row * 16 + col] >>> 0).toString(2);
    for (let j = 0; j < 4 - binary.length; j++) {
      sBoxRes.push(0);
    }
    for (let j = 0; j < binary.length; j++) {
      sBoxRes.push(Number(binary[j]));
    }
  }

  if (round === 0) {
    genericPrint(leftKey, '.shift-key', 0);
    genericPrint(rightKey, '.shift-key', 1);
    genericPrint(right, '.split-into-four', 0);
    genericPrint(expandedRight, '.split-into-four', 1);
    genericPrint(newKey, '.key-block-xor', 0);
    genericPrint(xorRes, '.key-block-xor', 1);
    genericPrint(xorRes.slice(0, 6), '.sbox', 0);
    genericPrint(sBoxRes.slice(0, 4), '.sbox', 1);
    genericPrint(left, '.final-xor', 0);
  }

  if (round % 2 === 0) {
    right = xor(sBoxRes, left);
  } else {
    left = xor(sBoxRes, right);
  }

  if (round === 0) genericPrint(right, '.final-xor', 1);

  if (round === 15) {
    round = 0;
    genericPrint(left.concat(right), '.final-concatination', 0);
    finalSteps(left.concat(right));
  } else {
    round++;
    setTimeout(() => rounds(input, key, delay, left, right), delay);
  }
}

function finalSteps(result) {
  let finalResult = [];
  jsonData['.final-permutation-table'].forEach((idx) => {
    finalResult.push(result[idx - 1]);
  });
  console.log(finalResult);
  genericPrint(finalResult, '.final-result', 0);
  let binaryOutput = '';
  finalResult.forEach((bit, idx) => {
    if (idx % 8 === 0 && idx !== 0) {
      binaryOutput += ' ';
    }
    binaryOutput += '' + bit;
  });
  console.log(binaryOutput);

  var binString = '';

  binaryOutput.split(' ').map(function (bin) {
    binString += String.fromCharCode(parseInt(bin, 2));
  });
  console.log(binString);
  document.querySelector('.io #output').value = binString;

  return finalResult;
}

function expand(side) {
  let result = [];

  result.push(side[side.length - 1]);
  side.forEach((bit, idx) => {
    if (idx % 4 === 0 && idx !== 0) {
      result.push(side[idx - 1]);
    }
    result.push(bit);
    if (idx % 4 === 3 && idx !== side.length - 1) {
      result.push(side[idx + 1]);
    }
  });
  result.push(side[0]);
  return result;
}

function xor(side, key) {
  let result = [];
  side.forEach((bit, idx) => {
    result.push(bit ^ key[idx]);
  });
  return result;
}
