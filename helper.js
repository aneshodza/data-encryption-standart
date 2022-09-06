function beforeDisplay(holderSelector, idx) {
  let title = document.querySelector(`${holderSelector}-title`);
  let holder = document.querySelector(holderSelector);
  let output = holder.querySelectorAll('.table')[idx];
  if (title) {
    title.classList.add('shown');
  }
  holder.classList.add('shown');
  output.innerHTML = '';
  return output;
}

export function addBits(inputVal, output) {
  const ascii = [];

  for (const c of inputVal) {
    let binary = (c.charCodeAt(0) >>> 0).toString(2);
    for (const oc of binary) {
      ascii.push(Number(oc));
    }
    for (let i = 0; i < 8 - binary.length; i++) {
      ascii.push(0);
    }
  }
  const initialLength = ascii.length;
  for (let idx = 0; idx < 64 - initialLength; idx++) {
    ascii.push(0);
  }
  output.innerHTML = '';
  ascii.forEach((bit, idx) => {
    if (idx >= initialLength) {
      output.innerHTML += `<span>${bit}</span>`;
    } else {
      output.innerHTML += `<span class='active-bit'>${bit}</span>`;
    }
  });

  return ascii;
}

export function deletedBits(key) {
  let output = beforeDisplay('.deleted-bits', 0);
  key.forEach((bit, idx) => {
    if (idx % 8 === 7) {
      output.innerHTML += `<span>${key[idx]}</span>`;
    } else {
      output.innerHTML += `<span class='active-bit'>${key[idx]}</span>`;
    }
  });
}

export function genericPrint(bits, selector, idx) {
  let output = beforeDisplay(selector, idx);
  bits.forEach((bit) => {
    output.innerHTML += `<span class='active-bit'>${bit}</span>`;
  });
}
