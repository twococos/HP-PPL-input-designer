let baseLevel = 0

const defaultMargin = 5

// Declaracio d'objectes del DOM

const card = document.getElementById("card")
const screen = document.getElementById("screen")
const titleBar = document.getElementById("title_bar")
const createBtn = document.getElementById("create_btn")
const htmlList = document.getElementById("list")

const output = document.getElementById("output")
const outputCard = document.getElementById("output_card")
const copyButton = document.getElementById("copy_button")

const titleInput = document.getElementById("title_input")
const variableInput = document.getElementById("variable_input")
const nameInput = document.getElementById("name_input")
const descriptionInput = document.getElementById("description_input")
const typeInput = document.getElementById("type_input")
const divNumberType = document.getElementById("div_number_type")
const divListContent = document.getElementById("div_list_content")
const divCheckbox = document.getElementById("div_checkbox")
const numberTypeInput = document.getElementById("number_type_input")
const listContentInput = document.getElementById("list_content_input")
const checkedCheckbox = document.getElementById("checked_checkbox")
const settingsTitle = document.getElementById("settings_title")
const descriptionText = document.getElementById("description_text")

class inputElement {
  constructor() {
    this.dom = undefined
    this.variable = ""
    this.type = "1"
    this.typecontent = "1"
    this.typetext = "[0]"
    this.title = ""
    this.description = ""
    this.x = NaN
    this.y = NaN
    this.width = NaN
    this.height = NaN
  }

  getPositionVector() {
    return {
      x: (100 * this.x) / screen.offsetWidth,
      width: (100 * this.width) / screen.offsetWidth,
      ylevel: Math.round(
        (this.y - screen.offsetHeight * (4 / 48)) / ((screen.offsetHeight * (40 / 48)) / 8)
      ),
    }
  }
}

const eList = new Array() // List of elements
let sel = 0 // Selected Element

createBtn.onclick = () => {
  let newElement = document.createElement("div")
  newElement.classList.add("element")
  newElement.id = eList.length
  newElement.innerHTML = `
    <div class="right-swiper swiper fa fa-angle-right" hidden></div>
    <div class="left-swiper swiper fa fa-angle-left" hidden></div>
    <div class="card-title"></div>
    <div class="delete-element fa fa-trash-can" hidden></div>`
  htmlList.appendChild(newElement)
  eList.push(new inputElement())
}

const cursor = {
  x: null,
  y: null,
}

let swiper = {
  dom: null,
  x: null,
}

// Listeners dels elements

copyButton.addEventListener("click", function () {
  navigator.clipboard.writeText(output.innerHTML)

  // Alert the copied text
  alert("Text copiat al porta-retalls")
})

titleInput.addEventListener("input", () => {
  updateOutput()
})

variableInput.addEventListener("input", () => {
  eList[sel].variable = variableInput.value
  updateOutput()
})

nameInput.addEventListener("input", () => {
  eList[sel].title = nameInput.value
  eList[sel].dom.children.item(2).innerHTML = nameInput.value
  eList[sel].dom.children.item(2).style.left =
    -10 - eList[sel].dom.children.item(2).offsetWidth + "px"
  updateOutput()
})

typeInput.addEventListener("change", () => {
  eList[sel].type = typeInput.value
  updateType()
  updateOutput()
})

numberTypeInput.addEventListener("input", () => {
  eList[sel].typetext = "[" + numberTypeInput.value + "]"
  eList[sel].typecontent = numberTypeInput.value
  updateOutput()
})

listContentInput.addEventListener("input", () => {
  eList[sel].typetext = listContentInput.value
  eList[sel].typecontent = listContentInput.value
  updateOutput()
})

checkedCheckbox.addEventListener("input", () => {
  eList[sel].typetext = checkedCheckbox.checked ? "1" : "0"
  eList[sel].typecontent = checkedCheckbox.value
  updateOutput()
})

descriptionInput.addEventListener("input", () => {
  eList[sel].description = " " + descriptionInput.value
  descriptionText.innerHTML = " " + descriptionInput.value
  updateOutput()
})

// Listener global per al drag & drop

document.addEventListener("mousedown", mouseDown)

function mouseDown(e) {
  if (eList[sel] != undefined) {
    if (
      (e.target.classList.contains("element") || e.target.id == "screen") &&
      eList[sel].dom != undefined
    ) {
      eList[sel].dom.classList.remove("selected")

      eList[sel].dom.children.item(0).hidden = true
      eList[sel].dom.children.item(1).hidden = true
      eList[sel].dom.children.item(3).hidden = true
    }
    if (e.target.classList.contains("element")) {
      cursor.x = e.clientX
      cursor.y = e.clientY

      sel = Number(e.target.id)

      eList[sel].dom = e.target
      eList[sel].x = e.target.offsetLeft
      eList[sel].y = e.target.offsetTop
      eList[sel].width = e.target.offsetWidth
      eList[sel].height = e.target.offsetHeight

      eList[sel].dom.classList.add("selected")
      setSettingsValues(eList[sel])
      updateType()

      disableSettings(false)

      if (eList[sel].type != "3") {
        eList[sel].dom.children.item(0).hidden = false
        eList[sel].dom.children.item(1).hidden = false
        eList[sel].dom.children.item(3).hidden = false
      }

      document.addEventListener("mousemove", mouseMoveElement)
      document.addEventListener("mouseup", mouseUpElement)
    } else if (e.target.classList.contains("swiper")) {
      cursor.x = e.clientX
      cursor.y = e.clientY

      swiper = {
        dom: e.target,
        x: e.target.offsetLeft,
      }

      document.addEventListener("mousemove", mouseMoveSwiper)
      document.addEventListener("mouseup", mouseUpSwiper)
    } else if (e.target.classList.contains("delete-element")) {
      eList[sel].dom.remove()
      delete eList[sel]

      sel = 0
      updateOutput()
    } else if (e.target.id == "screen") {
      disableSettings(true)
    }
  }
}

function mouseMoveElement(e) {
  const displacement = {
    x: box(
      e.clientX - cursor.x,
      -eList[sel].x,
      -eList[sel].x - eList[sel].width + screen.offsetWidth,
      defaultMargin
    ),
    y: box(
      e.clientY - cursor.y,
      -eList[sel].y,
      -eList[sel].y - eList[sel].height + screen.offsetHeight,
      defaultMargin
    ),
  }

  eList[sel].dom.style.left = eList[sel].x + displacement.x + "px"
  eList[sel].dom.style.top =
    setLevel(
      eList[sel].y + displacement.y,
      titleBar.offsetHeight,
      screen.offsetHeight - eList[sel].dom.offsetHeight,
      8,
      5
    ) + "px"
}

function mouseUpElement(e) {
  document.removeEventListener("mousemove", mouseMoveElement)
  // Actualitza Posicio de l'element
  eList[sel].x = eList[sel].dom.offsetLeft
  eList[sel].y = eList[sel].dom.offsetTop
  updateOutput()
}

function mouseMoveSwiper(e) {
  if (swiper.dom.classList.contains("right-swiper")) {
    const displacement = box(
      e.clientX - cursor.x,
      -eList[sel].width,
      -eList[sel].x - eList[sel].width + screen.offsetWidth,
      defaultMargin
    )
    eList[sel].dom.style.width = eList[sel].width + displacement + "px"
  } else {
    const displacement = box(e.clientX - cursor.x, -eList[sel].x, eList[sel].width, defaultMargin)
    eList[sel].dom.style.width = eList[sel].width - displacement + "px"
    eList[sel].dom.style.left = eList[sel].x + displacement + "px"
  }
}

function mouseUpSwiper(e) {
  document.removeEventListener("mousemove", mouseMoveSwiper)
  // Actualitza amplada
  eList[sel].width = eList[sel].dom.offsetWidth
  updateOutput()
}

function box(value, minValue, maxValue, margin) {
  value = value < minValue + margin ? minValue + margin : value
  value = value > maxValue - 2.5 * margin ? maxValue - 2.5 * margin : value

  return value
}

function setLevel(value, minValue, maxValue, levelNumber, margin) {
  const levelHeight = (maxValue - minValue - 2 * margin) / levelNumber
  let finalValue = minValue + margin
  for (let i = 1; i < levelNumber; i++) {
    finalValue =
      value < minValue + levelHeight * i + margin ? finalValue : minValue + levelHeight * i + margin
  }

  return finalValue
}

function updateType() {
  if (typeInput.value == "1") {
    eList[sel].dom.style.height = "9.25%"
    eList[sel].dom.children.item(0).hidden = false
    eList[sel].dom.children.item(1).hidden = false
    eList[sel].dom.children.item(3).hidden = false
    eList[sel].dom.classList.remove("desplegable")

    divNumberType.hidden = false
    divListContent.hidden = true
    divCheckbox.hidden = true
    eList[sel].typetext = "[" + numberTypeInput.value + "]"
  } else if (typeInput.value == "2") {
    eList[sel].dom.style.height = "9.25%"
    eList[sel].dom.children.item(0).hidden = false
    eList[sel].dom.children.item(1).hidden = false
    eList[sel].dom.children.item(3).hidden = false
    eList[sel].dom.classList.add("desplegable")
    divNumberType.hidden = true
    divListContent.hidden = false
    divCheckbox.hidden = true
    eList[sel].typetext = listContentInput.value
  } else if (typeInput.value == "3") {
    eList[sel].dom.style.height = "6.5%"
    eList[sel].dom.style.width = eList[sel].dom.offsetHeight + "px"
    eList[sel].dom.classList.remove("desplegable")

    eList[sel].dom.children.item(0).hidden = true
    eList[sel].dom.children.item(1).hidden = true
    eList[sel].dom.children.item(3).hidden = true
    divNumberType.hidden = true
    divListContent.hidden = true
    divCheckbox.hidden = false
    eList[sel].typetext = checkedCheckbox.checked ? "1" : "0"
  }

  numberTypeInput.value = eList[sel].typecontent
  listContentInput.value = eList[sel].typecontent
  checkedCheckbox.value = eList[sel].typecontent
}

function setSettingsValues(elem) {
  variableInput.value = elem.variable
  nameInput.value = elem.title
  descriptionInput.value = elem.description
  typeInput.value = elem.type
  descriptionText.innerHTML = elem.description
  settingsTitle.innerHTML = "Panell d'opcions - Element " + sel
}

function disableSettings(value) {
  nameInput.disabled = value
  typeInput.disabled = value
  descriptionInput.disabled = value
  variableInput.disabled = value
  if (value) {
    nameInput.value = ""
    typeInput.value = "1"
    descriptionInput.value = ""
    variableInput.value = ""
    divNumberType.hidden = true
    divListContent.hidden = true
    divCheckbox.hidden = true
    descriptionText = ""
    settingsTitle.innerHTML = "Panell d'opcions - Seleccionar element"
  }
}

function updateOutput() {
  const text = generateInputText()
  output.innerHTML = text
  outputCard.style.height = (text.split("\n").length - 1) * 25 + 10 + "px"
}

function generateInputText() {
  let text = "INPUT({\n"
  eList.forEach((elem, index) => {
    if (elem != undefined) {
      const posVector = elem.getPositionVector()
      text +=
        "   {" +
        elem.variable +
        "," +
        elem.typetext +
        ",{" +
        Math.round(posVector.x) +
        "," +
        Math.round(posVector.width) +
        "," +
        posVector.ylevel +
        "}}"
      text = index == eList.length ? text + "\n" : text + ",\n"
    }
  })
  text += '   },\n   "' + titleInput.value + '",\n   {\n'
  eList.forEach((elem, index) => {
    if (elem != undefined) {
      text += '   "' + elem.title + '"'
      text = index == eList.length ? text + "\n" : text + ",\n"
    }
  })
  text += "   },\n   {\n"
  eList.forEach((elem, index) => {
    if (elem != undefined) {
      text += '   "' + elem.description + '"'
      text = index == eList.length ? text + "\n" : text + ",\n"
    }
  })
  text += "   }\n);\n"
  return text
}
