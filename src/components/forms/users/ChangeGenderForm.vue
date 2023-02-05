<script setup lang="ts">
import {Ref, ref} from 'vue';
import sendRequest from '../../../client/request';
import {genderOptions, default as user} from '../../../client/user';
import {getGenderLabel} from '../../../services/gender';

const props = defineProps({
  user: {type: Object, default: null},
});

const gender: Ref<{name: string; code: string} | null> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const changeGender = async () => {
  if (props.user) {
    return changeGenderById();
  }
  const params = {
    gender: gender.value?.code,
  };
  const response = await sendRequest('user', 'change-gender', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value && gender.value) {
    user.value.gender = gender.value.code;
    user.value.genderLabel = getGenderLabel(gender.value.code as any);
    gender.value = null;
  }
  paragraph.textContent = resData.message;
};

const changeGenderById = async () => {
  const params = {
    id: props.user.id,
    gender: gender.value?.code,
  };
  const response = await sendRequest('user', 'change-gender-by-id', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  if (status.value) {
    props.user.gender = gender.value?.code;
    gender.value = null;
  }
  paragraph.textContent = resData.message;
};
</script>

<template>
  <h2>Geschlecht ändern</h2>
  <form
    @keyup.enter="gender && changeGender()"
    @submit.prevent
  >
    <div class="field">
      <label for="profile_gender">Geschlecht</label>
      <Dropdown
        id="profile_gender"
        v-model="gender"
        :options="genderOptions"
        optionLabel="name"
      />
      <Button
        @click="changeGender"
        :disabled="!gender"
      >Aktualisieren</Button>
    </div>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </form>
</template>

<style lang="scss" scoped>
label {
  margin-right: 0.5rem;
}
:deep(.p-dropdown-label) {
  min-width: 6rem;
}
.p-button {
  margin-left: 0.5rem;
}
</style>
