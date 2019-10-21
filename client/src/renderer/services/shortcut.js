import electron from 'electron';

const { remote } = electron;

const KEY_A = 0x41; // (65) "A" key.
const KEY_C = 0x43; // (67) "C" key.
const KEY_V = 0x56; // (86) "V" key.
const KEY_X = 0x58; // (88) "X" key.
const KEY_Z = 0x5a; // (90) "Z" key.

function action(name, evt) {
  const contents = remote.getCurrentWebContents();

  contents[name]();
  evt.preventDefault();

  return false;
}

function handleInputShortcuts(evt) {
  const node = evt.target;
  const c = evt.keyCode;
  const ctrlDown = evt.ctrlKey || evt.metaKey; // OSX support
  const altDown = evt.altKey;
  const shiftDown = evt.shiftKey;

  if (altDown) {
    return true;
  }

  if (!(node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable)) {
    return true;
  }

  if (ctrlDown && !shiftDown && c === KEY_C) {
    return action('copy', evt);
  }

  if (ctrlDown && !shiftDown && c === KEY_V) {
    return action('paste', evt);
  }

  if (ctrlDown && !shiftDown && c === KEY_X) {
    return action('cut', evt);
  }

  if (ctrlDown && !shiftDown && c === KEY_A) {
    return action('selectAll', evt);
  }

  if (ctrlDown && !shiftDown && c === KEY_Z) {
    return action('undo', evt);
  }

  if (ctrlDown && shiftDown && c === KEY_Z) {
    return action('redo', evt);
  }

  return true;
}

function addListener() {
  document.body.addEventListener('keydown', handleInputShortcuts);
}

function registerShortcuts() {
  if (document.body) {
    addListener();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      addListener();
    });
  }
}

registerShortcuts();
