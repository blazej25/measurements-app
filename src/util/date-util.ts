export function getDateString(date: Date): string {
  return `${zeroPad(date.getDate())}.${zeroPad(
    date.getMonth() + 1,
  )}.${date.getFullYear()}`;
}

export function getTimeString(date: Date): string {
  return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`;
}

// Adds zero padding to a number up to two digits long.
// Should be used for showing hours, minutes, seconds, days etc.
function zeroPad(num: number) {
  return num.toString().padStart(2, '0');
}
