import electron from 'electron';

const remote = electron.remote;
const Menu = remote.Menu;

const templateForEditArea = [
  {
    label: '撤消',
    role: 'undo'
  },
  {
    label: '恢复',
    role: 'redo'
  },
  {
    type: 'separator'
  },
  {
    label: '剪切',
    role: 'cut'
  },
  {
    label: '复制',
    role: 'copy'
  },
  {
    label: '粘贴',
    role: 'paste'
  },
  {
    type: 'separator'
  },
  {
    label: '全选',
    role: 'selectall'
  }
];
const templateForCopyArea = [
  {
    label: '复制',
    role: 'copy'
  }
];
const InputMenu = Menu.buildFromTemplate(templateForEditArea);
const CopyMenu = Menu.buildFromTemplate(templateForCopyArea);

function addListener() {
  document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let node = e.target;

    while (node) {
      // 节点是否可编辑
      const isNodeEditable =
        node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable;
      // 是否有选中的文本
      const hasSelectedText = window.getSelection().toString();

      if (isNodeEditable || hasSelectedText) {
        (hasSelectedText && !isNodeEditable ? CopyMenu : InputMenu).popup();

        break;
      }

      node = node.parentNode;
    }
  });
}

function listenContextMenu() {
  if (document.body) {
    addListener();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      addListener();
    });
  }
}

listenContextMenu();
