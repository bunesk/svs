<script setup lang="ts">
</script>

<template>
  <div id="register">
    <h1>Registrieren</h1>
    <RegisterForm />
    <p>
      Sie haben bereits ein Account?
      <RouterLink to="/login">Anmelden</RouterLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
#register {
  text-align: center;

  h1 {
    padding-bottom: 0.25em;
  }
}
</style>
