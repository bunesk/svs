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
    @click="logout"
    icon="pi pi-sign-out"
    label="Abmelden"
  />
</template>

<style lang="scss" scoped>
</style>
