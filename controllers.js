import { encrypt } from './script.js';
import { addBits } from './helper.js';

let inputField = document.querySelector('.io #input');
let keyField = document.querySelector('.encrypt-actions #key');
let arrowholder = document.querySelector('.arrow-holder');
let inputTable = document.querySelector('.input-table');
let keyTable = document.querySelector('.key-table');
var inputascii = [];
var keyascii = [];

inputField.addEventListener('keyup', (e) => {
  var input = e.target.value;
  if (input.length > 0 && keyField.value.length > 0) {
    arrowholder.classList.remove('inactive');
  } else {
    arrowholder.classList.add('inactive');
  }

  inputascii = addBits(input, inputTable);
});

keyField.addEventListener('keyup', (e) => {
  var input = e.target.value;

  if (input.length > 0 && inputField.value.length > 0) {
    arrowholder.classList.remove('inactive');
  } else {
    arrowholder.classList.add('inactive');
  }

  keyascii = addBits(input, keyTable);
});

arrowholder.addEventListener('click', () => encrypt(inputascii, keyascii));
