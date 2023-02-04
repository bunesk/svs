<script setup lang="ts">
import {useRouter} from 'vue-router';
import user from '../client/user';
import cookies from '../client/cookies';

const router = useRouter();

const logout = () => {
  cookies.remove('auth');
  user.value = null;
  router.replace('/login');
};
</script>

<template>
  <Button
    v-show="user"
    @click="logout"
    icon="pi pi-sign-out"
    label="Abmelden"
    class="p-button-sm"
  />
</template>

<style lang="scss" scoped>
.p-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
@media only screen and (max-width: 700px) {
  .p-button {
    top: 0.3rem;
    right: 0.3rem;
    font-size: 0.75rem;
    padding: 0.375rem 0.5625rem;
  }
}
</style>
