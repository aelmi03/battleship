export default function Player(name) {
  let playerName = name;
  function getName() {
    return playerName;
  }
  function setName(newName) {
    playerName = newName;
  }
  return { getName, setName };
}
