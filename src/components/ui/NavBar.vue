<script setup lang="ts">

import SettingsModal from "./SettingsModal.vue";

const menu_items = ["home", "page", "settings"]
const sub_pages = ["view 1", "view 2"]

</script>

<template>
  <div class="navbar py-5 bg-base-100 container mx-auto [--navbar-padding:0]">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"/>
          </svg>
        </div>
        <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li><a>{{ menu_items[0] }}</a></li>
          <li>
            <a>{{ menu_items[1] }}</a>
            <ul class="p-2">
              <li><a>{{ sub_pages[0] }}</a></li>
              <li><a>{{ sub_pages[1] }}</a></li>
            </ul>
          </li>
          <li><a>{{ menu_items[2] }}</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">potato_JAM 🥔</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a>{{ menu_items[0] }}</a></li>
        <li>
          <details>
            <summary>{{ menu_items[1] }}</summary>
            <ul class="p-2">
              <li><a>{{ sub_pages[0] }}</a></li>
              <li><a>{{ sub_pages[1] }}</a></li>
            </ul>
          </details>
        </li>
        <li><a>{{ menu_items[2] }}</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <button
          class="btn btn-gradient"
          onclick="settings_modal.showModal()"
      >
        click for free potato (aka settings)
      </button>
    </div>
  </div>
  <SettingsModal id="settings_modal"/>
</template>

<style scoped>

</style>