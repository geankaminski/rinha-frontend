<script setup>
defineProps(["json"]);

const isObject = (obj) => obj && typeof obj === "object";
const isArray = (arr) => Array.isArray(arr);
const isString = (str) => typeof str === "string";
const isNull = (value) => value === null;
const isNumber = (value) => typeof value === "number";
</script>

<template>
  <ul role="tree" aria-label="JSON Tree" tabindex="0">
    <li
      v-for="(value, key) in json"
      :key="key"
      @click="handleClick"
      aria-label="JSON element"
    >
      <div
        class="element"
        :class="{
          nested: isObject(value),
          array: isArray(value),
        }"
      >
        <span :class="{ key: isNumber(key) }">{{ key }}: </span>
        <span class="bracket">{{ isArray(value) ? "[" : "" }}</span>
      </div>
      <JSONTree v-if="isObject(value)" :json="value" />
      <span v-else>
        {{ isString(value) ? `"${value}"` : "" }}
        {{ isNull(value) ? "null" : "" }}
        {{ !isString(value) && !isNull(value) ? value : "" }}
      </span>
      <span class="bracket">{{ isArray(value) ? "]" : "" }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  list-style-type: none;
  padding-left: 1.4rem;

  li {
    position: relative;
    margin: 0.7rem 0;

    .element {
      display: inline;
      color: #4e9590;
      /* gambiarrinha */
      background: #fff;
    }

    .nested::after {
      content: "";
      position: absolute;
      top: 1.3rem;
      left: 2px;
      width: 1px;
      height: 100%;
      background-color: #bfbfbf;
      z-index: -1;
    }
  }
}

.bracket {
  color: #f2cab8;
  font-weight: 700;
  /* gambiarrinha */
  background: #fff;
  padding: 3px 0px 24px 0px;
}

.key {
  color: #bfbfbf;
  /* gambiarrinha */
  background: #fff;
  padding-top: 4px;
}
</style>
