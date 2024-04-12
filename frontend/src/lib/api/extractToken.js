export function extractToken(token) {

  let tokenFormated = '';

  const cookiesArray = token.split('; ');
    if (cookiesArray.length === 1) {
      tokenFormated = token.replace('token=', '');
    } else {
      for (let i = 0; i < cookiesArray.length; i++) {
        if (cookiesArray[i].startsWith('token=')) {
          tokenFormated = cookiesArray[i].split('=')[1];
          break;
        }
      }
    }
    return tokenFormated;
}