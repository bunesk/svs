<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';
import {validate} from '../../components/forms/services/validation';

const props = defineProps({
  readFunction: {type: Function, required: true},
});

const route = useRoute();
const error: Ref<HTMLParagraphElement | null> = ref(null);
const password = ref('');

const join = async () => {
  const response = await sendRequest('event', 'join', {id: route.params.id, password: password.value});
  const resData = await response.json();
  if (response.status === 200) {
    (error.value as HTMLParagraphElement).textContent = '';
    await props.readFunction(true);
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};
</script>

<template>
  <h1>Veranstaltung beitreten</h1><br>
  <form
    @keyup.enter="password && join()"
    @submit.prevent
  >
    <Password
      v-model="password"
      placeholder="Passwort"
      :feedback="false"
      toggleMask
      required
      @blur="validate"
      @keyup="validate"
    />&nbsp;
    <Button
      @click="join"
      label="Beitreten"
      :disabled="!password"
    />
    <p
      ref="error"
      status="invalid"
    />
  </form>
</template>

<style lang="scss" scoped>
</style>
