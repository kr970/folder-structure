let fileStructure = [
  {
    isOpen: true,
    extension: 'folder',
    name: 'Pictures',
    content: [
      {
        extension: '.png',
        name: 'logo'
      },
      {
        isOpen: false,
        extension: 'folder',
        name: 'Vacationc',
        content: [{extension: '.jpeg', name: 'spaing'}]
      }
    ]
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Desktop',
    content: [
      {isOpen: false,extension: 'folder', name: 'screenshots', content: []}
    ]
  },
  {
    isOpen: false,
    extension: 'folder',
    name: 'Downloads',
    content: [
      {extension: '.txt', name: 'credentials'}
    ]
  }
];


const divFileStructure = document.getElementById('file-structure');
const contextMenu = document.getElementById('context-menu');

function handleContextMenu(e) {
  e.stopPropagation();
  if(e.button === 2) {
    if(contextMenu.hasAttribute('hidden')) {
      contextMenu.removeAttribute('hidden');
      contextMenu.style.left = e.clientX + 'px';
      contextMenu.style.top = e.clientY + 'px';
    } else {
      contextMenu.setAttribute('hidden','hidden');
    }
  } else {
    contextMenu.setAttribute('hidden','hidden');
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
  let span = document.createElement('span');
  span.innerHTML = fileStructureName;
  span.classList.add('file-name');
  let img = document.createElement('img');
  img.src = imageSrc;
  img.classList.add('file-logo');
  container.append(img);
  container.append(span);
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