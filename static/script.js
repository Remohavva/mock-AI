// Global variables
let isTyping = false;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');

// Initialize the chat
document.addEventListener('DOMContentLoaded', function() {
    // Focus on input when page loads
    messageInput.focus();
    
    // Load categories
    loadCategories();
    
    // Add event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Handle Enter key press
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Handle input changes for real-time validation
    messageInput.addEventListener('input', function() {
        const sendButton = document.querySelector('.btn-primary');
        if (this.value.trim()) {
            sendButton.disabled = false;
        } else {
            sendButton.disabled = true;
        }
    });
}

// Send message function
async function sendMessage() {
    const question = messageInput.value.trim();
    
    if (!question || isTyping) {
        return;
    }
    
    // Add user message to chat
    addMessage(question, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send request to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        if (data.success) {
            // Add bot response
            addMessage(data.answer, 'bot', data.category);
        } else {
            // Add error message
            addErrorMessage(data.message);
        }
        
    } catch (error) {
        hideTypingIndicator();
        addErrorMessage('Sorry, there was an error processing your request. Please try again.');
        console.error('Error:', error);
    }
}

// Add message to chat
function addMessage(text, sender, category = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let categoryBadge = '';
    if (category && sender === 'bot') {
        categoryBadge = `<div class="category-badge">${category}</div>`;
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-text">
                <h6>${sender === 'user' ? 'You' : 'Interview Bot'}</h6>
                <p>${text}</p>
                ${categoryBadge}
            </div>
        </div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add error message
function addErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="message-text error-message">
                <h6>Interview Bot</h6>
                <p><i class="fas fa-info-circle"></i> ${message}</p>
            </div>
        </div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
}

// Scroll to bottom of chat
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-text">
                        <h6>Interview Bot</h6>
                        <p>Hello! 👋 I'm your interview preparation assistant. Ask me any technical question and I'll help you with detailed answers. Try asking about database normalization, REST APIs, OOP concepts, or any other technical topic!</p>
                    </div>
                </div>
                <div class="message-time">Just now</div>
            </div>
        `;
    }
}

// Ask question from sample questions
function askQuestion(question) {
    messageInput.value = question;
    sendMessage();
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        // Update topic tags if needed
        updateTopicTags(data.categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Update topic tags
function updateTopicTags(categories) {
    const topicTags = document.getElementById('topicTags');
    if (topicTags && categories.length > 0) {
        topicTags.innerHTML = '';
        categories.forEach(category => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary';
            badge.textContent = category;
            badge.onclick = () => askQuestion(`Tell me about ${category.toLowerCase()}`);
            topicTags.appendChild(badge);
        });
    }
}

// Handle key press events
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Add smooth animations for better UX
function addSmoothAnimations() {
    // Add fade-in animation to new messages
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observe all message elements
    document.querySelectorAll('.message').forEach(message => {
        observer.observe(message);
    });
}

// Add copy functionality to bot messages
function addCopyFunctionality() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const messageText = e.target.closest('.message-text').querySelector('p').textContent;
            navigator.clipboard.writeText(messageText).then(() => {
                // Show copy success feedback
                const originalText = e.target.innerHTML;
                e.target.innerHTML = '<i class="fas fa-check"></i>';
                e.target.classList.add('text-success');
                
                setTimeout(() => {
                    e.target.innerHTML = originalText;
                    e.target.classList.remove('text-success');
                }, 2000);
            });
        }
    });
}

// Add search functionality
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search in chat...';
    searchInput.className = 'form-control mb-3';
    searchInput.id = 'searchInput';
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const messages = document.querySelectorAll('.message');
        
        messages.forEach(message => {
            const text = message.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                message.style.display = 'block';
                if (searchTerm) {
                    message.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                } else {
                    message.style.backgroundColor = '';
                }
            } else if (searchTerm) {
                message.style.display = 'none';
            } else {
                message.style.display = 'block';
                message.style.backgroundColor = '';
            }
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    addSmoothAnimations();
    addCopyFunctionality();
    // Uncomment the line below to add search functionality
    // addSearchFunctionality();
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }
    
    // Ctrl/Cmd + L to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
    }
});

// Add responsive sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

// Add this to the HTML if you want a mobile menu button
// <button class="btn btn-primary d-md-none" onclick="toggleSidebar()">
//     <i class="fas fa-bars"></i>
// </button> 