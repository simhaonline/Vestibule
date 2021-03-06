// Imports
import * as Auth from "/services/auth/auth.js";
import * as brand from "/assets/brand/brand.js";
import { AnimateCSS } from "/services/common/common.js";

// local variables
let user;
let menu;

export function mount(mountpoint) {
  const where = document.getElementById(mountpoint);
  window.document.title = brand.windowTitle;
  where.innerHTML = /* HTML */ `
    <div class="navbar-brand">
      <a class="navbar-item is-size-4" href="/"><img src="assets/brand/logo.svg" alt="logo" />${brand.navTitle}</a>
      <a role="button" id="navbar-burger" class="navbar-burger burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbar-menu" class="navbar-menu"></div>
  `;
  // Hamburger menu
  const burger = document.getElementById("navbar-burger");
  menu = document.getElementById("navbar-menu");
  const openClose = async (e) => {
    if (burger.classList.contains("is-active")) {
      await AnimateCSS(menu, "slideOutRight");
      menu.classList.remove("is-active");
      burger.classList.remove("is-active");
    } else {
      if (e.srcElement == burger) {
        menu.classList.add("is-active");
        burger.classList.add("is-active");
        AnimateCSS(menu, "slideInRight");
      }
    }
  };
  burger.addEventListener("click", openClose);
  menu.addEventListener("click", openClose);
  CreateMenu();
}

export async function CreateMenu() {
  user = await Auth.GetUser();
  menu.innerHTML = /* HTML */ `
    <div class="navbar-start">
      ${user === undefined
        ? ``
        : /* HTML */ `
            <a id="navbar-apps" class="navbar-item" href="#apps"><i class="navbar-menu-icon fas fa-home"></i>Apps</a>
            <a id="navbar-davs" class="navbar-item" href="#davs"><i class="navbar-menu-icon fas fa-folder-open"></i>Files</a>
            ${user.isAdmin
              ? /* HTML */ `
                  <a id="navbar-users" class="navbar-item" href="#users"><i class="navbar-menu-icon fas fa-users"></i>Users</a>
                  <a id="navbar-sysinfo" class="navbar-item" href="#sysinfo"><i class="navbar-menu-icon fas fa-stethoscope"></i>System information</a>
                `
              : ""}
          `}
    </div>
    <div class="navbar-end">
      ${user === undefined
        ? /* HTML */ ` <a class="navbar-item" href="#login"><i class="navbar-menu-icon fas fa-sign-in-alt"></i>Log in</a> `
        : /* HTML */ ` <a class="navbar-item" href="/Logout"><i class="navbar-menu-icon fas fa-sign-out-alt"></i>Log out</a> `}
    </div>
  `;
  SetActiveItem();
}

export function SetActiveItem() {
  const items = document.getElementsByClassName("navbar-item");
  for (const i of items) {
    i.classList.remove("is-active");
    if (i.id == "navbar-" + location.hash.substring(1)) {
      i.classList.add("is-active");
    }
  }
}
