export function generateBrighterColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export function search(arr = [], keys = [], value='') {
  const new_arr = [];
  arr.reduce((accumulator, currentValue) => {
    for (let i = 0; i < keys.length; i++) {
      if (currentValue[keys[i]].toLowerCase().includes(value.trim().toLowerCase())) {
        new_arr.push(currentValue);
        break;
      }
    }
  }, {});
  return new_arr;
}
