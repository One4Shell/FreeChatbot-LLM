/**
 * G4F Bot CDN - Free LLM Bot Integration
 * Nessun server richiesto - Funziona direttamente nel browser
 * 
 * Utilizzo:
 * <script src="g4f-bot.js" 
 *   data-provider="auto"
 *   data-model="auto"
 *   data-theme="dark"
 *   data-position="bottom-right"
 *   data-title="AI Assistant"
 *   data-placeholder="Scrivi un messaggio..."
 *   data-system-prompt="Sei un assistente utile."
 * ></script>
 */

(async function () {
  "use strict";

  // ============================================================
  // ⚙️ CONFIGURAZIONE DA ATTRIBUTI DATA
  // ============================================================
  const currentScript =
    document.currentScript || document.querySelector("script[src*='g4f-bot']");

  const CONFIG = {
    provider: currentScript?.getAttribute("data-provider") || "auto",
    model: currentScript?.getAttribute("data-model") || "auto",
    theme: currentScript?.getAttribute("data-theme") || "light",
    position: currentScript?.getAttribute("data-position") || "bottom-right",
    title: currentScript?.getAttribute("data-title") || "🤖 AI Assistant",
    placeholder:
      currentScript?.getAttribute("data-placeholder") ||
      "Scrivi un messaggio...",
    systemPrompt:
      currentScript?.getAttribute("data-system-prompt") ||
      "Sei un assistente AI utile e disponibile. Rispondi in modo chiaro e conciso.",
    maxHistory: parseInt(currentScript?.getAttribute("data-max-history")) || 20,
    autoOpen: currentScript?.getAttribute("data-auto-open") === "true",
    welcomeMessage:
      currentScript?.getAttribute("data-welcome") ||
      "Ciao! 👋 Come posso aiutarti oggi?",
  };

  // ============================================================
  // 🎨 INIETTA CSS DINAMICAMENTE
  // ============================================================
  function injectStyles() {
    const isDark = CONFIG.theme === "dark";

    const colors = {
      primary: "#0070E3",
      primaryHover: "#0070E3",
      primaryLight: "#819df8", // Light blue for primary
      bg: isDark ? "#1a232e" : "#ffffff",
      bgSecondary: isDark ? "#16213e" : "#f8f9fa",
      bgTertiary: isDark ? "#0f3460" : "#e9ecef", // Slightly darker background for tertiary elements
      text: isDark ? "#e2e8f0" : "#1a202c",
      textSecondary: isDark ? "#94a3b8" : "#6b7280",
      border: isDark ? "#2d3748" : "#e2e8f0",
      shadow: isDark
        ? "0 20px 60px rgba(0,0,0,0.5)"
        : "0 20px 60px rgba(0,0,0,0.15)",
      userBubble: "#6366f1",
      userText: "#ffffff",
      botBubble: isDark ? "#1e293b" : "#f1f5f9",
      botText: isDark ? "#e2e8f0" : "#1a202c",
    };

    // Posizione del widget
    const positions = {
      "bottom-right": "bottom: 32px; right: 32px;",
      "bottom-left": "bottom: 32px; left: 32px;",
      "top-right": "top: 32px; right: 32px;",
      "top-left": "top: 32px; left: 32px;",
    };

    const posStyle = positions[CONFIG.position] || positions["bottom-right"];

    const css = `
      /* ===== G4F BOT WIDGET ===== */
      #g4f-bot-widget * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      /* Pulsante toggle */
      #g4f-bot-toggle {
        position: fixed;
        ${posStyle}
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover});
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        outline: none;
      }

      #g4f-bot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(99,102,241,0.5);
      }

      #g4f-bot-toggle:active {
        transform: scale(0.95);
      }

      #g4f-bot-toggle .toggle-icon {
        font-size: 26px;
        transition: transform 0.3s ease;
      }

      #g4f-bot-toggle.open .toggle-icon {
        transform: rotate(90deg);
      }

      /* Badge notifica */
      #g4f-bot-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: #ef4444;
        border-radius: 50%;
        border: 2px solid white;
        font-size: 11px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        display: none;
      }

      /* Container chat */
      #g4f-bot-container {
        position: fixed;
        ${posStyle}
        width: 380px;
        height: 560px;
        background: ${colors.bg};
        border-radius: 20px;
        box-shadow: ${colors.shadow};
        display: flex;
        flex-direction: column;
        z-index: 999998;
        overflow: hidden;
        border: 1px solid ${colors.border};
        transform: scale(0) translateY(20px);
        transform-origin: bottom right;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
        margin-bottom: 72px;
      }

      #g4f-bot-container.open {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      /* Header */
      #g4f-bot-header {
        background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover});
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .g4f-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .g4f-avatar {
        width: 42px;
        height: 42px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        backdrop-filter: blur(10px);
      }

      .g4f-header-text h3 {
        color: white;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.2;
      }

      .g4f-status {
        display: flex;
        align-items: center;
        gap: 5px;
        color: rgba(255,255,255,0.85);
        font-size: 12px;
      }

      .g4f-status-dot {
        width: 7px;
        height: 7px;
        background: #4ade80;
        border-radius: 50%;
        animation: g4f-pulse 2s infinite;
      }

      .g4f-status-dot.thinking {
        background: #fbbf24;
        animation: g4f-blink 0.7s infinite;
      }

      @keyframes g4f-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.8); }
      }

      @keyframes g4f-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .g4f-header-actions {
        display: flex;
        gap: 8px;
      }

      .g4f-header-btn {
        background: rgba(255,255,255,0.15);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background 0.2s;
        backdrop-filter: blur(5px);
      }

      .g4f-header-btn:hover {
        background: rgba(255,255,255,0.25);
      }

      /* Provider/Model info */
      #g4f-model-bar {
        background: ${colors.bgSecondary};
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid ${colors.border};
        flex-shrink: 0;
        flex-wrap: wrap;
      }

      .g4f-model-badge {
        background: ${colors.primaryLight};
        color: ${colors.primary};
        padding: 3px 10px!important;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .g4f-model-select {
        background: ${colors.bgTertiary};
        color: ${colors.text};
        border: 1px solid ${colors.border};
        border-radius: 8px;
        padding: 3px 8px!important;
        font-size: 11px;
        cursor: pointer;
        outline: none;
        flex: 1;
        min-width: 0;
      }

      /* Area messaggi */
      #g4f-bot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }

      #g4f-bot-messages::-webkit-scrollbar {
        width: 4px;
      }

      #g4f-bot-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      #g4f-bot-messages::-webkit-scrollbar-thumb {
        background: ${colors.border};
        border-radius: 2px;
      }

      /* Messaggi */
      .g4f-message {
        display: flex;
        gap: 8px;
        animation: g4f-slideIn 0.3s ease;
        max-width: 100%;
      }

      @keyframes g4f-slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .g4f-message.user {
        flex-direction: row-reverse;
      }

      .g4f-msg-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .g4f-message.bot .g4f-msg-avatar {
        background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover});
      }

      .g4f-message.user .g4f-msg-avatar {
        background: ${colors.bgTertiary};
      }

      .g4f-msg-content {
        max-width: 78%;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .g4f-message.user .g4f-msg-content {
        align-items: flex-end;
      }

      .g4f-msg-bubble {
        padding: 10px 14px!important;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-word;
        position: relative;
      }

      .g4f-message.bot .g4f-msg-bubble {
        background: ${colors.botBubble};
        color: ${colors.botText};
        border-bottom-left-radius: 4px;
      }

      .g4f-message.user .g4f-msg-bubble {
        background: ${colors.userBubble};
        color: ${colors.userText};
        border-bottom-right-radius: 4px;
      }

      /* Markdown rendering */
      .g4f-msg-bubble strong { font-weight: 700; }
      .g4f-msg-bubble em { font-style: italic; }
      .g4f-msg-bubble code {
        background: rgba(0,0,0,0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }

      .g4f-message.user .g4f-msg-bubble code {
        background: rgba(255,255,255,0.2);
      }

      .g4f-msg-bubble pre {
        background: #1e293b;
        color: #e2e8f0;
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 8px 0;
        font-size: 12px;
        font-family: 'Courier New', monospace;
      }

      .g4f-msg-bubble ul, .g4f-msg-bubble ol {
        padding-left: 6px;
        margin: 4px 0;
      }

      .g4f-msg-bubble li { margin: 2px 0; }

      .g4f-msg-bubble p { margin: 4px 0; }

      .g4f-msg-bubble h1, .g4f-msg-bubble h2, .g4f-msg-bubble h3 {
        font-weight: 700;
        margin: 6px 0 4px;
      }

      .g4f-msg-time {
        font-size: 10px;
        color: ${colors.textSecondary};
        padding: 0 4px;
      }

      /* Typing indicator */
      .g4f-typing {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 12px 16px;
      }

      .g4f-typing span {
        width: 7px;
        height: 7px;
        background: ${colors.textSecondary};
        border-radius: 50%;
        animation: g4f-typing 1.2s infinite;
      }

      .g4f-typing span:nth-child(2) { animation-delay: 0.2s; }
      .g4f-typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes g4f-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }

      /* Area input */
      #g4f-bot-input-area {
        padding: 12px 16px;
        background: ${colors.bg};
        border-top: 1px solid ${colors.border};
        flex-shrink: 0;
      }

      /* Suggerimenti rapidi */
      #g4f-quick-replies {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }

      .g4f-quick-btn {
        background: ${colors.bgSecondary};
        color: ${colors.text};
        border: 1px solid ${colors.border};
        padding: 5px 12px!important;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .g4f-quick-btn:hover {
        background: ${colors.primaryLight};
        border-color: ${colors.primary};
        color: ${colors.primary};
      }

      .g4f-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        background: ${colors.bgSecondary};
        border: 1.5px solid ${colors.border};
        border-radius: 14px;
        padding-left: 12px!important;
        transition: border-color 0.2s;
      }

      .g4f-input-wrapper:focus-within {
        border-color: ${colors.primary};
        box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
      }

      #g4f-bot-input {
        padding: 4px 5px !important;
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: ${colors.text};
        font-size: 14px;
        resize: none;
        max-height: 100px;
        line-height: 1.5;
        min-height: 24px;
        overflow-y: auto;
        margin-block: auto;
      }

      #g4f-bot-input::placeholder {
        color: ${colors.textSecondary};
      }

      #g4f-bot-send {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover});
        border: none;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
        font-size: 16px;
      }

      #g4f-bot-send:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(99,102,241,0.4);
      }

      #g4f-bot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Footer */
      #g4f-bot-footer {
        text-align: center;
        padding: 6px;
        font-size: 10px;
        color: ${colors.textSecondary};
        background: ${colors.bgSecondary};
        border-top: 1px solid ${colors.border};
      }

      #g4f-bot-footer a {
        color: ${colors.primary};
        text-decoration: none;
      }

      /* Notifica errore */
      .g4f-error-bubble {
        background: #fee2e2 !important;
        color: #dc2626 !important;
        font-size: 13px;
      }

      /* Toast */
      #g4f-toast {
        position: fixed;
        bottom: 100px;
        right: 24px;
        background: #1e293b;
        color: white;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 13px;
        z-index: 9999999;
        display: none;
        animation: g4f-toastIn 0.3s ease;
      }

      @keyframes g4f-toastIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Responsive Mobile */
      @media (max-width: 480px) {
        #g4f-bot-container {
          width: calc(100vw - 40px); /* 20px left + 20px right */
          height: calc(100vh - 120px); /* Adjust height for new bottom offset */
          bottom: 100px !important;
          right: 20px !important;
          left: 20px !important;
          top: auto !important;
          margin-bottom: 0; /* No extra margin on mobile */
        }
      }
    `;

    const style = document.createElement("style");
    style.id = "g4f-bot-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================================
  // 🏗️ CREA STRUTTURA HTML
  // ============================================================
  function createWidget() {
    const widget = document.createElement("div");
    widget.id = "g4f-bot-widget";

    widget.innerHTML = `
      <!-- Toggle Button -->
      <button id="g4f-bot-toggle" aria-label="Apri chat">
        <span class="toggle-icon"><svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8S2 6.582 2 11c0 2.157 1.067 4.114 2.801 5.553C4.271 18.65 3 20 2 21c3 0 4.527-.979 6.32-2.559 1.14.36 2.38.559 3.68.559z"></path></g></svg></span>
        <span id="g4f-bot-badge">1</span>
      </button>

      <!-- Chat Container -->
      <div id="g4f-bot-container" role="dialog" aria-label="Chat AI">
        
        <!-- Header -->
        <div id="g4f-bot-header">
          <div class="g4f-header-info">
            <div class="g4f-avatar">🤖</div>
            <div class="g4f-header-text">
              <h3>${CONFIG.title}</h3>
              <div class="g4f-status">
                <div class="g4f-status-dot" id="g4f-status-dot"></div>
                <span id="g4f-status-text">Online</span>
              </div>
            </div>
          </div>
          <div class="g4f-header-actions">
            <button class="g4f-header-btn" id="g4f-clear-btn" title="Nuova conversazione">🗑️</button>
            <button class="g4f-header-btn" id="g4f-export-btn" title="Esporta chat">💾</button>
            <button class="g4f-header-btn" id="g4f-close-btn" title="Chiudi">✕</button>
          </div>
        </div>

        <!-- Model Bar -->
        <div id="g4f-model-bar">
          <div class="g4f-model-badge">⚡ Free</div>
          <select class="g4f-model-select" id="g4f-model-select" title="Seleziona modello">
            <option value="auto">🔄 Auto</option>
            <option value="gpt-4o">🧠 GPT-4o</option>
            <option value="gpt-4o-mini">⚡ GPT-4o mini</option>
            <option value="deepseek-v3">🔬 DeepSeek V3</option>
            <option value="deepseek-r1">💡 DeepSeek R1</option>
            <option value="claude-3.5-sonnet">🎭 Claude 3.5</option>
            <option value="gemini-pro">✨ Gemini Pro</option>
            <option value="llama-3.3-70b">🦙 Llama 3.3 70B</option>
            <option value="qwen-2.5-72b">🌟 Qwen 2.5 72B</option>
          </select>
          <div class="g4f-model-badge" id="g4f-provider-badge">🔗 auto</div>
        </div>

        <!-- Messages Area -->
        <div id="g4f-bot-messages" role="log" aria-live="polite">
          <!-- Messaggi dinamici -->
        </div>

        <!-- Input Area -->
        <div id="g4f-bot-input-area">
          <!-- Quick Replies -->
          <div id="g4f-quick-replies"></div>

          <!-- Input -->
          <div class="g4f-input-wrapper">
            <textarea 
              id="g4f-bot-input" 
              placeholder="${CONFIG.placeholder}" 
              rows="1"
              aria-label="Messaggio"
            ></textarea>
            <button id="g4f-bot-send" aria-label="Invia">➤</button>
          </div>
        </div>

        <!-- Footer -->
        <div id="g4f-bot-footer">
          Powered by <a href="https://g4f.dev" target="_blank">G4F API</a> • Gratuito • Nessun server
        </div>
      </div>

      <!-- Toast -->
      <div id="g4f-toast"></div>
    `;

    document.body.appendChild(widget);
  }

  // ============================================================
  // 🧠 LOGICA BOT
  // ============================================================
  let G4FClient = null;
  let conversationHistory = [];
  let isLoading = false;
  let currentModel = CONFIG.model;
  let messageCount = 0;

  // Importa il client G4F
  async function initG4FClient() {
    try {
      const { default: Client } = await import(
        "https://g4f.dev/dist/js/client.js"
      );
      G4FClient = new Client();
      console.log("✅ G4F Client inizializzato");
      return true;
    } catch (err) {
      console.error("❌ Errore inizializzazione G4F:", err);
      return false;
    }
  }

  // Formatta markdown base
  function parseMarkdown(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/```(\w*)\n?([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^\- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/\n/g, "<br>")
      .replace(/(<br>){3,}/g, "<br><br>");
  }

  // Formatta timestamp
  function formatTime(date = new Date()) {
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Aggiungi messaggio alla UI
  function addMessage(content, role = "bot", isError = false) {
    const messagesEl = document.getElementById("g4f-bot-messages");
    const msgEl = document.createElement("div");
    msgEl.className = `g4f-message ${role}`;

    const avatar = role === "bot" ? "🤖" : "👤";
    const parsedContent =
      role === "bot" ? parseMarkdown(content) : escapeHTML(content);

    msgEl.innerHTML = `
      <div class="g4f-msg-avatar">${avatar}</div>
      <div class="g4f-msg-content">
        <div class="g4f-msg-bubble ${isError ? "g4f-error-bubble" : ""}">
          ${parsedContent}
        </div>
        <span class="g4f-msg-time">${formatTime()}</span>
      </div>
    `;

    messagesEl.appendChild(msgEl);
    scrollToBottom();
    return msgEl;
  }

  function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Typing indicator
  function showTyping() {
    const messagesEl = document.getElementById("g4f-bot-messages");
    const typingEl = document.createElement("div");
    typingEl.className = "g4f-message bot";
    typingEl.id = "g4f-typing-indicator";
    typingEl.innerHTML = `
      <div class="g4f-msg-avatar">🤖</div>
      <div class="g4f-msg-content">
        <div class="g4f-msg-bubble">
          <div class="g4f-typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
    messagesEl.appendChild(typingEl);
    scrollToBottom();
  }

  function hideTyping() {
    const typingEl = document.getElementById("g4f-typing-indicator");
    if (typingEl) typingEl.remove();
  }

  function scrollToBottom() {
    const messagesEl = document.getElementById("g4f-bot-messages");
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  // Aggiorna stato
  function setStatus(status, text) {
    const dot = document.getElementById("g4f-status-dot");
    const statusText = document.getElementById("g4f-status-text");
    if (dot) {
      dot.className = `g4f-status-dot ${status === "thinking" ? "thinking" : ""}`;
    }
    if (statusText) statusText.textContent = text;
  }

  // Invia messaggio all'API G4F
  async function sendMessage(userInput) {
    if (!userInput.trim() || isLoading) return;
    if (!G4FClient) {
      showToast("❌ Client non inizializzato. Ricarica la pagina.");
      return;
    }

    isLoading = true;
    const sendBtn = document.getElementById("g4f-bot-send");
    const inputEl = document.getElementById("g4f-bot-input");

    // Aggiungi messaggio utente
    addMessage(userInput, "user");

    // Reset input
    inputEl.value = "";
    inputEl.style.height = "24px";

    // Disabilita input
    sendBtn.disabled = true;
    inputEl.disabled = true;

    // Aggiorna storia
    conversationHistory.push({
      role: "user",
      content: userInput,
    });

    // Tronca storia se troppo lunga
    if (conversationHistory.length > CONFIG.maxHistory) {
      conversationHistory = conversationHistory.slice(-CONFIG.maxHistory);
    }

    // Mostra typing
    showTyping();
    setStatus("thinking", "Sta scrivendo...");

    // Nascondi quick replies
    document.getElementById("g4f-quick-replies").innerHTML = "";

    try {
      // Costruisci messaggi con system prompt
      const messages = [
        { role: "system", content: CONFIG.systemPrompt },
        ...conversationHistory,
      ];

      const selectedModel =
        document.getElementById("g4f-model-select")?.value || currentModel;

      const result = await G4FClient.chat.completions.create({
        provider: CONFIG.provider,
        model: selectedModel,
        messages: messages,
      });

      const botResponse = result.choices[0].message.content;

      // Aggiorna provider badge
      const providerBadge = document.getElementById("g4f-provider-badge");
      if (providerBadge && result.provider) {
        providerBadge.textContent = `🔗 ${result.provider}`;
      }

      // Aggiorna storia con risposta bot
      conversationHistory.push({
        role: "assistant",
        content: botResponse,
      });

      hideTyping();
      addMessage(botResponse, "bot");
      setStatus("online", "Online");
      messageCount++;

      // Mostra quick replies contestuali
      showContextualReplies(botResponse);
    } catch (error) {
      console.error("❌ Errore G4F:", error);
      hideTyping();

      let errorMsg = "Si è verificato un errore. Riprova.";
      if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMsg = "⚠️ Errore di rete. Controlla la connessione.";
      } else if (error.message?.includes("rate")) {
        errorMsg = "⏱️ Troppe richieste. Attendi un momento.";
      }

      addMessage(errorMsg, "bot", true);
      setStatus("online", "Online");

      // Rimuovi ultimo messaggio utente dalla storia in caso di errore
      conversationHistory.pop();
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }

  // Quick replies contestuali
  function showContextualReplies(lastResponse) {
    const container = document.getElementById("g4f-quick-replies");
    const suggestions = generateSuggestions(lastResponse);

    container.innerHTML = suggestions
      .map(
        (s) =>
          `<button class="g4f-quick-btn" onclick="document.getElementById('g4f-bot-input').value='${s}'; document.getElementById('g4f-bot-send').click()">${s}</button>`
      )
      .join("");
  }

  function generateSuggestions(text) {
    const base = [
      "Approfondisci 🔍",
      "Dammi un esempio 💡",
      "Riassumi 📝",
      "Continua ▶️",
    ];
    if (text.includes("codice") || text.includes("code") || text.includes("```")) {
      return ["Spiega il codice", "Ottimizzalo", "Aggiungi commenti"];
    }
    if (text.length > 500) {
      return ["Riassumi in 3 punti", "Qual è la parte più importante?", "Dammi un esempio"];
    }
    return base.slice(0, 3);
  }

  // Pulisci chat
  function clearChat() {
    conversationHistory = [];
    const messagesEl = document.getElementById("g4f-bot-messages");
    messagesEl.innerHTML = "";
    messageCount = 0;
    addWelcomeMessage();
    showToast("🗑️ Conversazione cancellata");
  }

  // Esporta chat
  function exportChat() {
    if (conversationHistory.length === 0) {
      showToast("ℹ️ Nessuna conversazione da esportare");
      return;
    }

    const text = conversationHistory
      .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join("\n\n---\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-g4f-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("💾 Chat esportata!");
  }

  // Toast notifica
  function showToast(message, duration = 3000) {
    const toast = document.getElementById("g4f-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, duration);
  }

  // Messaggio di benvenuto
  function addWelcomeMessage() {
    addMessage(CONFIG.welcomeMessage, "bot");
  }

  // Quick replies iniziali
  function addInitialQuickReplies() {
    const initial = [
      "Chi sei?",
      "Come puoi aiutarmi?",
      "Raccontami qualcosa di interessante",
    ];
    const container = document.getElementById("g4f-quick-replies");
    container.innerHTML = initial
      .map(
        (s) =>
          `<button class="g4f-quick-btn" onclick="document.getElementById('g4f-bot-input').value='${s}'; document.getElementById('g4f-bot-send').click()">${s}</button>`
      )
      .join("");
  }

  // ============================================================
  // 🎯 EVENT LISTENERS
  // ============================================================
  function setupEventListeners() {
    const toggle = document.getElementById("g4f-bot-toggle");
    const container = document.getElementById("g4f-bot-container");
    const sendBtn = document.getElementById("g4f-bot-send");
    const inputEl = document.getElementById("g4f-bot-input");
    const clearBtn = document.getElementById("g4f-clear-btn");
    const exportBtn = document.getElementById("g4f-export-btn");
    const closeBtn = document.getElementById("g4f-close-btn");
    const modelSelect = document.getElementById("g4f-model-select");

    // Toggle chat
    toggle.addEventListener("click", () => {
      const isOpen = container.classList.contains("open");
      container.classList.toggle("open");
      toggle.classList.toggle("open");

      // Nascondi badge
      const badge = document.getElementById("g4f-bot-badge");
      if (badge) badge.style.display = "none";

      if (!isOpen) {
        setTimeout(() => inputEl?.focus(), 400);
      }
    });

    // Chiudi
    closeBtn.addEventListener("click", () => {
      container.classList.remove("open");
      toggle.classList.remove("open");
    });

    // Invia con click
    sendBtn.addEventListener("click", () => {
      sendMessage(inputEl.value.trim());
    });

    // Invia con Enter (Shift+Enter = nuova riga)
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value.trim());
      }
    });

    // Auto resize textarea
    inputEl.addEventListener("input", () => {
      inputEl.style.height = "24px";
      const newHeight = Math.min(inputEl.scrollHeight, 100);
      inputEl.style.height = newHeight + "px";
    });

    // Clear chat
    clearBtn.addEventListener("click", clearChat);

    // Export
    exportBtn.addEventListener("click", exportChat);

    // Cambio modello
    if (modelSelect) {
      modelSelect.value = CONFIG.model === "auto" ? "auto" : CONFIG.model;
      modelSelect.addEventListener("change", (e) => {
        currentModel = e.target.value;
        showToast(`✅ Modello: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Chiudi con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && container.classList.contains("open")) {
        container.classList.remove("open");
        toggle.classList.remove("open");
      }
    });
  }

  // ============================================================
  // 🚀 INIZIALIZZAZIONE
  // ============================================================
  async function init() {
    console.log("🚀 G4F Bot CDN - Inizializzazione...");

    // Inietta stili
    injectStyles();

    // Crea widget
    createWidget();

    // Setup eventi
    setupEventListeners();

    // Inizializza client G4F
    const success = await initG4FClient();

    if (success) {
      addWelcomeMessage();
      addInitialQuickReplies();
      console.log("✅ G4F Bot pronto!");

      // Mostra badge se non autoOpen
      if (!CONFIG.autoOpen) {
        const badge = document.getElementById("g4f-bot-badge");
        if (badge) {
          badge.style.display = "flex";
        }
      }

      // Auto apri se configurato
      if (CONFIG.autoOpen) {
        setTimeout(() => {
          document.getElementById("g4f-bot-container")?.classList.add("open");
          document.getElementById("g4f-bot-toggle")?.classList.add("open");
        }, 500);
      }
    } else {
      // Fallback: mostra errore nella UI
      addWelcomeMessage();
      setTimeout(() => {
        addMessage(
          "⚠️ Impossibile caricare il client AI. Verifica la connessione a internet.",
          "bot",
          true
        );
      }, 500);
    }
  }

  // Avvia quando DOM è pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();