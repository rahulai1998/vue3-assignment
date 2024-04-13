<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useMessageStore } from '../stores/message';
import { ref, onMounted } from 'vue';
import Loading from '../components/Loading.vue'

const messageStore = useMessageStore();
const router = useRouter();
const route = useRoute()

const title = ref<string>('');
const date = ref<string>('');
const comment = ref<string>('');
const loading = ref<boolean>(false)
const formErrors = ref<{ [key: string]: string }>({});

const fetchMessageDetails = async (): Promise<void> => {
  const messageId: string | any = route?.query?.id;
  try {
    loading.value = true;
    const message = await messageStore.getMessageById(messageId);
    title.value = message.title;
    date.value = message.date;
    comment.value = message.comment;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('Error fetching message details:', error);
    throw error
  }
}

const submitMessage = async (): Promise<void> => {
  if (!validateForm()) return;

  const messageData = {
    title: title.value,
    date: date.value,
    comment: comment.value
  };
  try {
    loading.value = true
    const response = await messageStore.submitMessage(messageData);
    if (response?.status == 201) {
      resetMessage()
      loading.value = false
      alert('Message added successfully')
    }
  } catch (error) {
    loading.value = false
    alert('Message not added. Try again')
    throw error
  }
};

const updateMessage = async (): Promise<void> => {
  if (!validateForm()) return;

  const messageData = {
    title: title.value,
    date: date.value,
    comment: comment.value
  };
  const messageId: string | any = route?.query?.id;
  try {
    loading.value = true
    const response = await messageStore.updateMessage(messageId, messageData);
    if (response?.status == 200) {
      loading.value = false
      alert('Message updated successfully')
      router.push('/');
    }
  } catch (error) {
    loading.value = false
    alert('Message update failed. Try again')
    throw error
  }
};

const resetMessage = (): void => {
  title.value = '';
  date.value = '';
  comment.value = '';
  formErrors.value = {};
}

const validateForm = (): boolean => {
  let isValid = true;
  formErrors.value = {};

  if (!title.value.trim()) {
    formErrors.value.title = 'Title is required';
    isValid = false;
  }

  if (!date.value) {
    formErrors.value.date = 'Date is required';
    isValid = false;
  }

  if (!comment.value.trim()) {
    formErrors.value.comment = 'Comment is required';
    isValid = false;
  }

  return isValid;
}

const clearError = (fieldName: string): void => {
  formErrors.value[fieldName] = '';
}

onMounted(async () => {
  if (route?.query?.id) {
    await fetchMessageDetails()
  }
})
</script>

<template>
  <div class="p-8">
    <div class="mx-auto flex items-center justify-between px-2 pb-6" aria-label="Global">
      <div class="text-left">Message Details</div>
      <div class="lg:flex lg:flex-1 lg:justify-end">
        <RouterLink to="/" class="list-btn">Message List</RouterLink>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="relative">
        <input v-model="title" type="text" id="title" class="peer text-input" maxlength="50" placeholder="Enter Title"
          @input="clearError('title')">
        <label for="title" class="input-label">Title</label>
        <span v-if="formErrors.title" class="text-red-500 text-xs">{{ formErrors.title }}</span>
      </div>
      <div class="relative">
        <input v-model="date" type="date" id="date" class="peer text-input" @input="clearError('date')">
        <label for="date" class="input-label">Date</label>
        <span v-if="formErrors.date" class="text-red-500 text-xs">{{ formErrors.date }}</span>
      </div>
      <div class="relative md:col-span-2">
        <textarea v-model="comment" id="comment" class="peer text-input" maxlength="300" placeholder="Enter Comment"
          @input="clearError('comment')"></textarea>
        <label for="comment" class="input-label">Comment</label>
        <span v-if="formErrors.comment" class="text-red-500 text-xs">{{ formErrors.comment }}</span>
      </div>
      <div class="md:col-span-2 text-center pt-3">
        <button v-if="route?.query?.id" @click="updateMessage()" class="submit-btn">Update</button>
        <button v-else @click="submitMessage()" class="submit-btn">Submit</button>
        <RouterLink to="/" type="button" class="cancel-btn">Cancel</RouterLink>
      </div>
    </div>
  </div>
  <Loading v-if="loading"></Loading>
</template>

<style scoped>
.text-input {
  @apply p-4 block w-full border-gray-900 rounded-md text-sm placeholder:text-transparent;
  @apply focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none;
  @apply dark:bg-slate-100 dark:border-gray-900 dark:text-gray-900 dark:focus:ring-gray-900 focus:pt-6;
  @apply focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2;
}

.input-label {
  @apply absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition;
  @apply ease-in-out duration-100 border border-transparent dark:text-black peer-disabled:opacity-50;
  @apply peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500;
  @apply peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500;
}

.list-btn {
  @apply py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200;
  @apply bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none;
}

.submit-btn {
  @apply py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-blue-500 text-white shadow-sm hover:bg-blue-600;
}

.cancel-btn {
  @apply ml-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300;
}
</style>
