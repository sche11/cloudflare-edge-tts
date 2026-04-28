export const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Edge TTS - 语音合成测试</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 18px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      resize: vertical;
      transition: border-color 0.3s;
    }
    textarea:focus { outline: none; border-color: #667eea; }
    .controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    @media (max-width: 600px) {
      .controls { grid-template-columns: 1fr; }
    }
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .control-group label {
      font-size: 13px;
      font-weight: 500;
      color: #555;
    }
    select, input[type="range"] {
      width: 100%;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      transition: border-color 0.3s;
    }
    select:focus { outline: none; border-color: #667eea; }
    .speed-control {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .speed-control input[type="range"] { flex: 1; }
    .speed-value {
      min-width: 48px;
      text-align: center;
      font-weight: 600;
      color: #667eea;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 28px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .audio-section {
      margin-top: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      display: none;
    }
    .audio-section.active { display: block; }
    .audio-section audio { width: 100%; margin-bottom: 12px; }
    .download-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    .download-link:hover { text-decoration: underline; }
    .status {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      display: none;
    }
    .status.active { display: block; }
    .status.loading { background: #e3f2fd; color: #1976d2; }
    .status.error { background: #ffebee; color: #c62828; }
    .status.success { background: #e8f5e9; color: #2e7d32; }
    .api-info {
      margin-top: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 13px;
      color: #666;
    }
    .api-info code {
      background: #e0e0e0;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .tab {
      padding: 10px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.3s;
    }
    .tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloudflare Edge TTS</h1>
      <p>基于 Microsoft Edge TTS 的语音合成服务</p>
    </div>
    <div class="content">
      <div class="tabs">
        <button class="tab active" onclick="switchTab('tts')">语音合成</button>
        <button class="tab" onclick="switchTab('api')">API 测试</button>
      </div>
      <div id="tts-tab" class="tab-content active">
        <div class="section">
          <div class="section-title">输入文本</div>
          <textarea id="text-input" placeholder="请输入要合成的文本，例如：你好，这是一个语音合成测试。">你好，欢迎使用 Cloudflare Edge TTS 语音合成服务。</textarea>
        </div>
        <div class="section">
          <div class="section-title">语音设置</div>
          <div class="controls">
            <div class="control-group">
              <label>选择音色</label>
              <select id="voice-select">
                <option value="">加载中...</option>
              </select>
            </div>
            <div class="control-group">
              <label>语速调节</label>
              <div class="speed-control">
                <input type="range" id="speed-input" min="0.25" max="4" step="0.25" value="1">
                <span class="speed-value" id="speed-value">1.0x</span>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" id="synthesize-btn" onclick="synthesize()">
          <span>开始合成</span>
        </button>
        <div class="status" id="status"></div>
        <div class="audio-section" id="audio-section">
          <audio id="audio-player" controls></audio>
          <a class="download-link" id="download-link" href="#" download="speech.mp3">下载音频文件</a>
        </div>
      </div>
      <div id="api-tab" class="tab-content">
        <div class="section">
          <div class="section-title">OpenAI 兼容 API</div>
          <div class="api-info">
            <p><strong>端点：</strong><code>POST /v1/audio/speech</code></p>
            <p style="margin-top: 8px;"><strong>请求示例：</strong></p>
            <pre style="background: #e0e0e0; padding: 12px; border-radius: 4px; margin-top: 8px; overflow-x: auto;"><code>{\n  "model": "tts-1",\n  "input": "你好，世界",\n  "voice": "alloy",\n  "speed": 1.0\n}</code></pre>
          </div>
        </div>
        <div class="section">
          <div class="section-title">原始 API</div>
          <div class="api-info">
            <p><strong>端点：</strong><code>POST /tts</code></p>
            <p style="margin-top: 8px;"><strong>请求示例：</strong></p>
            <pre style="background: #e0e0e0; padding: 12px; border-radius: 4px; margin-top: 8px; overflow-x: auto;"><code>{\n  "text": "你好，世界",\n  "voice": "zh-CN-XiaoxiaoNeural"\n}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const API_BASE = '';
    let voices = [];
    let audioBlob = null;
    async function loadVoices() {
      try {
        const response = await fetch(API_BASE + '/voices');
        const data = await response.json();
        voices = data.voices || [];
        const select = document.getElementById('voice-select');
        select.innerHTML = '';
        const groups = {};
        voices.forEach(voice => {
          const locale = voice.Locale || 'unknown';
          if (!groups[locale]) groups[locale] = [];
          groups[locale].push(voice);
        });
        const defaultOption = document.createElement('option');
        defaultOption.value = 'zh-CN-XiaoxiaoNeural';
        defaultOption.textContent = '默认: 晓晓 (zh-CN)';
        select.appendChild(defaultOption);
        Object.keys(groups).sort().forEach(locale => {
          const group = document.createElement('optgroup');
          group.label = locale;
          groups[locale].forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.ShortName;
            option.textContent = (voice.FriendlyName || voice.ShortName) + ' (' + (voice.Gender || 'Unknown') + ')';
            group.appendChild(option);
          });
          select.appendChild(group);
        });
      } catch (error) {
        showStatus('加载音色列表失败: ' + error.message, 'error');
      }
    }
    async function synthesize() {
      const text = document.getElementById('text-input').value.trim();
      const voice = document.getElementById('voice-select').value;
      const speed = parseFloat(document.getElementById('speed-input').value);
      const btn = document.getElementById('synthesize-btn');
      if (!text) {
        showStatus('请输入要合成的文本', 'error');
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div><span>合成中...</span>';
      showStatus('正在合成语音，请稍候...', 'loading');
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
        document.getElementById('audio-section').classList.add('active');
        showStatus('语音合成成功！', 'success');
        audioPlayer.play().catch(() => {});
      } catch (error) {
        showStatus('合成失败: ' + error.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>开始合成</span>';
      }
    }
    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'status active ' + type;
    }
    function switchTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tab + '-tab').classList.add('active');
    }
    document.getElementById('speed-input').addEventListener('input', function() {
      document.getElementById('speed-value').textContent = this.value + 'x';
    });
    loadVoices();
  </script>
</body>
</html>`;
