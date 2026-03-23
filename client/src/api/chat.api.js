const CHAT_URL = '/api/chat';

async function handleResponse(response) {
  if (!response.ok) {
    const errObj = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errObj.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const chatApi = {
  async sendMessage(userId, userMessage, chatHistory) {
    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userMessage, chatHistory })
    });
    return handleResponse(res);
  }
};

export default chatApi;
