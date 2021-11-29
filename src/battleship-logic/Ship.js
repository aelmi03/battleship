export default function Ship(length) {
  if (length <= 0) return null;
  const hits = [];
  function hit(position) {
    if (position >= length || position < 0 || hits.includes(position)) return;
    hits.push(position);
  }
  function isHit(position) {
    return hits.includes(position);
  }
  function isSunk() {
    return hits.length === length;
  }
  return {
    length,
    hits,
    isSunk,
    isHit,
    hit,
  };
}
