/**
 * Veltrix Solutions - Main Script
 * Handles navigation and shared UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    initNavbar();
    initScrollEffects();
    initMobileMenu();
    updateActiveNavLink();
    initAIChat();
    initContactForm();
});

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const nav = document.querySelector('nav');
    const topBar = document.querySelector('.top-bar');
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-white', 'shadow-lg', 'py-2');
            nav.classList.remove('nav-bg-light', 'py-5');
            if (topBar) topBar.classList.add('hidden');
        } else {
            nav.classList.remove('bg-white', 'shadow-lg', 'py-2');
            nav.classList.add('nav-bg-light', 'py-5');
            if (topBar) topBar.classList.remove('hidden');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('animate-slide-in-top');
            menuBtn.innerHTML = '<i data-lucide="x" size="28"></i>';
        } else {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i data-lucide="menu" size="28"></i>';
        }
        if (window.lucide) lucide.createIcons();
    });
}

/**
 * Scroll Animations (Simple Intersection Observer)
 */
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Highlights the active link in the navbar based on current filename
 */
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename) {
            link.classList.add('text-blue-600');
            link.classList.remove('text-slate-700');
        } else {
            link.classList.remove('text-blue-600');
            link.classList.add('text-slate-700');
        }
    });
}

/**
 * AI Chatbot Implementation
 * Note: Storing API keys client-side is for demonstration purposes.
 * In production, use a backend proxy.
 */
function initAIChat() {
    const chatHTML = `
        <div class="chat-widget">
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <i data-lucide="bot" size="24"></i>
                        </div>
                        <div>
                            <div class="chat-title">Veltrix AI</div>
                            <div class="chat-status">Online • Ready to help</div>
                        </div>
                    </div>
                    <button id="close-chat" class="text-white opacity-60 hover:opacity-100">
                        <i data-lucide="minus" size="20"></i>
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="message message-bot">
                        Hello! 👋 I'm your Veltrix Assistant. How can I help you grow your business today?
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Type your message...">
                    <button id="send-chat" class="chat-send">
                        <i data-lucide="send" size="20"></i>
                    </button>
                </div>
            </div>
            <div class="chat-toggle" id="chat-toggle">
                <i data-lucide="message-square" size="30"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
    if (window.lucide) lucide.createIcons();

    const toggle = document.getElementById('chat-toggle');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    // OpenRouter Configuration
    const API_KEY = "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";
    const SYSTEM_PROMPT = `You are the AI Assistant for Veltrix Solutions, a premium digital agency founded by Noman Anjum. 
    
    Services:
    1. Coding Website: High-performance websites built with HTML, CSS, and JavaScript.
    2. WordPress Website: Custom-coded themes, secure, and easy-to-manage solutions.
    3. AI Websites: Next-generation websites integrated with artificial intelligence.
    4. AI Chatbots: Intelligent, automated customer support conversational agents.
    5. Social Media Marketing: Comprehensive marketing strategies with custom image and bio creation.

    Contact Information:
    - Founder: Noman Anjum
    - Phone: +92 332 2352658
    - Email: nomigrowthengine@gmail.com
    - Location: Korangi Karachi, Sindh, Pakistan.

    Guidelines:
    - Be professional, friendly, and helpful.
    - If someone asks about services, mention our 5 core offerings.
    - Always encourage clients to book a free consultation or contact the team.
    - Mention the phone number and email when asked for contact details.`;


    let chatHistory = [{ role: "system", content: SYSTEM_PROMPT }];

    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('active');
        if (windowEl.classList.contains('active')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('active');
    });

    const addMessage = (text, isBot = false) => {
        const msg = document.createElement('div');
        msg.className = `message ${isBot ? 'message-bot' : 'message-user'}`;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'message message-bot typing-indicator';
        indicator.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return indicator;
    };

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, false);
        input.value = '';
        
        const typingIndicator = showTypingIndicator();

        try {
            chatHistory.push({ role: "user", content: text });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Veltrix Agency Site"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: chatHistory
                })
            });

            const data = await response.json();
            typingIndicator.remove();

            if (data.choices && data.choices[0]) {
                const botReply = data.choices[0].message.content;
                addMessage(botReply, true);
                chatHistory.push({ role: "assistant", content: botReply });
            } else {
                addMessage("I'm sorry, I'm having trouble connecting to my brain right now. Please try again or contact us directly!", true);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            typingIndicator.remove();
            addMessage("Oops! Something went wrong. Please check your connection.", true);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

/**
 * Contact Form Implementation via Web3Forms
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const resultMsg = document.getElementById('form-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;

        if (resultMsg) {
            resultMsg.classList.remove('hidden', 'text-green-600', 'text-red-600');
            resultMsg.textContent = "";
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                if (resultMsg) {
                    resultMsg.textContent = "Success! Your message has been sent.";
                    resultMsg.classList.remove('hidden');
                    resultMsg.classList.add('text-green-600');
                }
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                if (resultMsg) {
                    resultMsg.textContent = "Error: " + data.message;
                    resultMsg.classList.remove('hidden');
                    resultMsg.classList.add('text-red-600');
                }
            }

        } catch (error) {
            if (resultMsg) {
                resultMsg.textContent = "Something went wrong. Please try again.";
                resultMsg.classList.remove('hidden');
                resultMsg.classList.add('text-red-600');
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
