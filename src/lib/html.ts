export const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edge TTS · 语音合成</title>
  <style>
    /* ========================================
       Design System · Kenya Hara + Field.io
       东方极简的留白哲学 + 运动诗学的呼吸感
       ======================================== */

    :root {
      /* 色彩系统 · 温润的纸质感 */
      --paper: #faf9f7;
      --paper-deep: #f5f3f0;
      --paper-shadow: #eae7e3;
      --ink-primary: #1a1a1a;
      --ink-secondary: #6b6560;
      --ink-tertiary: #a8a29e;
      --ink-ghost: #d6d1cc;
      --accent-warm: #C04A1A;
      --accent-warm-soft: rgba(192, 74, 26, 0.08);
      --accent-cool: #2c2c2c;
      --accent-cool-soft: rgba(44, 44, 44, 0.06);
      
      /* 功能色 */
      --success: #2d6a4f;
      --success-soft: rgba(45, 106, 79, 0.08);
      --error: #c53030;
      --error-soft: rgba(197, 48, 48, 0.08);
      
      /* 空间系统 · 基于 8px 网格 */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      --space-2xl: 48px;
      --space-3xl: 64px;
      --space-4xl: 96px;
      
      /* 排版尺度 */
      --text-xs: 11px;
      --text-sm: 13px;
      --text-base: 15px;
      --text-lg: 18px;
      --text-xl: 24px;
      --text-2xl: 32px;
      
      /* 动效 */
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --duration-fast: 150ms;
      --duration-base: 250ms;
      --duration-slow: 400ms;
      --duration-slower: 600ms;
      
      /* 形状 */
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
      --radius-full: 9999px;
    }

    /* 基础重置 */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
      background: var(--paper);
      color: var(--ink-primary);
      line-height: 1.7;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ========================================
       页面加载动画 · 呼吸感的依次显现
       ======================================== */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes wave {
      0%, 100% { transform: scaleY(0.5); }
      50% { transform: scaleY(1); }
    }

    .animate-in {
      animation: fadeInUp var(--duration-slow) var(--ease-out-expo) forwards;
      opacity: 0;
    }

    .delay-1 { animation-delay: 80ms; }
    .delay-2 { animation-delay: 160ms; }
    .delay-3 { animation-delay: 240ms; }
    .delay-4 { animation-delay: 320ms; }
    .delay-5 { animation-delay: 400ms; }

    /* ========================================
       Header · 克制的品牌表达
       ======================================== */
    .header {
      padding: var(--space-3xl) var(--space-xl) var(--space-2xl);
      text-align: center;
      position: relative;
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 1px;
      background: var(--ink-ghost);
    }

    .header__title {
      font-size: var(--text-xl);
      font-weight: 400;
      letter-spacing: 0.12em;
      color: var(--ink-primary);
      margin-bottom: var(--space-sm);
      font-family: 'Noto Serif SC', 'Songti SC', serif;
    }

    .header__subtitle {
      font-size: var(--text-sm);
      color: var(--ink-tertiary);
      letter-spacing: 0.08em;
      font-weight: 400;
    }

    /* ========================================
       Main Layout · 留白与呼吸
       ======================================== */
    .main {
      flex: 1;
      max-width: 680px;
      width: 100%;
      margin: 0 auto;
      padding: var(--space-2xl) var(--space-xl);
    }

    /* ========================================
       Tabs · 纤细的导航
       ======================================== */
    .tabs {
      display: flex;
      gap: var(--space-xl);
      margin-bottom: var(--space-2xl);
      position: relative;
    }

    .tabs::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--paper-shadow);
    }

    .tab {
      padding: var(--space-sm) 0 var(--space-md);
      border: none;
      background: none;
      cursor: pointer;
      font-size: var(--text-sm);
      font-weight: 400;
      color: var(--ink-tertiary);
      position: relative;
      transition: color var(--duration-fast) var(--ease-out-quart);
      letter-spacing: 0.02em;
    }

    .tab:hover {
      color: var(--ink-secondary);
    }

    .tab.active {
      color: var(--ink-primary);
    }

    .tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-warm);
      border-radius: 1px 1px 0 0;
      animation: slideDown var(--duration-base) var(--ease-out-expo);
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
      animation: fadeIn var(--duration-slow) var(--ease-out-expo);
    }

    /* ========================================
       Section · 模块化的内容区
       ======================================== */
    .section {
      margin-bottom: var(--space-xl);
    }

    .section__label {
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--ink-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: var(--space-md);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .section__label::before {
      content: '';
      width: 12px;
      height: 1px;
      background: var(--ink-ghost);
    }

    /* ========================================
       Text Input · 纸质感输入框
       ======================================== */
    .text-input {
      width: 100%;
      min-height: 140px;
      padding: var(--space-lg);
      border: 1px solid var(--paper-shadow);
      border-radius: var(--radius-md);
      background: white;
      font-size: var(--text-base);
      line-height: 1.8;
      color: var(--ink-primary);
      resize: vertical;
      transition: all var(--duration-fast) var(--ease-out-quart);
      font-family: inherit;
    }

    .text-input:hover {
      border-color: var(--ink-ghost);
    }

    .text-input:focus {
      outline: none;
      border-color: var(--accent-warm);
      box-shadow: 0 0 0 3px var(--accent-warm-soft);
    }

    .text-input::placeholder {
      color: var(--ink-ghost);
    }

    /* ========================================
       Controls · 精致的控件组合
       ======================================== */
    .controls {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-md);
    }

    @media (max-width: 600px) {
      .controls {
        grid-template-columns: 1fr;
      }
    }

    /* Select · 自定义下拉 */
    .select-wrapper {
      position: relative;
    }

    .select-wrapper::after {
      content: '';
      position: absolute;
      right: var(--space-md);
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid var(--ink-secondary);
      pointer-events: none;
      transition: transform var(--duration-fast) var(--ease-out-quart);
    }

    .select-wrapper:focus-within::after {
      transform: translateY(-50%) rotate(180deg);
    }

    select {
      width: 100%;
      padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-md);
      border: 1px solid var(--paper-shadow);
      border-radius: var(--radius-md);
      background: white;
      font-size: var(--text-sm);
      color: var(--ink-primary);
      cursor: pointer;
      appearance: none;
      transition: all var(--duration-fast) var(--ease-out-quart);
      font-family: inherit;
    }

    select:hover {
      border-color: var(--ink-ghost);
    }

    select:focus {
      outline: none;
      border-color: var(--accent-warm);
      box-shadow: 0 0 0 3px var(--accent-warm-soft);
    }

    /* Speed Control · 速度滑块 */
    .speed-control {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-md);
      background: white;
      border: 1px solid var(--paper-shadow);
      border-radius: var(--radius-md);
      transition: all var(--duration-fast) var(--ease-out-quart);
    }

    .speed-control:hover {
      border-color: var(--ink-ghost);
    }

    .speed-control__label {
      font-size: var(--text-xs);
      color: var(--ink-tertiary);
      white-space: nowrap;
      letter-spacing: 0.05em;
    }

    .speed-control input[type="range"] {
      flex: 1;
      height: 3px;
      background: var(--paper-shadow);
      border-radius: 2px;
      appearance: none;
      cursor: pointer;
      position: relative;
    }

    .speed-control input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid var(--accent-cool);
      border-radius: 50%;
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out-quart);
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    .speed-control input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      border-color: var(--accent-warm);
    }

    .speed-control input[type="range"]::-webkit-slider-thumb:active {
      transform: scale(0.95);
    }

    .speed-value {
      min-width: 44px;
      text-align: right;
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--ink-secondary);
      font-variant-numeric: tabular-nums;
    }

    /* ========================================
       Button · 有温度的按钮
       ======================================== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      width: 100%;
      padding: var(--space-md) var(--space-xl);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all var(--duration-base) var(--ease-out-expo);
      position: relative;
      overflow: hidden;
      font-family: inherit;
    }

    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      background-size: 200% 100%;
      opacity: 0;
      transition: opacity var(--duration-fast);
    }

    .btn:hover::before {
      opacity: 1;
      animation: shimmer 1.5s ease-in-out;
    }

    .btn-primary {
      background: var(--accent-cool);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--ink-primary);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* ========================================
       Status · 状态反馈
       ======================================== */
    .status {
      margin-top: var(--space-lg);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      display: none;
      align-items: center;
      gap: var(--space-sm);
      animation: scaleIn var(--duration-base) var(--ease-out-expo);
    }

    .status.active { display: flex; }

    .status__icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .status.loading {
      background: var(--paper-deep);
      color: var(--ink-secondary);
    }

    .status.loading .status__icon {
      border: 2px solid var(--ink-ghost);
      border-top-color: var(--ink-secondary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .status.error {
      background: var(--error-soft);
      color: var(--error);
    }

    .status.error .status__icon {
      background: var(--error);
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z'/%3E%3C/svg%3E") center/contain no-repeat;
    }

    .status.success {
      background: var(--success-soft);
      color: var(--success);
    }

    .status.success .status__icon {
      background: var(--success);
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5L7 11l-2.5-2.5 1-1L7 9l3.5-3.5 1 1z'/%3E%3C/svg%3E") center/contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6.5L7 11l-2.5-2.5 1-1L7 9l3.5-3.5 1 1z'/%3E%3C/svg%3E") center/contain no-repeat;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ========================================
       Audio Section · 音频播放器区域
       ======================================== */
    .audio-section {
      margin-top: var(--space-xl);
      padding: var(--space-lg);
      background: white;
      border: 1px solid var(--paper-shadow);
      border-radius: var(--radius-lg);
      display: none;
      animation: scaleIn var(--duration-slow) var(--ease-out-expo);
    }

    .audio-section.active { display: block; }

    .audio-section__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-md);
    }

    .audio-section__title {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--ink-secondary);
    }

    .audio-visualizer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      height: 24px;
      opacity: 0;
      transition: opacity var(--duration-base);
    }

    .audio-visualizer.active {
      opacity: 1;
    }

    .audio-visualizer__bar {
      width: 3px;
      background: var(--accent-warm);
      border-radius: 2px;
      animation: wave 1s ease-in-out infinite;
    }

    .audio-visualizer__bar:nth-child(1) { height: 8px; animation-delay: 0s; }
    .audio-visualizer__bar:nth-child(2) { height: 16px; animation-delay: 0.1s; }
    .audio-visualizer__bar:nth-child(3) { height: 12px; animation-delay: 0.2s; }
    .audio-visualizer__bar:nth-child(4) { height: 20px; animation-delay: 0.3s; }
    .audio-visualizer__bar:nth-child(5) { height: 10px; animation-delay: 0.15s; }

    audio {
      width: 100%;
      height: 40px;
      margin-bottom: var(--space-md);
    }

    audio::-webkit-media-controls-panel {
      background: var(--paper-deep);
    }

    .download-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--text-sm);
      color: var(--ink-secondary);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-out-quart);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
    }

    .download-link:hover {
      color: var(--accent-warm);
      background: var(--accent-warm-soft);
    }

    /* ========================================
       API Documentation · 接口文档
       ======================================== */
    .api-section {
      margin-bottom: var(--space-xl);
    }

    .api-section__header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .api-section__method {
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--accent-warm);
      background: var(--accent-warm-soft);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      letter-spacing: 0.05em;
    }

    .api-section__path {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--ink-primary);
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    .code-block {
      background: white;
      border: 1px solid var(--paper-shadow);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      overflow-x: auto;
      position: relative;
    }

    .code-block::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, var(--accent-warm), transparent);
      opacity: 0.3;
    }

    .code-block pre {
      font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.7;
      color: var(--ink-secondary);
      white-space: pre-wrap;
      word-break: break-all;
    }

    .code-block code {
      font-family: inherit;
      color: var(--ink-primary);
    }

    .code-block .comment {
      color: var(--ink-tertiary);
    }

    .code-block .string {
      color: var(--accent-warm);
    }

    .code-block .key {
      color: var(--ink-primary);
      font-weight: 500;
    }

    /* ========================================
       Footer · 克制的收尾
       ======================================== */
    .footer {
      text-align: center;
      padding: var(--space-2xl) var(--space-xl);
      margin-top: auto;
      position: relative;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 1px;
      background: var(--paper-shadow);
    }

    .footer p {
      font-size: var(--text-xs);
      color: var(--ink-ghost);
      letter-spacing: 0.1em;
    }

    /* ========================================
       Scrollbar · 精致的滚动条
       ======================================== */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--paper-shadow);
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--ink-ghost);
    }

    /* ========================================
       Voice Tags · 音色标签
       ======================================== */
    .voice-meta {
      display: flex;
      gap: var(--space-xs);
      margin-top: var(--space-xs);
    }

    .voice-tag {
      font-size: var(--text-xs);
      color: var(--ink-tertiary);
      background: var(--paper-deep);
      padding: 2px var(--space-sm);
      border-radius: var(--radius-sm);
    }

    /* ========================================
       Responsive · 响应式适配
       ======================================== */
    @media (max-width: 640px) {
      .header {
        padding: var(--space-2xl) var(--space-lg) var(--space-xl);
      }

      .main {
        padding: var(--space-xl) var(--space-lg);
      }

      .header__title {
        font-size: var(--text-lg);
      }
    }
  </style>
</head>
<body>
  <header class="header animate-in delay-1">
    <h1 class="header__title">Edge TTS</h1>
    <p class="header__subtitle">语音合成</p>
  </header>

  <main class="main">
    <nav class="tabs animate-in delay-2">
      <button class="tab active" onclick="switchTab('tts')">合成</button>
      <button class="tab" onclick="switchTab('api')">接口</button>
    </nav>

    <div id="tts-tab" class="tab-content active">
      <section class="section animate-in delay-3">
        <div class="section__label">文本</div>
        <textarea 
          class="text-input" 
          id="text-input" 
          placeholder="请输入要合成的文本"
        >你好，欢迎使用 Edge TTS 语音合成服务。</textarea>
      </section>

      <section class="section animate-in delay-4">
        <div class="section__label">设置</div>
        <div class="controls">
          <div class="select-wrapper">
            <select id="voice-select">
              <option value="">加载中...</option>
            </select>
          </div>
          <div class="speed-control">
            <span class="speed-control__label">速度</span>
            <input type="range" id="speed-input" min="0.25" max="4" step="0.25" value="1">
            <span class="speed-value" id="speed-value">1.0x</span>
          </div>
        </div>
      </section>

      <button class="btn btn-primary animate-in delay-5" id="synthesize-btn" onclick="synthesize()">
        <span>开始合成</span>
      </button>

      <div class="status" id="status">
        <span class="status__icon"></span>
        <span class="status__text"></span>
      </div>

      <div class="audio-section" id="audio-section">
        <div class="audio-section__header">
          <span class="audio-section__title">合成结果</span>
          <div class="audio-visualizer" id="audio-visualizer">
            <div class="audio-visualizer__bar"></div>
            <div class="audio-visualizer__bar"></div>
            <div class="audio-visualizer__bar"></div>
            <div class="audio-visualizer__bar"></div>
            <div class="audio-visualizer__bar"></div>
          </div>
        </div>
        <audio id="audio-player" controls></audio>
        <a class="download-link" id="download-link" href="#" download="speech.mp3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          下载音频
        </a>
      </div>
    </div>

    <div id="api-tab" class="tab-content">
      <div class="api-section animate-in delay-3">
        <div class="api-section__header">
          <span class="api-section__method">POST</span>
          <span class="api-section__path">/v1/audio/speech</span>
        </div>
        <div class="code-block">
          <pre>{
  <span class="key">"model"</span>: <span class="string">"tts-1"</span>,
  <span class="key">"input"</span>: <span class="string">"你好，世界"</span>,
  <span class="key">"voice"</span>: <span class="string">"alloy"</span>,
  <span class="key">"speed"</span>: <span class="string">1.0</span>
}</pre>
        </div>
      </div>

      <div class="api-section animate-in delay-4">
        <div class="api-section__header">
          <span class="api-section__method">POST</span>
          <span class="api-section__path">/tts</span>
        </div>
        <div class="code-block">
          <pre>{
  <span class="key">"text"</span>: <span class="string">"你好，世界"</span>,
  <span class="key">"voice"</span>: <span class="string">"zh-CN-XiaoxiaoNeural"</span>
}</pre>
        </div>
      </div>

      <div class="api-section animate-in delay-5">
        <div class="api-section__header">
          <span class="api-section__method">GET</span>
          <span class="api-section__path">/v1/audio/voices</span>
        </div>
        <div class="code-block">
          <pre><span class="comment">// 获取支持的音色列表</span>
GET /voices
GET /v1/audio/voices</pre>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <p>Cloudflare Edge TTS</p>
  </footer>

  <script>
    // ========================================
    // Application Logic
    // ========================================

    const API_BASE = '';
    let voices = [];
    let audioBlob = null;
    let isPlaying = false;

    // 状态管理
    function showStatus(message, type) {
      const status = document.getElementById('status');
      const icon = status.querySelector('.status__icon');
      const text = status.querySelector('.status__text');
      
      text.textContent = message;
      status.className = 'status active ' + type;
      
      // 自动清除成功状态
      if (type === 'success') {
        setTimeout(() => {
          status.classList.remove('active');
        }, 3000);
      }
    }

    function hideStatus() {
      const status = document.getElementById('status');
      status.classList.remove('active');
    }

    // 加载音色列表
    async function loadVoices() {
      const select = document.getElementById('voice-select');
      
      try {
        const response = await fetch(API_BASE + '/voices');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        
        const data = await response.json();
        voices = data.voices || [];

        select.innerHTML = '';

        // 按语言分组
        const groups = {};
        voices.forEach(voice => {
          const locale = voice.Locale || 'unknown';
          if (!groups[locale]) groups[locale] = [];
          groups[locale].push(voice);
        });

        // 默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = 'zh-CN-XiaoxiaoNeural';
        defaultOption.textContent = '默认: 晓晓 (zh-CN)';
        select.appendChild(defaultOption);

        // 分组渲染
        Object.keys(groups).sort().forEach(locale => {
          const group = document.createElement('optgroup');
          group.label = locale;

          groups[locale].forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.ShortName;
            option.textContent = (voice.FriendlyName || voice.ShortName) + ' · ' + (voice.Gender || 'Unknown');
            group.appendChild(option);
          });

          select.appendChild(group);
        });
      } catch (error) {
        select.innerHTML = '<option value="">加载失败</option>';
        showStatus('加载音色列表失败: ' + error.message, 'error');
      }
    }

    // 合成语音
    async function synthesize() {
      const text = document.getElementById('text-input').value.trim();
      const voice = document.getElementById('voice-select').value;
      const speed = parseFloat(document.getElementById('speed-input').value);
      const btn = document.getElementById('synthesize-btn');
      const audioSection = document.getElementById('audio-section');

      if (!text) {
        showStatus('请输入要合成的文本', 'error');
        return;
      }

      // 重置状态
      btn.disabled = true;
      btn.innerHTML = '<span class="status__icon" style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span><span>合成中...</span>';
      hideStatus();
      audioSection.classList.remove('active');

      try {
        const response = await fetch(API_BASE + '/v1/audio/speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: voice || 'zh-CN-XiaoxiaoNeural',
            speed: speed,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error?.message || 'HTTP ' + response.status);
        }

        audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = audioUrl;

        const downloadLink = document.getElementById('download-link');
        downloadLink.href = audioUrl;
        downloadLink.download = 'speech_' + Date.now() + '.mp3';

        audioSection.classList.add('active');
        showStatus('语音合成成功', 'success');

        // 音频播放状态监听
        audioPlayer.onplay = () => {
          isPlaying = true;
          document.getElementById('audio-visualizer').classList.add('active');
        };
        
        audioPlayer.onpause = () => {
          isPlaying = false;
          document.getElementById('audio-visualizer').classList.remove('active');
        };
        
        audioPlayer.onended = () => {
          isPlaying = false;
          document.getElementById('audio-visualizer').classList.remove('active');
        };

        audioPlayer.play().catch(() => {});
      } catch (error) {
        showStatus('合成失败: ' + error.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>开始合成</span>';
      }
    }

    // 切换标签页
    function switchTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tab + '-tab').classList.add('active');
    }

    // 速度滑块监听
    document.getElementById('speed-input').addEventListener('input', function() {
      document.getElementById('speed-value').textContent = this.value + 'x';
    });

    // 初始化
    loadVoices();
  </script>
</body>
</html>`;
