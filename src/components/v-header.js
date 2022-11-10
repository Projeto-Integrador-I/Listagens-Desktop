import { User } from "../model/user.js"

const url = window.location.href

const nav = document.getElementById("header")
const logo = document.createElement("img")
const navList = document.createElement("ul")

const navItems = [
  { href: "Home/index.html", text: "Home" },
  { href: "Lists/index.html", text: "Listas" },
  { href: "Search/index.html", text: "Pesquisas" }
]

let navItem, navLink

const perfil = document.createElement("div")
const username = document.createElement("span")
const userIcon = document.createElement("img")

logo.setAttribute("src", "../../../assets/moon.svg")
logo.setAttribute("class", "logo")

logo.onclick = () => {
  window.location.href = "../Home/index.html";
}

nav.setAttribute("class", "header")
navList.setAttribute("class", "menu-options")

navItems.forEach(item => {
  navItem = document.createElement("li")
  navLink = document.createElement("a")

  navItem.setAttribute("class", "menu-option")

  if (url.includes(item.href)) {
    navLink.setAttribute("class", "option-active")
  }

  navLink.href = `../${item.href}`
  navLink.innerHTML = item.text

  navItem.appendChild(navLink)
  navList.appendChild(navItem)
});

perfil.setAttribute("class", "perfil")

let user = new User();
const nombre = async () => {
  const name = await user.getLogin;
  username.innerHTML = name;
}
nombre();

userIcon.setAttribute("src", "../../../assets/User.svg")

perfil.appendChild(username)
perfil.appendChild(userIcon)

nav.appendChild(logo)
nav.appendChild(navList)
nav.appendChild(perfil)