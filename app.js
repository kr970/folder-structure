let fileStructure = [
  {
    isOpen: true,
    extension: 'folder',
    name: 'Documents',
    content: [
      {
        extension: '.pdf',
        name: 'CV'
      },
      {
        isOpen: false,
        extension: 'folder',
        name: 'Bank information',
        content: [{extension: '.doc', name: 'requisites'}]
      }
    ]
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Pictures',
    content: [
      {isOpen: false,extension: 'folder', name: 'Nature', content: []}
    ]
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Videos',
    content: [
      {isOpen: false,extension: 'folder', name: 'Films', content: []}
    ]
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Desktop',
    content: []
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Downloads',
    content: [
      {extension: '.jpg', name: 'icons'},
      {extension: '.jpg', name: 'img_1010'}
    ]
  }
];


const divFileStructure = document.getElementById('file-structure');
const contextMenu = document.getElementById('context-menu');
const renameOption = document.getElementById('rename');
const deleteOption = document.getElementById('delete');
const canvas = document.getElementById('canvas');
let currentItem;
let name;

renameOption.addEventListener('click', (e) => renameFile(e, fileStructure));
deleteOption.addEventListener('click', () => deleteFile(fileStructure));

function enterFileName(fileStructureItems, pastName) {
    for (let i = 0; i < fileStructureItems.length; i++) {
      if (fileStructureItems[i].name === pastName) {
        fileStructureItems[i].name = name;
        return;
      }
      if (fileStructureItems[i].content && fileStructureItems[i].content.length > 0) {
        enterFileName(fileStructureItems[i].content, pastName)
      }
    }
}

function renameFile(e, fileStructureItems) {
  let prevName = currentItem.value;
  currentItem.removeAttribute('readonly');
  currentItem.focus();
  contextMenu.setAttribute('hidden', 'hidden');
  name = currentItem.value;
  const onInput = () => name = currentItem.value;
  currentItem.addEventListener('input', onInput);
  const onBlur = () => {
    enterFileName(fileStructureItems, prevName);
    deleteFileStructure();
    drawFileStructure(fileStructure,divFileStructure,1);
    currentItem.removeEventListener('input', onInput);
    currentItem.removeEventListener('blur', onBlur);
  };
  currentItem.addEventListener('blur', onBlur);
}

function deleteFile(fileStructureItems) {
  contextMenu.setAttribute('hidden', 'hidden');
  for (let i = 0; i < fileStructureItems.length; i++) {
    if (fileStructureItems[i].name === currentItem.value) {
      fileStructureItems.splice(i, 1);
      deleteFileStructure();
      drawFileStructure(fileStructure,divFileStructure,1);
      return;
    }
    if (fileStructureItems[i].content && fileStructureItems[i].content.length > 0) {
      deleteFile(fileStructureItems[i].content)
    }
  }
}

function handleContextMenu(e) {
  currentItem = e.target;
  e.stopPropagation();
  if(e.button === 2) {
    if(contextMenu.hasAttribute('hidden')) {
      contextMenu.removeAttribute('hidden');
      contextMenu.style.left = e.clientX + 'px';
      contextMenu.style.top = e.clientY + 'px';
    } else {
      contextMenu.setAttribute('hidden','hidden');
      currentItem = null;
    }
  } else {
    contextMenu.setAttribute('hidden','hidden');
    currentItem = null;
  }
}

divFileStructure.addEventListener('mousedown', handleContextMenu);
document.body.addEventListener('contextmenu', function(e) {
  e.preventDefault();
}, false);

function checkIsOpen(folder) {
  if(!folder.isOpen) return 'pictures/folder_close.svg';
  return 'pictures/folder_open.svg';
}

function doIndent(container, nesting) {
  let marginLeft =  nesting * 20;
  container.style.marginLeft = marginLeft + 'px';
}

function deleteFileStructure() {
  while (divFileStructure.firstChild) {
    divFileStructure.firstChild.remove();
  }
}

function onFolderClick(e,folder) {
  if(e.which === 1) {
    folder.isOpen = !folder.isOpen;
  }
  let img = document.getElementById(folder.name).firstChild;
  img.src = checkIsOpen(folder);

  deleteFileStructure();
  drawFileStructure(fileStructure,divFileStructure,1)
}

function createContainerWithFile(fileStructureName, fileStructure, eventListener, imageSrc, folderNesting, fileStructureExtension = '') {
  let container = document.createElement('div');
  container.classList.add ('container');
  container.id = fileStructureName + fileStructureExtension;
  if (eventListener) {
    container.addEventListener('click', (e) => eventListener(e, fileStructure));
  }
  let input = document.createElement('input');
  input.value = fileStructureName;
  input.classList.add('file-name');
  input.setAttribute('readonly', 'readonly');
  let img = document.createElement('img');
  img.src = imageSrc;
  img.classList.add('file-logo');
  container.append(img);
  container.append(input);
  doIndent(container, folderNesting);
  return container;
}

function drawFileStructure(fileStructure,parentFolder,folderNesting ) {
  for(let i = 0; i < fileStructure.length; i++) {
    if (fileStructure[i].extension === 'folder') {
      let div = document.createElement('div');
      let container = createContainerWithFile(fileStructure[i].name, fileStructure[i], onFolderClick, checkIsOpen(fileStructure), folderNesting);
      div.append(container);
      parentFolder.append(div);

      if(!fileStructure[i].isOpen) {
        continue;
      }

      if (fileStructure[i].content.length > 0) {
        drawFileStructure(fileStructure[i].content,div,folderNesting+1);
      } else {
          let i = document.createElement('i');
          i.innerHTML = 'Folder is empty';
          parentFolder.append(i);
          doIndent(i, folderNesting + 1);
        }
    } else {
      let container = createContainerWithFile(fileStructure[i].name, fileStructure[i], null, 'pictures/file.svg', folderNesting, fileStructure[i].extension);
      parentFolder.append(container);
    }
  }
}

drawFileStructure(fileStructure,divFileStructure,1);