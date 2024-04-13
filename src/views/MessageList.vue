<script setup lang="ts">
import { useMessageStore, type Message } from '../stores/message';
import { onMounted, ref } from 'vue';
import Loading from '../components/Loading.vue';

const messageStore = useMessageStore();
const loading = ref<boolean>(false);
const messages = ref<Message[]>([]);

const deleteMessage = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete the message?')
    if (!confirmed) {
        return;
    }
    loading.value = true;
    await messageStore.deleteMessage(id);
    loading.value = false;
};

const truncateString = (str: string) => {
    return str.length > 50 ? str.substring(0, 50) + '...' : str;
};

onMounted(async () => {
    loading.value = true;
    await messageStore.getMessages();
    loading.value = false;
});

messageStore.$subscribe((mutation, state) => {
    messages.value = state.messages;
});
</script>

<template>
    <div class="p-8">
        <div class="mx-auto flex items-center justify-between px-2 pb-6" aria-label="Global">
            <div class="text-left">Message List</div>
            <div class="lg:flex lg:flex-1 lg:justify-end">
                <router-link to="/message-details" class="add-btn">Add Message</router-link>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="-m-1.5 overflow-x-auto">
                <div class="p-1.5 min-w-full inline-block align-middle">
                    <div class="overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200 gray:divide-gray-700">
                            <thead>
                                <tr>
                                    <th scope="col" class="table-header text-start">Sr. No</th>
                                    <th scope="col" class="table-header text-start">Message Title</th>
                                    <th scope="col" class="table-header text-start">Message Date</th>
                                    <th scope="col" class="table-header text-start">Comment Description</th>
                                    <th scope="col" class="table-header text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody v-if="messages?.length > 0">
                                <tr v-for="(message, index) in messages" :key="message.id"
                                    class="odd:bg-white even:bg-gray-100 white:odd:bg-slate-900 gray:even:bg-slate-800">
                                    <td class="table-description">{{ index + 1 }}</td>
                                    <td class="table-description">{{ message.title }}</td>
                                    <td class="table-description">{{ message.date }}</td>
                                    <td class="table-description">{{ truncateString(message.comment) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                        <button @click="deleteMessage(message.id)" type="button"
                                            class="delete-btn">Delete</button>
                                        <router-link :to="`/message-details?id=${message.id}`"
                                            class="edit-btn">Edit</router-link>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr class="text-gray-600">
                                    <th colspan="12" class="font-normal py-6">Message not found</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="loading"></Loading>
</template>

<style scoped>
.table-header {
    @apply px-6 py-3 text-xs font-medium text-gray-500 uppercase;
}

.table-description {
    @apply px-6 py-4 whitespace-nowrap text-sm;
}

.add-btn {
    @apply py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200;
    @apply bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none;
}

.edit-btn {
    @apply inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400;
}

.delete-btn {
    @apply mr-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400;
}
</style>