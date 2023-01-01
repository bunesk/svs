<script setup lang="ts">
</script>

<template>
  <div id="login">
    <h1>Anmelden</h1>
    <LoginForm />
    <p>
      Noch kein Account?
      <RouterLink to="/register">Registrieren</RouterLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
#login {
  text-align: center;

  h1 {
    padding-bottom: 0.25em;
  }
  p :deep(a) {
    color: var(--color-primary);
    text-decoration: none;
  }
}
</style>
