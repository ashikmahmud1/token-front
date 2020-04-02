export function generateBrighterColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const roles = {
  ROLE_ADMIN: "admin",
  ROLE_TOKENIST: "tokenist",
  ROLE_STAFF: "staff"
};

export function search(arr = [], keys = [], value = '') {
  const new_arr = [];
  arr.reduce((accumulator, currentValue) => {
      for (let i = 0; i < keys.length; i++) {
        // check if keys[i] == roles
        // check if keys[i] == customer
        // check if keys[i] == counter
        // check if keys[i] == user
        if (keys[i] === 'roles') {
          if (roles[currentValue[keys[i]][0].name].toLowerCase().includes(value.trim().toLowerCase())) {
            new_arr.push(currentValue);
            break;
          }
        } else if (keys[i] === 'customer' || keys[i] === 'user' || keys[i] === 'counter' || keys[i] === 'department') {
          if (currentValue[keys[i]]) {
            if (currentValue[keys[i]].name.toLowerCase().includes(value.trim().toLowerCase())) {
              new_arr.push(currentValue);
              break;
            }
          }
        } else if (currentValue[keys[i]] !== null) {
          let str_value = "" + currentValue[keys[i]];
          if (str_value.toLowerCase().includes(value.trim().toLowerCase())) {
            new_arr.push(currentValue);
            break;
          }
        }
      }

    }
    ,
    {});
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
