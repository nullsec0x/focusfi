const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const nameInput = document.getElementById('name');
const greetingText = document.getElementById('greeting-text');
const moodSelector = document.getElementById('mood');
const focusModeBtn = document.getElementById('focus-mode-btn');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const getMotivationBtn = document.getElementById('get-motivation-btn');
const quoteDisplay = document.getElementById('quote-display');
const container = document.querySelector('.container');

const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort. - Paul J. Meyer",
    "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus. - Alexander Graham Bell",
    "Do the hard jobs first. The easy jobs will take care of themselves. - Dale Carnegie",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "You are what you do, not what you say you'll do. - Carl Jung",
    "It's not that I'm so smart, it's just that I stay with problems longer. - Albert Einstein",
    "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey"
];

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    
    loadFromLocalStorage();
    setupEventListeners();
}

function updateClock() {
    const now = new Date();
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    
    clockElement.textContent = timeString;
    dateElement.textContent = dateString;
}

function setupEventListeners() {
    nameInput.addEventListener('input', updateGreeting);
    
    moodSelector.addEventListener('change', changeMood);
    
    focusModeBtn.addEventListener('click', toggleFocusMode);
    
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    getMotivationBtn.addEventListener('click', showRandomQuote);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && container.classList.contains('focus-mode')) {
            toggleFocusMode();
        }
    });
}

function updateGreeting() {
    const name = nameInput.value.trim();
    if (name) {
        const hours = new Date().getHours();
        let greeting;
        
        if (hours < 12) greeting = 'Good morning';
        else if (hours < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        greetingText.textContent = `${greeting}, ${name}!`;
    } else {
        greetingText.textContent = 'Hello there!';
    }
    
    saveToLocalStorage();
}

function changeMood() {
    const mood = moodSelector.value;
    document.body.setAttribute('data-mood', mood);
    saveToLocalStorage();
}

function toggleFocusMode() {
    container.classList.toggle('focus-mode');
    
    if (container.classList.contains('focus-mode')) {
        focusModeBtn.textContent = 'Exit Focus Mode';
        const exitBtn = document.createElement('button');
        exitBtn.id = 'exit-focus-btn';
        exitBtn.innerHTML = '<i class="fas fa-times"></i> Exit Focus Mode';
        exitBtn.addEventListener('click', toggleFocusMode);
        document.querySelector('main').prepend(exitBtn);
    } else {
        focusModeBtn.textContent = 'Focus Mode';
        const exitBtn = document.getElementById('exit-focus-btn');
        if (exitBtn) exitBtn.remove();
    }
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveToLocalStorage();
        });
        
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
        
        taskInput.value = '';
        saveToLocalStorage();
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex];
}

function saveToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li span').forEach(task => {
        tasks.push(task.textContent);
    });
    
    const data = {
        name: nameInput.value,
        mood: moodSelector.value,
        tasks: tasks,
        greeting: greetingText.textContent
    };
    
    localStorage.setItem('focusFiData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('focusFiData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        nameInput.value = data.name || '';
        greetingText.textContent = data.greeting || 'Hello there!';
        
        if (data.mood && data.mood !== 'default') {
            moodSelector.value = data.mood;
            document.body.setAttribute('data-mood', data.mood);
        }
        
        if (data.tasks && data.tasks.length > 0) {
            data.tasks.forEach(taskText => {
                const taskItem = document.createElement('li');
                
                const taskSpan = document.createElement('span');
                taskSpan.textContent = taskText;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.addEventListener('click', () => {
                    taskList.removeChild(taskItem);
                    saveToLocalStorage();
                });
                
                taskItem.appendChild(taskSpan);
                taskItem.appendChild(deleteBtn);
                taskList.appendChild(taskItem);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', init);