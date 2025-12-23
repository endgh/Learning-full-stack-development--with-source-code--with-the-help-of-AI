# Moonshot AI 助手浏览器插件

一个基于浏览器扩展的 AI 助手，基于 Moonshot 官方 API 开发，提供智能对话、上下文管理等功能。

免责声明————个人无聊花费半天搞得小玩具，算是送给期末大学生的圣诞礼物！但请不要商用，使用前请先看使用说明，厂商根据自己去选择，建议使用支持前端直连的厂商，如Moonshot（月之暗面）或DeepSeek（深度求索），其他的厂商也可以用，但是需要你自己去折腾一个代理服务器来绕过浏览器 CORS 限制。如果你选择了其他厂商，还请自己修改配置文件，最后这个插件正常对话没有问题，但是其他功能还没有优化上，但是个人原因本项目以后不一定去维护！

### V2 核心功能（基于 Moonshot API）
- ✅ **官方 API 集成** - 使用 Moonshot 官方接口
- ✅ **Authorization Bearer 认证** - 安全的认证方式
- ✅ **智能对话** - 支持多轮对话和上下文记忆
- ✅ **响应解析** - 自动适配多种响应格式
- ✅ **增强错误处理** - 详细的错误提示和解决方案
- ✅ **界面优化** - 苹果风格设计，明暗模式适配

### 用户体验优化
- ✅ **智能建议** - 快捷指令和常用问题
- ✅ **自动上下文优化** - 长对话自动管理
- ✅ **状态反馈** - 实时操作提示
- ✅ **历史记录** - 本地存储对话历史

## 📋 配置说明

### API 配置参数

#### API_KEY
- **类型**: String
- **必需**: 是
- **说明**: 从 Moonshot 官方平台获取的 API 密钥
- **格式**: 以 `sk-` 开头的字符串

#### BASE_URL
- **类型**: String
- **必需**: 是
- **默认值**: `https://api.moonshot.cn/v1`
- **说明**: API 服务的基础地址（已包含 /v1）

#### MODEL
- **类型**: String
- **必需**: 是
- **默认值**: `kimi-k2-turbo-preview`
- **说明**: 使用的 AI 模型名称

### 配置文件位置
编辑 `pay-plugin/config.js` 文件进行配置：

```javascript
// API 配置文件 - 根据官方文档配置
// 文档地址：https://platform.moonshot.cn/docs

export const API_KEY = "您的_API_KEY_在这里"; // ← 修改这里
export const BASE_URL = "https://api.moonshot.cn/v1";
export const MODEL = "kimi-k2-turbo-preview"; // 官方推荐模型
```

## 🔧 快速开始

### 1. 获取 API Key
1. 访问 [Moonshot 官方平台](https://api.moonshot.cn)
2. 注册并登录您的账户
3. 进入 API 管理页面，创建新的 API Key
4. 复制生成的 API Key

### 2. 配置插件
编辑 `config.js` 文件，填入您的 API Key：

```javascript
export const API_KEY = "sk-您的实际API密钥";
export const BASE_URL = "https://api.moonshot.cn/v1";
export const MODEL = "kimi-k2-turbo-preview";
```

### 3. 浏览器安装
1. 打开浏览器扩展管理页面
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `pay-plugin` 文件夹

### 4. 验证配置
插件启动时会自动验证 API Key 配置是否正确。如果配置错误，会在界面顶部显示错误提示。

## 🚀 API 调用说明

### 请求格式
```
POST https://api.moonshot.cn/v1/chat/completions
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "model": "kimi-k2-turbo-preview",
  "messages": [
    {"role": "user", "content": "你好"}
  ],
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 0.95,
  "stream": false
}
```

### 响应格式
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "你好！有什么可以帮助您的吗？"
      }
    }
  ]
}
```

## 📖 使用指南

### 基础使用
1. 点击浏览器工具栏的插件图标
2. 在输入框中输入问题（支持多行）
3. 按 Enter 或点击"发送"按钮
4. 查看 AI 回答




### 自动功能

- **上下文优化**: 长对话自动优化，避免超长
- **状态反馈**: 实时显示操作状态

## 📖 使用说明

### 第一次使用步骤

#### 1. 获取 API Key
访问 [Moonshot 官方平台](https://api.moonshot.cn)：
- 注册账号并登录
- 进入"API密钥管理"页面
- 点击"创建新密钥"
- 复制生成的 API Key（格式：`sk-xxxxxxxxx`）

#### 2. 配置插件
编辑 `pay-plugin/config.js` 文件：
```javascript
export const API_KEY = "sk-您的实际API密钥"; // 替换为您的密钥
export const BASE_URL = "https://api.moonshot.cn/v1";
export const MODEL = "kimi-k2-turbo-preview";
```

#### 3. 安装插件
**Chrome/Edge 浏览器：**
1. 打开 `chrome://extensions/` 或 `edge://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `pay-plugin` 文件夹

**Firefox 浏览器：**
1. 打开 `about:debugging`
2. 点击"临时加载附加组件"
3. 选择 `pay-plugin` 文件夹中的任意文件

#### 4. 验证安装
- 点击浏览器工具栏的插件图标
- 应该看到插件界面
- 如果显示"API 验证成功"，说明配置正确

### 日常使用流程

#### 开始对话
1. 点击插件图标打开界面
2. 查看顶部状态栏，确保显示"API 验证成功"
3. 在输入框中输入您的问题
4. 按 Enter 或点击"发送"按钮

#### 使用快捷功能
- **快速提问**: 点击智能建议按钮直接发送
- **继续对话**: 直接输入新问题，上下文会自动保留


#### 管理对话
- **复制回答**: 点击"复制"按钮复制 AI 回答
- **重新生成**: 点击"重新生成"按钮再次获取回答
- **保存草稿**: 输入内容自动保存，刷新页面不丢失

### 高级功能

#### 上下文管理
- 插件自动维护对话上下文
- 长对话时会自动优化，避免超过 token 限制
- 可随时清空上下文开始新对话

#### 快捷命令
在输入框中输入：
- `/clear` - 清空所有对话上下文
- `/history` - 显示最近的对话记录
- `/help` - 显示帮助信息

#### 错误处理
如果遇到问题：
1. 查看顶部状态提示
2. 打开浏览器控制台（F12）查看详细错误
3. 检查网络连接和 API Key 配置

### 常见使用场景

#### 场景1: 问答咨询
```
输入: 什么是人工智能？
发送后: 查看 AI 的详细回答
```

#### 场景2: 代码编写
```
输入: 写一个 Python 函数计算斐波那契数列
发送后: 复制代码并使用
```

#### 场景3: 翻译润色
```
输入: 帮我润色这段文字：今天天气很好
发送后: 获取优化后的版本
```

#### 场景4: 学习辅导
```
输入: 解释一下什么是递归函数
发送后: 逐步深入理解概念
```

### 性能优化建议

#### 提高响应速度
- 保持网络连接稳定
- 避免过长的上下文（定期 `/clear`）
- 使用简洁明确的问题

#### 节省 API 调用
- 利用上下文，避免重复说明
- 使用重新生成功能而非重复提问
- 及时清空无关的对话历史

### 故障排除

#### 插件无法加载
- 确保已开启开发者模式
- 检查文件夹结构是否完整
- 重新加载插件

#### API 验证失败
- 检查 API Key 是否正确复制
- 确认网络连接正常
- 验证 API 服务状态

#### 无响应或错误
- 查看浏览器控制台错误信息
- 检查网络是否可以访问 api.moonshot.cn
- 确认 API Key 有足够额度

### 安全提醒

⚠️ **重要安全事项：**
- API Key 仅存储在本地配置文件中
- 请勿在公共电脑上保存 API Key
- 定期更换 API Key 以提高安全性
- 不要将 API Key 分享给他人
- 如发现泄露，立即在官网重新生成

### 获取帮助

如果使用中遇到问题：
1. 查看本文档的【常见问题】部分
2. 检查浏览器控制台错误信息
3. 访问 Moonshot 官方文档：https://platform.moonshot.cn/docs
4. 在插件目录中查看 README.md 获取更多信息

## 🛠️ 详细配置

### API 配置 (config.js)
```javascript
// API 配置文件 - 根据官方文档配置
// 文档地址：https://platform.moonshot.cn/docs

export const API_KEY = "sk-...";        // 您的 API Key
export const BASE_URL = "https://api.moonshot.cn/v1"; // API 地址
export const MODEL = "kimi-k2-turbo-preview";       // 使用的模型

export const API_CONFIG = {
  url: `${BASE_URL}/chat/completions`, // 完整路径
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  },
  requestBodyTemplate: {
    model: MODEL,
    messages: [],
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.95,
    stream: false
  }
};
```

### 浏览器配置 (manifest.json)
- **name**: 插件名称
- **version**: 版本号
- **permissions**: 权限列表
- **action**: 弹出窗口配置

### 界面配置 (popup.html)
- **尺寸**: 320px × 400px
- **输入框**: 130px 高度，支持多行
- **按钮**: 80px 宽度，130px 高度
- **状态提示**: 顶部和底部状态栏

## 📁 文件结构

```
pay-plugin/
├── advanced.js          # 高级功能
├── config.js           # API配置（已更新为Moonshot）
├── manifest.json       # 插件配置
├── popup.html          # 界面布局
├── popup.js            # 核心逻辑
├── README.md           # 完整合并文档（已更新）
└── icons/              # 图标文件夹
    └── icon16.png      # 16x16 图标
```

### 核心文件说明

#### config.js
API 配置文件，包含：
- API_KEY - 认证密钥
- BASE_URL - API 地址
- MODEL - 模型名称
- API_CONFIG - 完整的请求配置
- TEST_REQUEST - 测试请求模板

#### popup.js
核心逻辑文件，包含：
- 状态管理
- API 调用
- 事件处理
- 历史记录管理
- 错误处理

#### popup.html
界面布局文件，包含：
- 输入框
- 功能按钮
- 状态提示
- 历史记录面板

#### advanced.js
高级功能文件，包含：
- 智能建议
- 上下文优化
- 快捷命令处理

## 🔍 错误处理

### 401/403 - 认证失败
**原因**: API Key 无效或无权限  
**解决**: 
- 检查 API Key 是否正确
- 确认 API Key 有访问权限
- 验证 Authorization header 格式

### 429 - 频率限制
**原因**: 请求过于频繁  
**解决**:
- 等待一段时间后重试
- 检查账户配额
- 联系官方支持

### 500/503 - 服务器错误
**原因**: 服务端问题  
**解决**:
- 稍后重试
- 检查官方服务状态

### 网络错误
**原因**: 网络连接问题  
**解决**:
- 检查网络连接
- 验证防火墙设置
- 确认 DNS 解析正常

## 🛡️ 安全说明

### API Key 安全
- ✅ 仅存储在本地配置文件
- ⚠️ 请勿提交到公共代码仓库
- 🔒 建议定期更换 API Key
- 🚫 不要在公共场合展示 API Key

### 数据隐私
- 💾 对话历史仅保存在本地浏览器
- 🚫 不会自动上传到外部服务器
- 🧹 可随时清除历史记录
- 🔐 本地存储使用浏览器安全机制

### 权限说明
插件仅请求必要的权限：
- `storage` - 用于保存配置和历史记录
- `activeTab` - 用于与当前页面交互

## ❓ 常见问题

### Q: 启动时显示 "API 验证失败"
A: 请检查：
1. API Key 是否正确配置
2. 网络连接是否正常
3. API 服务是否可用
4. 浏览器控制台是否有错误信息

### Q: 发送请求后显示错误
A: 请查看：
1. 浏览器控制台详细错误信息
2. 顶部状态提示的具体内容
3. 网络请求是否成功
4. API 配置是否正确

### Q: 如何查看完整响应数据？
A: 打开浏览器开发者工具 → Console 面板，查看详细日志。

### Q: 历史记录不显示
A: 浏览器可能禁用了 localStorage，请检查浏览器设置。

### Q: 插件无法加载
A: 确保：
1. 已开启开发者模式
2. 正确选择了插件文件夹
3. manifest.json 语法正确
4. 重新加载插件

## 🔄 更新日志

### v2.0 (2024-12-22) - Moonshot 适配版
- ✅ 适配 Moonshot 官方 API 文档
- ✅ 使用 Authorization: Bearer 认证
- ✅ 优化错误处理和提示
- ✅ 改进响应解析逻辑
- ✅ 增强界面布局
- ✅ 添加详细配置说明
- ✅ 智能建议功能
- ✅ 快捷命令支持
- ✅ 自动上下文优化
- ✅ 草稿自动保存

### v1.0
- 基础对话功能
- 上下文记忆
- 历史记录
- 基本操作按钮



如遇到问题，请按以下顺序检查：

1. ✅ **配置检查**: 确认 config.js 中的 API_KEY 正确
2. ✅ **网络检查**: 确认网络连接正常
3. ✅ **服务检查**: 确认 Moonshot API 服务可用
4. ✅ **日志检查**: 查看浏览器控制台错误信息

### 调试方法
1. 右键点击插件图标 → "审查弹出内容"
2. 查看 Console 和 Network 面板
3. 检查错误信息

### 修改代码
1. 修改相应文件
2. 在扩展管理页面点击"刷新"按钮
3. 重新打开插件查看效果

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个插件！

## 📄 许可证

MIT License - 可自由使用和修改

---

**基于 Moonshot 官方 API 开发**  
**版本**: 2.0.0  
**最后更新**: 2025-12-22  
**文档合并**: 2025-12-23
