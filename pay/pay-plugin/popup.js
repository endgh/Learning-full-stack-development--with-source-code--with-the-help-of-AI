import { API_CONFIG, TEST_REQUEST } from './config.js';

const chatHistory = document.getElementById('chatHistory');
const questionInput = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');
const errorBanner = document.getElementById('errorBanner');
const errorMessage = document.getElementById('errorMessage');

let conversationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    sendBtn.addEventListener('click', handleSend);
    questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    validateApiKey();
});

async function validateApiKey() {
    try {
        const response = await fetch(TEST_REQUEST.url, {
            method: TEST_REQUEST.method,
            headers: TEST_REQUEST.headers,
            body: JSON.stringify(TEST_REQUEST.body)
        });
        if (!response.ok) throw new Error();
        localStorage.setItem('mimo_api_validated', 'true');
    } catch (err) {
        showError('API 验证失败，请检查 config.js 中的 Key 是否有效');
    }
}

async function handleSend() {
    const question = questionInput.value.trim();
    if (!question) return;

    questionInput.value = '';
    questionInput.style.height = '60px';

    addMessageToHistory('user', question);
    scrollToBottom();

    const loadingId = showLoading();

    try {
        const messages = [...conversationHistory, { role: 'user', content: question }];
        const response = await fetch(API_CONFIG.url, {
            method: API_CONFIG.method,
            headers: API_CONFIG.headers,
            body: JSON.stringify({
                model: API_CONFIG.requestBodyTemplate.model,
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.95,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`请求失败 (${response.status})`);

        const data = await response.json();
        let answer = data.choices && data.choices[0]?.message?.content ? data.choices[0].message.content.trim() : '抱歉，未能获取有效回答。';

        conversationHistory = [...messages, { role: 'assistant', content: answer }];
        addMessageToHistory('assistant', answer);

    } catch (err) {
        addMessageToHistory('assistant', '请求出错，请检查网络或 API Key。');
        showError('请求失败：' + (err.message || '未知错误'));
    } finally {
        removeLoading(loadingId);
        scrollToBottom();
    }
}

function addMessageToHistory(role, content) {
    const emptyState = chatHistory.querySelector('.empty-state');
    if (emptyState) chatHistory.removeChild(emptyState);

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    if (typeof marked !== 'undefined') {
        messageDiv.innerHTML = marked(content);
    } else {
        messageDiv.textContent = content;
    }
    chatHistory.appendChild(messageDiv);
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.id = 'loading-' + Date.now();
    loadingDiv.innerHTML = '<div class="spinner"></div> 思考中...';
    chatHistory.appendChild(loadingDiv);
    scrollToBottom();
    return loadingDiv.id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorBanner.classList.add('visible');
    setTimeout(() => {
        if (errorBanner.classList.contains('visible')) {
            errorBanner.classList.remove('visible');
        }
    }, 5000);
}

window.closeErrorBanner = () => {
    errorBanner.classList.remove('visible');
};