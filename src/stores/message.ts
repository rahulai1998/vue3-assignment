import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/config/config';

export interface MessageData {
  title: string;
  date: string;
  comment: string;
}

export interface Message {
  id: number;
  title: string;
  date: string;
  comment: string;
}

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[]
  }),
  actions: {
    /**
     * Fetches messages list from the API.
     * @returns Promise<void>
     */
    async getMessages() {
      try {
        const response = await fetch(`${API_BASE_URL}/blog`);
        const data: Message[] = await response.json();
        if (response?.status == 200) {
          return this.messages = data;
        }
        return this.messages = []
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    },
    /**
     * Fetches a specific message by its ID from the API.
     * @param id The ID of the message to fetch.
     * @returns Promise<any>
    */
    async getMessageById(id: string) {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${id}`);
        const data = await response.json();
        if (response?.status == 200) {
          return data;
        }
      } catch (error) {
        console.error(`Error fetching message with ID ${id}:`, error);
        throw error;
      }
    },
    /**
     * Submits a new message to the API.
     * @param messageData The message data to be submitted.
     * @returns Promise<Response>
     */
    async submitMessage(messageData: MessageData) {
      try {
        const response = await fetch(`${API_BASE_URL}/blog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });
        return response
      } catch (error) {
        console.error('Error adding message', error);
        throw error;
      }
    },
    /**
     * Updates an existing message in the API.
     * @param id The ID of the message to be updated.
     * @param messageData The updated message data.
     * @returns Promise<Response>
     */
    async updateMessage(id: string, messageData: MessageData) {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });
        return response
      } catch (error) {
        console.error(`Error updating message with ID ${id}:`, error);
        throw error;
      }
    },
    /**
    * Deletes a message from the API.
    * @param id The ID of the message to be deleted.
    * @returns Promise<Response>
    */
    async deleteMessage(id: number) {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
          method: 'DELETE'
        });
        await this.getMessages();
        return response
      } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
      }
    }
  }
});