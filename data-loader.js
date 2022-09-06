import jsonData from './data.json' assert { type: 'json' };

function textInterpreter(data) {
  Object.keys(data).forEach((tag) => {
    let element = document.querySelector(tag);
    if (element) {
      if (Array.isArray(data[tag])) {
        data[tag].forEach((item) => {
          element.innerHTML += `<span>${item}</span>`;
        });
      } else {
        element.innerHTML = data[tag];
      }
    } else {
      console.error(`Element ${tag} not found`);
    }
  });
}

textInterpreter(jsonData);
