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
const darkModeBtn = document.getElementById('dark-mode-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const completedCount = document.getElementById('completed-count');
const focusCount = document.getElementById('focus-count');

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

let completedTasks = 0;
let focusSessions = 0;
let pomodoroInterval;
let pomodoroMinutes = 25;
let pomodoroSeconds = 0;
let isPomodoroRunning = false;

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    
    loadFromLocalStorage();
    setupEventListeners();
    initDarkMode();
    updateStats();
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
    pomodoroBtn.addEventListener('click', togglePomodoro);
    
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
    focusSessions += container.classList.contains('focus-mode') ? 1 : 0;
    updateStats();
    
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
    
    saveToLocalStorage();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.addEventListener('change', function() {
            const taskSpan = this.nextElementSibling;
            taskSpan.style.textDecoration = this.checked ? 'line-through' : 'none';
            completedTasks += this.checked ? 1 : -1;
            updateStats();
            saveToLocalStorage();
        });
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            if (taskCheckbox.checked) {
                completedTasks--;
                updateStats();
            }
            taskList.removeChild(taskItem);
            saveToLocalStorage();
        });
        
        taskItem.appendChild(taskCheckbox);
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
    document.querySelectorAll('#task-list li').forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent;
        const completed = taskItem.querySelector('input').checked;
        tasks.push({ text, completed });
    });
    
    const data = {
        name: nameInput.value,
        mood: moodSelector.value,
        tasks: tasks,
        greeting: greetingText.textContent,
        darkMode: document.body.classList.contains('dark-mode'),
        stats: {
            completed: completedTasks,
            focus: focusSessions
        }
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
            data.tasks.forEach(task => {
                const taskItem = document.createElement('li');
                
                const taskCheckbox = document.createElement('input');
                taskCheckbox.type = 'checkbox';
                taskCheckbox.checked = task.completed || false;
                taskCheckbox.addEventListener('change', function() {
                    const taskSpan = this.nextElementSibling;
                    taskSpan.style.textDecoration = this.checked ? 'line-through' : 'none';
                    completedTasks += this.checked ? 1 : -1;
                    updateStats();
                    saveToLocalStorage();
                });
                
                const taskSpan = document.createElement('span');
                taskSpan.textContent = task.text;
                taskSpan.style.textDecoration = task.completed ? 'line-through' : 'none';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.addEventListener('click', () => {
                    if (taskCheckbox.checked) {
                        completedTasks--;
                        updateStats();
                    }
                    taskList.removeChild(taskItem);
                    saveToLocalStorage();
                });
                
                taskItem.appendChild(taskCheckbox);
                taskItem.appendChild(taskSpan);
                taskItem.appendChild(deleteBtn);
                taskList.appendChild(taskItem);
                
                if (task.completed) completedTasks++;
            });
        }
        
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
        
        if (data.stats) {
            completedTasks = data.stats.completed || 0;
            focusSessions = data.stats.focus || 0;
            updateStats();
        }
    }
}

function initDarkMode() {
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        darkModeBtn.innerHTML = document.body.classList.contains('dark-mode') 
            ? '<i class="fas fa-sun"></i> Light Mode' 
            : '<i class="fas fa-moon"></i> Dark Mode';
        saveToLocalStorage();
    });
}

function togglePomodoro() {
    if (!isPomodoroRunning) {
        isPomodoroRunning = true;
        pomodoroMinutes = 25;
        pomodoroSeconds = 0;
        pomodoroBtn.textContent = `Pomodoro (${pomodoroMinutes}:00)`;
        
        pomodoroInterval = setInterval(() => {
            if (pomodoroSeconds === 0) {
                if (pomodoroMinutes === 0) {
                    clearInterval(pomodoroInterval);
                    pomodoroBtn.textContent = 'Pomodoro Complete!';
                    new Notification('Pomodoro Complete! Take a break!');
                    setTimeout(() => {
                        pomodoroBtn.textContent = 'Start Pomodoro (25:00)';
                        isPomodoroRunning = false;
                    }, 3000);
                    return;
                }
                pomodoroMinutes--;
                pomodoroSeconds = 59;
            } else {
                pomodoroSeconds--;
            }
            
            pomodoroBtn.textContent = `Pomodoro (${pomodoroMinutes}:${pomodoroSeconds.toString().padStart(2, '0')})`;
        }, 1000);
    } else {
        clearInterval(pomodoroInterval);
        isPomodoroRunning = false;
        pomodoroBtn.textContent = 'Start Pomodoro (25:00)';
    }
}

function updateStats() {
    completedCount.textContent = completedTasks;
    focusCount.textContent = focusSessions;
}

document.addEventListener('DOMContentLoaded', init);