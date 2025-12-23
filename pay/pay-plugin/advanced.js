// V3 高级功能模块
// 高级交互模式和生产优化功能

import { API_CONFIG } from './config.js';

// 高级状态管理
const advancedState = {
    isStreaming: false,
    requestCount: 0,
    errorCount: 0,
    avgResponseTime: 0,
    totalTokens: 0,
    conversationSummary: []
};

// 高级功能：流式响应处理
export async function* streamResponse(messages) {
    const requestBody = {
        ...API_CONFIG.requestBodyTemplate,
        messages: messages,
        stream: true
    };

    try {
        const response = await fetch(API_CONFIG.url, {
            method: API_CONFIG.method,
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_CONFIG.apiKey,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content || '';
                        if (content) yield content;
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

// 高级功能：对话总结
export function summarizeConversation(history) {
    if (history.length < 6) return history;

    const summary = [];
    const userMessages = history.filter(msg => msg.role === 'user');
    const assistantMessages = history.filter(msg => msg.role === 'assistant');

    // 保留最近的对话
    const recent = history.slice(-4);
    
    // 对早期对话进行总结
    const earlyMessages = history.slice(0, -4);
    if (earlyMessages.length > 0) {
        const topics = new Set();
        earlyMessages.forEach(msg => {
            if (msg.role === 'user') {
                // 提取关键词
                const words = msg.content.split(/\s+/).slice(0, 3);
                words.forEach(word => {
                    if (word.length > 2) topics.add(word);
                });
            }
        });

        if (topics.size > 0) {
            summary.push({
                role: "system",
                content: `对话历史总结：${Array.from(topics).join(', ')}等话题的讨论。总对话轮次：${Math.floor(earlyMessages.length / 2)}轮。`
            });
        }
    }

    return [...summary, ...recent];
}

// 高级功能：智能上下文压缩
export function compressContext(history, maxTokens = 3000) {
    if (history.length === 0) return history;

    let totalLength = history.reduce((acc, msg) => acc + msg.content.length, 0);
    
    // 如果未超限，直接返回
    if (totalLength <= maxTokens) return history;

    const compressed = [];
    const toRemove = Math.ceil((totalLength - maxTokens) / 20);

    // 优先保留系统消息和最近消息
    let removed = 0;
    for (let i = 0; i < history.length && removed < toRemove; i++) {
        if (history[i].role === 'system' || i >= history.length - 4) {
            compressed.push(history[i]);
        } else if (removed < toRemove) {
            removed++;
        } else {
            compressed.push(history[i]);
        }
    }

    return compressed;
}

// 高级功能：性能监控
export function trackPerformance(startTime, success = true) {
    const responseTime = Date.now() - startTime;
    
    advancedState.requestCount++;
    if (!success) advancedState.errorCount++;

    // 更新平均响应时间
    const oldTotal = (advancedState.avgResponseTime * (advancedState.requestCount - 1));
    advancedState.avgResponseTime = (oldTotal + responseTime) / advancedState.requestCount;

    return {
        responseTime,
        avgTime: advancedState.avgResponseTime,
        successRate: ((advancedState.requestCount - advancedState.errorCount) / advancedState.requestCount * 100).toFixed(1)
    };
}

// 高级功能：智能建议生成
export function generateAdvancedSuggestions(context) {
    const baseSuggestions = [
        "总结当前对话",
        "优化这段文字",
        "生成代码示例",
        "解释技术概念",
        "翻译内容",
        "检查语法错误"
    ];

    // 基于上下文生成相关建议
    if (context && context.length > 0) {
        const lastMessage = context[context.length - 1]?.content || "";
        
        if (lastMessage.includes("代码") || lastMessage.includes("编程")) {
            return ["调试这段代码", "添加注释", "优化性能", "解释错误", "提供替代方案"];
        }
        
        if (lastMessage.includes("邮件") || lastMessage.includes("回复")) {
            return ["生成礼貌回复", "总结要点", "优化语气", "添加称呼", "缩短内容"];
        }
        
        if (lastMessage.includes("分析") || lastMessage.includes("研究")) {
            return ["深入分析", "提供数据支持", "总结关键点", "提出建议", "预测趋势"];
        }
    }

    return baseSuggestions;
}

// 高级功能：错误恢复机制
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            
            // 指数退避
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// 高级功能：批量处理
export async function batchProcess(items, processor, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const item of items) {
        const promise = processor(item).then(result => {
            results.push(result);
            executing.splice(executing.indexOf(promise), 1);
        });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
        }
    }

    await Promise.all(executing);
    return results;
}

// 高级功能：数据导出
export function exportData(data, format = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (format === 'json') {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        return { blob, filename: `chat-history-${timestamp}.json` };
    } else if (format === 'markdown') {
        let md = `# 对话历史 - ${timestamp}\n\n`;
        data.forEach((msg, idx) => {
            const role = msg.role === 'user' ? '👤 用户' : '🤖 助手';
            md += `### ${idx + 1}. ${role}\n${msg.content}\n\n`;
        });
        const blob = new Blob([md], { type: 'text/markdown' });
        return { blob, filename: `chat-history-${timestamp}.md` };
    }
}

// 高级功能：智能缓存
class SmartCache {
    constructor(maxSize = 50, ttl = 3600000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

export const responseCache = new SmartCache();

// 高级功能：内容安全检查
export function safetyCheck(content) {
    const forbiddenPatterns = [
        /personal\s+information/gi,
        /password/gi,
        /credit\s+card/gi,
        /social\s+security/gi
    ];

    const warnings = [];
    forbiddenPatterns.forEach(pattern => {
        if (pattern.test(content)) {
            warnings.push(`检测到可能的敏感内容: ${pattern.source}`);
        }
    });

    return {
        isSafe: warnings.length === 0,
        warnings
    };
}

// 高级功能：性能优化统计
export function getPerformanceStats() {
    return {
        totalRequests: advancedState.requestCount,
        errorCount: advancedState.errorCount,
        avgResponseTime: Math.round(advancedState.avgResponseTime),
        successRate: ((advancedState.requestCount - advancedState.errorCount) / advancedState.requestCount * 100).toFixed(1),
        totalTokens: advancedState.totalTokens
    };
}

// 高级功能：自适应响应长度
export function adaptResponseLength(prompt, context) {
    const promptLength = prompt.length;
    const contextLength = context.reduce((acc, msg) => acc + msg.content.length, 0);
    
    // 基于输入复杂度和上下文长度调整期望响应长度
    let maxTokens = 500;
    
    if (promptLength > 200) maxTokens = 800;
    if (contextLength > 2000) maxTokens = 600;
    if (prompt.includes("详细") || prompt.includes("深入")) maxTokens = 1200;
    if (prompt.includes("简短") || prompt.includes("总结")) maxTokens = 300;
    
    return maxTokens;
}

// 高级功能：智能对话路由
export function routeConversation(messages, userPreferences = {}) {
    const lastMessage = messages[messages.length - 1]?.content || "";
    
    // 分析意图
    const intents = {
        coding: /代码|编程|函数|类|变量|调试/gi.test(lastMessage),
        writing: /写作|文章|邮件|报告|总结/gi.test(lastMessage),
        analysis: /分析|研究|数据|统计|比较/gi.test(lastMessage),
        creative: /创意|想法|设计|建议|推荐/gi.test(lastMessage)
    };

    // 根据意图和偏好调整参数
    const params = {
        temperature: userPreferences.temperature || 0.7,
        max_tokens: adaptResponseLength(lastMessage, messages),
        top_p: userPreferences.top_p || 0.9
    };

    if (intents.coding) {
        params.temperature = 0.3; // 更确定性
        params.max_tokens = 800;
    } else if (intents.writing) {
        params.temperature = 0.8; // 更创造性
    } else if (intents.analysis) {
        params.temperature = 0.4; // 更逻辑性
    }

    return params;
}

// 高级功能：用户偏好管理
export class UserPreferences {
    constructor() {
        this.preferences = this.load();
    }

    load() {
        try {
            const stored = localStorage.getItem('userPreferences');
            return stored ? JSON.parse(stored) : {
                temperature: 0.7,
                maxTokens: 1000,
                language: 'zh-CN',
                responseStyle: 'balanced', // concise, detailed, balanced
                autoOptimize: true,
                enableCache: true
            };
        } catch {
            return {};
        }
    }

    save() {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }

    update(key, value) {
        this.preferences[key] = value;
        this.save();
    }

    get(key) {
        return this.preferences[key];
    }
}

// 高级功能：智能提示工程
export function enhancePrompt(prompt, context, preferences) {
    const enhanced = [];
    
    // 添加上下文理解
    if (context.length > 0) {
        const recentContext = context.slice(-3);
        const contextSummary = recentContext.map(m => `${m.role}: ${m.content.substring(0, 50)}...`).join('\n');
        enhanced.push(`对话背景：\n${contextSummary}`);
    }

    // 根据偏好调整
    const style = preferences.get('responseStyle');
    if (style === 'concise') {
        enhanced.push('请简洁回答，直接给出核心要点。');
    } else if (style === 'detailed') {
        enhanced.push('请详细解释，包含示例和推理过程。');
    }

    // 添加语言偏好
    const lang = preferences.get('language');
    if (lang === 'zh-CN') {
        enhanced.push('请用中文回答。');
    }

    enhanced.push(`用户问题：${prompt}`);
    
    return enhanced.join('\n\n');
}

// 高级功能：智能错误诊断
export function diagnoseError(error, context) {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        error: error.message,
        context: context.slice(-3),
        suggestions: []
    };

    if (error.message.includes('401') || error.message.includes('403')) {
        diagnostics.suggestions = [
            '检查 API Key 是否正确配置',
            '确认 API Key 是否有访问权限',
            '验证 API 服务状态'
        ];
    } else if (error.message.includes('429')) {
        diagnostics.suggestions = [
            '请求频率过高，请稍后重试',
            '考虑升级 API 计划以获得更高配额',
            '实现请求队列或延迟机制'
        ];
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
        diagnostics.suggestions = [
            '检查网络连接',
            '验证 API 服务地址是否正确',
            '考虑实现离线缓存机制'
        ];
    } else {
        diagnostics.suggestions = [
            '查看详细错误信息',
            '检查输入内容格式',
            '尝试简化问题重新发送'
        ];
    }

    return diagnostics;
}

// 高级功能：智能会话管理
export class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.currentSession = null;
    }

    createSession(name = `Session ${Date.now()}`) {
        const id = Math.random().toString(36).substr(2, 9);
        const session = {
            id,
            name,
            created: Date.now(),
            messages: [],
            metadata: {}
        };
        this.sessions.set(id, session);
        this.currentSession = id;
        return session;
    }

    getCurrentSession() {
        return this.sessions.get(this.currentSession);
    }

    addMessage(role, content) {
        const session = this.getCurrentSession();
        if (session) {
            session.messages.push({ role, content, timestamp: Date.now() });
        }
    }

    saveSessions() {
        const data = Array.from(this.sessions.values());
        localStorage.setItem('chatSessions', JSON.stringify(data));
    }

    loadSessions() {
        try {
            const data = localStorage.getItem('chatSessions');
            if (data) {
                const sessions = JSON.parse(data);
                sessions.forEach(s => this.sessions.set(s.id, s));
            }
        } catch (e) {
            console.error('Failed to load sessions:', e);
        }
    }

    exportCurrentSession(format = 'json') {
        const session = this.getCurrentSession();
        if (!session) return null;
        
        const { blob, filename } = exportData(session.messages, format);
        return { blob, filename, sessionName: session.name };
    }
}

// 高级功能：智能质量评估
export function assessResponseQuality(prompt, response, context) {
    const metrics = {
        relevance: 0,
        completeness: 0,
        clarity: 0,
        overall: 0
    };

    // 相关性评估
    const promptKeywords = prompt.split(/\s+/).filter(w => w.length > 2);
    const responseWords = response.toLowerCase();
    const matches = promptKeywords.filter(kw => responseWords.includes(kw.toLowerCase()));
    metrics.relevance = Math.min(1, matches.length / Math.max(1, promptKeywords.length));

    // 完整性评估
    const hasExamples = /例如|比如|示例|example/i.test(response);
    const hasStructure = /首先|其次|最后|第一|第二|第三/i.test(response) || response.includes('\n');
    const lengthScore = Math.min(1, response.length / 200);
    metrics.completeness = (hasExamples ? 0.4 : 0) + (hasStructure ? 0.3 : 0) + (lengthScore * 0.3);

    // 清晰度评估
    const hasFormatting = response.includes('\n') || response.includes('**') || response.includes('*');
    const sentenceCount = response.split(/[.!?。！？]+/).filter(s => s.trim().length > 0).length;
    const avgSentenceLength = response.length / Math.max(1, sentenceCount);
    const clarityScore = avgSentenceLength > 0 && avgSentenceLength < 100 ? 1 : 0.5;
    metrics.clarity = (hasFormatting ? 0.4 : 0) + (clarityScore * 0.6);

    // 总体评分
    metrics.overall = (metrics.relevance * 0.3 + metrics.completeness * 0.4 + metrics.clarity * 0.3);

    return {
        score: Math.round(metrics.overall * 100),
        metrics,
        feedback: generateQualityFeedback(metrics)
    };
}

function generateQualityFeedback(metrics) {
    const feedback = [];
    
    if (metrics.relevance < 0.6) {
        feedback.push('回答可能偏离了问题核心');
    }
    if (metrics.completeness < 0.6) {
        feedback.push('回答可能不够全面，建议补充细节');
    }
    if (metrics.clarity < 0.6) {
        feedback.push('回答结构可以更清晰，建议使用分段');
    }

    return feedback.length > 0 ? feedback : ['回答质量良好'];
}
