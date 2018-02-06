export function addCommas(num) {
  // Only add commas to the left side of the number.
  if(parseFloat(num) > 999) {
    let stringNum = `${num}`
    let halves = stringNum.split('.')
    return `${halves[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${halves[1] || '00'}`
  }
  else
    return num
}
