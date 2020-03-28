export function generateBrighterColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export function search(arr = [], keys = [], value = '') {
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

export function addAuthorization(headers) {
  if (localStorage.getItem('token_user')) {
    let token_user = JSON.parse(localStorage.getItem('token_user'));
    headers.append("Authorization", `${token_user.tokenType} ${token_user.accessToken}`);
  }
  return headers
}

export function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}
