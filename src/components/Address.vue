<script setup lang="ts">
</script>

<template>
  <p>
    <span class="bold">Das Internetangebot wird herausgegeben von</span><br>
    Hochschule Mannheim<br>
    Paul-Wittsack-Straße 10<br>
    68163 Mannheim<br>
    <span class="element vertical-center">
      <i
        title="Telefon"
        class="pi pi-phone"
      ></i>
      <a href="tel:06212926111">+49 621 292-6111</a><br>
    </span>
    <span class="element vertical-center">
      <i
        title="Fax"
        class="pi pi-print"
      ></i>
      <a href="fax:06212926420">+49 621 292-6420</a><br>
    </span>
    <span class="element vertical-center">
      <i
        title="E-Mail"
        class="pi pi-envelope"
      ></i>
      <a href="mailto:info@hs-mannheim.de">info@hs-mannheim.de</a>
    </span>
  </p>
</template>

<style lang="scss" scoped>
.element {
  a {
    color: var(--color-primary);
    text-decoration: none;
    padding-left: 0.25em;
  }
}
</style>
