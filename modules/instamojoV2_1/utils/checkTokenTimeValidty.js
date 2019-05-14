function checkTokenTimeValidty(loginTime, validDuration) {
  const timeDiff = (new Date().getTime() - loginTime.getTime()) / 1000;
  console.log('timediff', timeDiff);
  console.log('expiresin', validDuration);
  return timeDiff < validDuration;
}

module.exports = checkTokenTimeValidty;
