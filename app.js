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
const createOption = document.getElementById('create');
const canvas = document.getElementById('canvas');
const createRootFolderOption = document.getElementById('create-root-folder');
let currentItem;
let name;
createOption.addEventListener('click', () => createNewFolder(fileStructure, currentItem.value));
createRootFolderOption.addEventListener('click',() => createRootFolder(fileStructure));
renameOption.addEventListener('click', (e) => renameFile(e, fileStructure));
deleteOption.addEventListener('click', () => deleteFile(fileStructure));

function createRootFolder(fileStructure) {
  fileStructure.push({ isOpen: false, extension: 'folder', name: 'New folder', content: []});
  deleteFileStructure();
  drawFileStructure(fileStructure, divFileStructure,1);
}

function traverseFileStructure(fileStructureItems, itemValue, option) {
  for (let i = 0; i < fileStructureItems.length; i++) {
    if (fileStructureItems[i].name === itemValue) {
      if (option === 'createNewFolder') {
        fileStructureItems[i].content.push({ isOpen: false, extension: 'folder', name: 'New folder', content: []});
      } else if (option === 'enterFileName') {
        fileStructureItems[i].name = name;
      } else if (option === 'deleteFile') {
        fileStructureItems.splice(i, 1);
      }
      return;
    }
    if (fileStructureItems[i].content && fileStructureItems[i].content.length > 0) {
      traverseFileStructure(fileStructureItems[i].content, itemValue, option);
    }
  }
}

function createNewFolder(fileStructure, name) {
  contextMenu.setAttribute('hidden', 'hidden');
  traverseFileStructure(fileStructure, name, 'createNewFolder');
  deleteFileStructure();
  drawFileStructure(fileStructure,divFileStructure,1);
}

function addCanvas() {
  contextMenu.style.zIndex = '2';
  canvas.style.zIndex = '1';
  divFileStructure.style.zIndex = '0';
}

function deleteCanvas() {
  canvas.style.zIndex = '0';
  divFileStructure.style.zIndex = '1';
}

function renameFile(e, fileStructureItems) {
  addCanvas();
  let prevName = currentItem.value;
  currentItem.removeAttribute('readonly');
  currentItem.focus();
  contextMenu.setAttribute('hidden', 'hidden');
  name = currentItem.value;
  const onInput = () => name = currentItem.value;
  currentItem.addEventListener('input', onInput);
  const onBlur = () => {
    traverseFileStructure(fileStructureItems, prevName, 'enterFileName');
    deleteFileStructure();
    drawFileStructure(fileStructure, divFileStructure,1);
    currentItem.removeEventListener('input', onInput);
    currentItem.removeEventListener('blur', onBlur);
    deleteCanvas();
  };
  currentItem.addEventListener('blur', onBlur);
}

function deleteFile(fileStructureItems) {
  contextMenu.setAttribute('hidden', 'hidden');
  traverseFileStructure(fileStructureItems, currentItem.value, 'deleteFile');
  deleteFileStructure();
  drawFileStructure(fileStructure, divFileStructure,1);
}

function handleContextMenu(e) {
  console.log('handleContextMenu');
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

function checkIsOpen(elem, folder) {
  folder.isOpen ? elem.classList.add('folder-open') :  elem.classList.add('folder-close');
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

function onFolderClick(e, folder) {
  if(e.which === 1) {
    folder.isOpen = !folder.isOpen;
  }
  let img = document.getElementById(folder.name).firstChild;
  e.target.classList.add(fileStructure.isOpen ? 'folder-open' : 'folder-close');

  deleteFileStructure();
  drawFileStructure(fileStructure, divFileStructure,1)
}

function createElementWithFile(fileStructure, eventListener, folderNesting) {
  let element = document.createElement('div');
  element.classList.add(fileStructure.extension === 'folder' ? 'folder' : 'file');
  element.id = fileStructure.name;
  if (eventListener) {
    element.addEventListener('click', (e) => eventListener(e, fileStructure));
  }
  let input = document.createElement('input');
  input.value = fileStructure.name;
  input.classList.add('file-name');
  input.setAttribute('readonly', 'readonly');
  let img = document.createElement('img');
  if(fileStructure.extension === 'folder') {
    element.classList.add(fileStructure.isOpen ? 'folder-open' : 'folder-close');
  }
  img.classList.add('file-logo');
  element.append(img);
  element.append(input);
  doIndent(element, folderNesting);
  return element;
}

function drawFileStructure(fileStructure, parentFolder, folderNesting ) {
  for(let i = 0; i < fileStructure.length; i++) {
    if (fileStructure[i].extension === 'folder') {
      let div = document.createElement('div');
      let element = createElementWithFile(fileStructure[i], onFolderClick, folderNesting);
      div.append(element);
      parentFolder.append(div);

      if(!fileStructure[i].isOpen) {
        continue;
      }

      if (fileStructure[i].content.length > 0) {
        drawFileStructure(fileStructure[i].content, div, folderNesting+1);
      } else {
          let i = document.createElement('i');
          i.innerHTML = 'Folder is empty';
          parentFolder.append(i);
          doIndent(i, folderNesting + 1);
        }
    } else {
      let element = createElementWithFile(fileStructure[i], null, folderNesting);
      parentFolder.append(element);
    }
  }
}

drawFileStructure(fileStructure,divFileStructure,1);