<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import JSONTree from "@/components/JSONTree.vue";

import { mergeJson, sliceJson } from "@/utils/json.js";

const loading = ref(false);
const error = ref(null);
const filename = ref(null);

const fullJson = ref(null);
const json = ref(null);

const currentPage = ref(1);
const pageSize = 15;

const reset = () => {
  error.value = null;
  filename.value = null;

  fullJson.value = null;
  json.value = null;

  currentPage.value = 1;
};

const handleJson = async (e) => {
  reset();

  loading.value = true;

  const file = e.target.files[0];
  filename.value = file.name;

  let stream = null;

  stream = await file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseJSON());

  stream.pipeTo(
    new WritableStream({
      write(value) {
        fullJson.value = value;
        paginateJson(currentPage.value);
        loading.value = false;
      },
    })
  );
};

const parseJSON = () => {
  let jsonBuffer = "";

  return new TransformStream({
    transform(chunk, controller) {
      jsonBuffer += chunk;
    },
    flush(controller) {
      try {
        const parsedJson = JSON.parse(jsonBuffer);
        controller.enqueue(parsedJson);
      } catch (err) {
        error.value = "Invalid file. Please load a valid JSON file.";
        loading.value = false;
      }
    },
  });
};

const paginateJson = (page) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const slicedData = sliceJson(fullJson.value, start, end);

  if (!json.value) {
    json.value = slicedData;
    return;
  }

  json.value = mergeJson(json.value, slicedData);
};

onMounted(() => {
  reset();

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      currentPage.value++;
      paginateJson(currentPage.value);
    }

    if (scrollTop === 0) {
      currentPage.value = 1;
      json.value = null;
      paginateJson(currentPage.value);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll");
});
</script>

<template>
  <section class="upload-section" v-if="!fullJson">
    <h1 class="title">JSON Tree Viewer</h1>
    <p class="description">
      Simple JSON Viewer that runs completely on-client. No data exchange
    </p>

    <button
      class="btn"
      :class="{ loading }"
      @click="$refs.input.click()"
      aria-label="Load JSON File"
      accesskey="L"
    >
      {{ loading ? "Loading, please wait..." : "Load JSON" }}
    </button>
    <input type="file" @change="handleJson" ref="input" />

    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </section>

  <section class="tree-section" v-if="fullJson">
    <div class="json-wrapper">
      <svg
        @click="reset"
        class="back"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"
        ></path>
      </svg>
      <p class="filename">{{ filename }}</p>
    </div>

    <JSONTree :json="json" />
  </section>
</template>

<style scoped lang="scss">
.upload-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  gap: 1.5rem;

  .title {
    font-size: 3rem;
    font-weight: 700;
  }

  .description {
    font-size: 1.5rem;
    font-weight: 400;
  }

  .error {
    color: #bf0e0e;
    font-weight: 400;
  }

  input[type="file"] {
    display: none;
  }
}

.tree-section {
  margin: 24px auto 12px auto;
  max-width: 638px;

  .json-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.5rem;
    margin-left: 1.2rem;

    .filename {
      font-size: 2rem;
      font-weight: 700;
    }

    .back {
      width: 1.5rem;
      cursor: pointer;
    }
  }
}
</style>
