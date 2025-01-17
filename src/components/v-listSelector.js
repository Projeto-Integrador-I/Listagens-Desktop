import { MediaService } from '../services/mediaServices.js'
import { ListService } from '../services/listServices.js'
import { User } from '../model/user.js'

const modal = document.createElement('div')
modal.setAttribute('class', 'listSelector')

const content = document.createElement('div')
content.setAttribute('class', 'modal_content')

const title = document.createElement('h2')
title.setAttribute('class', 'title')
title.innerHTML = 'Selecione a lista'

const selectorDiv = document.createElement('div')
selectorDiv.setAttribute('class', 'selector')

const error = document.createElement('p')
error.setAttribute('id', 'error')

const divBtns = document.createElement('div')
const add = document.createElement('button')
const cancel = document.createElement('button')

add.innerHTML = "Adicionar"
cancel.innerHTML = "Cancelar"

add.setAttribute('id', 'add')
add.setAttribute('class', 'modal_btn')

cancel.setAttribute('id', 'cancel')
cancel.setAttribute('class', 'modal_btn')

divBtns.setAttribute('class', 'modal_btns')

divBtns.appendChild(add)
divBtns.appendChild(cancel)

content.appendChild(title)
content.appendChild(selectorDiv)
content.appendChild(error)
content.appendChild(divBtns)

modal.appendChild(content)

// List Selector ------------------------------------------------
const user = new User();
const userId = await user.getId;

let selectedMedia
let selectedList
let selectedElement

export async function getListSelector(media) {
  modal.style.display = 'flex'
  error.innerHTML = ''

  selectedMedia = media

  const lists = await ListService.getLists()

  if (lists && !selectorDiv.hasChildNodes()) {
    let listItem;

    lists.forEach(list => {
      if (list.userId === userId) {
        listItem = document.createElement('p')
        listItem.setAttribute('class', 'listItem')
        listItem.innerHTML = list.name

        listItem.onclick = (event) => {
          if (!selectedList && !selectedElement) {
            selectedList = list
            selectedElement = event.target

            selectedElement.setAttribute('id', 'selectedItem')
          } else {
            selectedElement.setAttribute('id', '')

            selectedList = list
            selectedElement = event.target

            selectedElement.setAttribute('id', 'selectedItem')
          }
        }

        selectorDiv.appendChild(listItem)
      }
    });

    add.onclick = addMediaToList

    cancel.onclick = () => {
      selectedList = undefined;

      if (selectedElement) {
        selectedElement.setAttribute('id', '')
      }

      modal.style.display = 'none'
    }
  }

  return modal;
}

async function addMediaToList() {
  error.innerHTML = ''

  if (selectedMedia && selectedList) {
    const media = await MediaService.addMedia(selectedMedia)

    const medias = await ListService.getMediasFromList(selectedList.id)

    const result = medias.filter(m => m.apiId === selectedMedia.apiId)

    if (result.length === 0) {
      ListService.addMediaToList(selectedList.id, media.id)

      if (selectedElement) {
        selectedElement.setAttribute('id', '')
      }

      modal.style.display = 'none'
    } else {
      error.innerHTML = 'Mídia já presente nessa lista!'
    }
  }

  if (!selectedList) {
    error.innerHTML = 'Selecione uma Lista!'
  }
}
// --------------------------------------------------------------

// Style --------------------------------------------------------
const style = document.createElement('style')

style.innerHTML = `
    .listSelector {
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      
      left: 0;
      top: 0;
      
      position: fixed;
      z-index: 1;
      
      width: 100%;
      height: 100%;
      
      overflow: auto;
      
      background-color: #00000066;
    }
    
    .modal_content {
      width: 575px;
      height: 375px;
      
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      
      background-color: #000;
      border-radius: 20px;
    }
    
    .title {
      color: #f2f2f2;
      font-size: 30px;
      margin: 0 0 15px 0;
      font-weight: 400;
    }

    .selector {
      width: 80%;
      height: 60%;

      border-radius: 5px;

      overflow: auto;

      background-color: #1F1F1F;
    }

    .listItem {
      font-size: 15px;
      color: #fff;

      cursor: pointer;

      margin: 0;
      padding: 8px 0 8px 8px;
    }

    .listItem:hover {
      background-color: #6F6F6F;
    }

    #selectedItem {
      background-color: #6F6F6F;
    }
    
    #error {
      color: #fff;
      margin: 10px 0 0 0;
      font-size: 14px;
    }
    
    .modal_btns {
      margin-top: 15px;
    }
    
    .modal_btn {
      width: 150px;
      height: 35px;
      
      color: #fff;
      background: linear-gradient(to right, #483d7c 0%, #150b43 161.67%);

      cursor: pointer;

      transition: 0.5s;
      background-size: 200% auto;
      
      font-size: 18px;
      
      margin-left: 5px;
      
      border: none;
      border-radius: 5px;
    }

    .modal_btn:focus {
      outline: none;
    }
    
    .modal_btn:hover {
      background-position: right center;
    }
`

document.head.appendChild(style)
// --------------------------------------------------------------