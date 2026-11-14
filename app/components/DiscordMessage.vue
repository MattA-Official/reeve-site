<script setup lang="ts">
// Citation Discord mock-up: a message from Reeve with one panel. `buttons` are pictures of buttons, not controls;
// a page that lets visitors try the buttons passes real ones in the `actions` slot instead.
defineProps<{
  name: string
  app: string
  time: string
  title: string
  fields: readonly (readonly [label: string, value: string])[]
  text?: string
  buttons?: readonly string[]
  // The AI override card puts its summary line above the fields; the notices put it below.
  textFirst?: boolean
}>()
</script>

<template>
  <div class="rv-dc">
    <div
      class="rv-dc-avatar"
      aria-hidden="true"
    >
      <svg
        class="rv-mark"
        viewBox="0 0 48 48"
        width="26"
        height="26"
        aria-hidden="true"
      >
        <path
          d="M18 9 H11 V39 H18 M30 9 H37 V39 H30"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r="3.5"
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="rv-dc-main">
      <div class="rv-dc-meta">
        <span class="rv-dc-name">{{ name }}</span>
        <span class="rv-dc-app">{{ app }}</span>
        <span class="rv-dc-time">{{ time }}</span>
      </div>
      <div class="rv-dc-box">
        <div class="rv-dc-body">
          <p class="rv-dc-title">
            {{ title }}
          </p>
          <p
            v-if="text && textFirst"
            class="rv-dc-summary"
          >
            {{ text }}
          </p>
          <div class="rv-dc-sep" />
          <dl class="rv-dc-fields">
            <template
              v-for="[label, value] in fields"
              :key="label"
            >
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
          <p
            v-if="text && !textFirst"
            class="rv-dc-summary"
          >
            {{ text }}
          </p>
          <slot name="actions" />
          <!-- Pictures of buttons: the notice's meaning is in its text, so they are hidden from screen readers. -->
          <div
            v-if="buttons?.length"
            class="rv-dc-buttons"
            aria-hidden="true"
          >
            <span
              v-for="button in buttons"
              :key="button"
              class="rv-dc-btn"
            >{{ button }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
