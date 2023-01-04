
<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../client/request';

const route = useRoute();
const user = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readUser = async () => {
  if (!route.params.id || isNaN(Number(route.params.id))) {
    (error.value as HTMLParagraphElement).textContent = 'Benutzer-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('user', 'get-data-by-id', {id: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    user.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readUser();
});
</script>

<template>
  <div v-if="user">
    <h1>Profil von {{user.fullName}}</h1>
    <UserTable :user="user" />
    <ChangeGenderForm :user="user" />
    <ChangeRoleForm :user="user" />
    <ResetPasswordForm :id="user.id" />
  </div>
  <p
    ref="error"
    class="invalid"
  ></p>
</template>

<style lang="scss" scoped>
</style>
