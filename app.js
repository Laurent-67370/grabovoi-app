document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const body = document.body;
    const daySelector = document.getElementById('day-selector');
    const mainContent = document.getElementById('exercise-content');
    const loader = document.getElementById('loader');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');
    const todayBtn = document.getElementById('today-btn');
    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseTheme = document.getElementById('exercise-theme');
    const part1Content = document.getElementById('part1-content');
    const sequence7Span = document.getElementById('sequence7');
    const sequence9Span = document.getElementById('sequence9');
    const part3Content = document.getElementById('part3-content');
    const streakCounter = document.getElementById('streak-counter');
    const markCompleteBtn = document.getElementById('mark-complete-btn');
    const journalText = document.getElementById('journal-text');
    const journalLabel = document.getElementById('journal-label');
    const mainIntentionDisplay = document.getElementById('main-intention-display');
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const aboutModalCloseBtn = document.getElementById('about-modal-close-btn');
    const progressBtn = document.getElementById('progress-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const calendarCloseBtn = document.getElementById('calendar-close-btn');
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarWeekdays = document.querySelector('.calendar-weekdays');
    const calendarDays = document.querySelector('.calendar-days');
    const calPrevMonthBtn = document.getElementById('calendar-prev-month');
    const calNextMonthBtn = document.getElementById('calendar-next-month');
    const trophiesBtn = document.getElementById('trophies-btn');
    const trophiesModal = document.getElementById('trophies-modal');
    const trophiesCloseBtn = document.getElementById('trophies-close-btn');
    const trophiesGrid = document.getElementById('trophies-grid');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const mainIntentionInput = document.getElementById('main-intention-input');
    const themeSelector = document.getElementById('theme-selector');
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    const calendarSearchInput = document.getElementById('calendar-search');
    const openChatBtn = document.getElementById('open-chat-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // --- Config & State ---
    const CHATBOT_API_URL = '/api/coach'; // Pointe vers notre fonction Netlify
    let conversationHistory = [];
    let allExercises = [];
    let currentDate = new Date();
    let calendarDate = new Date();
    let appData = { completed: {}, journal: {}, settings: { theme: 'cosmic', mainIntention: '' }, unlockedTrophies: [] };
    const TROPHIES_LIST = [ { id: 'first_practice', icon: '🌱', title: 'Premiers Pas', desc: 'Terminer son premier exercice.' }, { id: 'week_streak', icon: '🔥', title: 'En Feu !', desc: 'Pratiquer 7 jours de suite.' }, { id: 'scribe', icon: '✍️', title: 'Scribe', desc: 'Écrire 5 notes de journal.' }, { id: 'month_7_days', icon: '🌿', title: 'Persévérance', desc: 'Pratiquer 7 jours dans le même mois.' }, { id: 'month_14_days', icon: '🌳', title: 'Engagement', desc: 'Pratiquer 14 jours dans le même mois.' }, { id: 'month_21_days', icon: '🌲', title: 'Dévotion', desc: 'Pratiquer 21 jours dans le même mois.' }, { id: 'perfect_month', icon: '🌟', title: 'Mois Parfait', desc: 'Pratiquer tous les jours d\'un mois.' } ];
    
    // --- Data & UI Functions ---
    const formatDateKey = (date) => date.toISOString().split('T')[0];
    const saveData = () => localStorage.setItem('grabovoiAppData', JSON.stringify(appData));
    const loadData = () => { const data = localStorage.getItem('grabovoiAppData'); if (data) { const parsedData = JSON.parse(data); appData.completed = parsedData.completed || {}; appData.journal = parsedData.journal || {}; appData.unlockedTrophies = parsedData.unlockedTrophies || []; appData.settings = Object.assign({ theme: 'cosmic', mainIntention: '' }, parsedData.settings); } };
    const applyTheme = (themeName) => { body.className = `theme-${themeName}`; themeSelector.querySelectorAll('.theme-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === themeName)); };
    const displayMainIntention = () => { mainIntentionDisplay.textContent = appData.settings.mainIntention || ''; };

    // --- Chatbot Functions ---
    const addMessageToChat = (message, sender) => { const messageElement = document.createElement('div'); messageElement.classList.add('chat-message', sender); messageElement.textContent = message; chatMessages.appendChild(messageElement); chatMessages.scrollTop = chatMessages.scrollHeight; return messageElement; };
    const callCoachAPI = async () => { try { const response = await fetch(CHATBOT_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversationHistory: conversationHistory }) }); if (!response.ok) { throw new Error(`Erreur du serveur: ${response.status}`); } const data = await response.json(); const botReply = data.reply; conversationHistory.push({ role: 'assistant', content: botReply }); return botReply; } catch (error) { console.error('Erreur lors de l\'appel à la fonction Coach:', error); return "Désolé, une erreur est survenue avec le coach. Veuillez réessayer."; } };
    const initializeCoach = () => { const todayExercise = allExercises.find(ex => ex.day === currentDate.getDate()); if (!todayExercise) return; const systemPrompt = `Tu es un Coach spécialisé dans les enseignements de Grigori Grabovoï. Ton ton est calme, sage et encourageant. Tu ne donnes jamais de conseils médicaux. Tu te bases uniquement sur le contenu des exercices fournis. Voici le contexte de l'exercice d'aujourd'hui (Jour ${todayExercise.day}) : - Titre : ${todayExercise.title} - Thème : ${todayExercise.theme} - Première partie : ${todayExercise.part1_html.replace(/<[^>]*>/g, '')} - Troisième partie : ${todayExercise.part3_html.replace(/<[^>]*>/g, '')}. Réponds aux questions de l'utilisateur en te référant à ces informations. Sois bref et inspirant. Commence ta première intervention par une salutation et une question ouverte sur sa pratique du jour.`; conversationHistory = [{ role: 'system', content: systemPrompt }]; };
    
    // --- Other Core Functions ---
    const checkAndUnlockTrophies = () => { let newTrophyUnlocked = false; const streak = parseInt(streakCounter.textContent, 10); if (!appData.unlockedTrophies.includes('first_practice') && Object.keys(appData.completed).length >= 1) { appData.unlockedTrophies.push('first_practice'); newTrophyUnlocked = true; } if (!appData.unlockedTrophies.includes('week_streak') && streak >= 7) { appData.unlockedTrophies.push('week_streak'); newTrophyUnlocked = true; } if (!appData.unlockedTrophies.includes('scribe') && Object.keys(appData.journal).length >= 5) { appData.unlockedTrophies.push('scribe'); newTrophyUnlocked = true; } const now = new Date(); const currentYear = now.getFullYear(); const currentMonth = now.getMonth(); const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`; const daysPracticedThisMonth = Object.keys(appData.completed).filter(key => key.startsWith(currentMonthPrefix)).length; if (!appData.unlockedTrophies.includes('month_7_days') && daysPracticedThisMonth >= 7) { appData.unlockedTrophies.push('month_7_days'); newTrophyUnlocked = true; } if (!appData.unlockedTrophies.includes('month_14_days') && daysPracticedThisMonth >= 14) { appData.unlockedTrophies.push('month_14_days'); newTrophyUnlocked = true; } if (!appData.unlockedTrophies.includes('month_21_days') && daysPracticedThisMonth >= 21) { appData.unlockedTrophies.push('month_21_days'); newTrophyUnlocked = true; } const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); if (!appData.unlockedTrophies.includes('perfect_month') && daysPracticedThisMonth >= totalDaysInMonth) { appData.unlockedTrophies.push('perfect_month'); newTrophyUnlocked = true; } if (newTrophyUnlocked) { setTimeout(() => alert('Nouveau trophée débloqué ! Allez voir dans la section 🏆.'), 100); saveData(); } };
    const displayTrophies = () => { trophiesGrid.innerHTML = TROPHIES_LIST.map(trophy => `<div class="trophy-item ${appData.unlockedTrophies.includes(trophy.id) ? '' : 'locked'}"><div class="trophy-icon">${trophy.icon}</div><div class="trophy-title">${trophy.title}</div><div class="trophy-desc">${trophy.desc}</div></div>`).join(''); };
    const displayExercise = (date) => { currentDate = new Date(date); const dayNumber = currentDate.getDate(); daySelector.value = dayNumber; loader.style.display = 'block'; mainContent.classList.add('hidden'); setTimeout(() => { const exerciseData = allExercises.find(ex => ex.day === dayNumber); if (exerciseData) { exerciseTitle.textContent = exerciseData.title; exerciseTheme.textContent = exerciseData.theme; part1Content.innerHTML = exerciseData.part1_html; sequence7Span.textContent = exerciseData.sequence7; sequence9Span.textContent = exerciseData.sequence9; part3Content.innerHTML = exerciseData.part3_html; updateInteractiveElements(currentDate); } loader.style.display = 'none'; mainContent.classList.remove('hidden'); }, 300); };
    const updateInteractiveElements = (date) => { const dateKey = formatDateKey(date); const todayKey = formatDateKey(new Date()); if (appData.completed[dateKey]) { markCompleteBtn.classList.add('completed'); markCompleteBtn.textContent = dateKey === todayKey ? 'Pratique du jour validée ✓' : 'Pratique validée ✓'; markCompleteBtn.disabled = true; } else { markCompleteBtn.classList.remove('completed'); if (dateKey !== todayKey) { markCompleteBtn.disabled = true; markCompleteBtn.textContent = 'Validation impossible'; } else { markCompleteBtn.disabled = false; markCompleteBtn.textContent = 'Marquer comme terminé'; } } journalLabel.textContent = `Mon journal du ${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}:`; journalText.value = appData.journal[dateKey] || ''; };
    const calculateStreak = () => { let streak = 0; let today = new Date(); for (let i = 0; i < 365; i++) { const dateToCheck = new Date(today); dateToCheck.setDate(today.getDate() - i); if (appData.completed[formatDateKey(dateToCheck)]) { streak++; } else { break; } } streakCounter.textContent = streak; };
    const filterCalendarDays = (searchTerm) => { const term = searchTerm.toLowerCase().trim(); const days = calendarDays.querySelectorAll('.calendar-day'); days.forEach(day => { day.classList.remove('search-result'); if (term && !day.classList.contains('empty-day')) { const dayNumber = parseInt(day.textContent, 10); const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), dayNumber); const dateKey = formatDateKey(date); const journalEntry = (appData.journal[dateKey] || '').toLowerCase(); if (journalEntry.includes(term)) { day.classList.add('search-result'); } } }); };
    const generateCalendar = (date) => { calendarDate = new Date(date); const year = calendarDate.getFullYear(); const month = calendarDate.getMonth(); calendarMonthYear.textContent = calendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); calendarDays.innerHTML = ''; const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); const dayOffset = (firstDay === 0) ? 6 : firstDay - 1; for (let i = 0; i < dayOffset; i++) calendarDays.insertAdjacentHTML('beforeend', `<div class="calendar-day empty-day"></div>`); for (let i = 1; i <= daysInMonth; i++) { const dayDate = new Date(year, month, i); const dateKey = formatDateKey(dayDate); const dayEl = document.createElement('div'); dayEl.classList.add('calendar-day'); if (dateKey === formatDateKey(new Date())) dayEl.classList.add('today'); if (appData.completed[dateKey]) dayEl.classList.add('completed-day'); dayEl.textContent = i; dayEl.addEventListener('click', () => { displayExercise(dayDate); calendarModal.classList.remove('visible'); }); calendarDays.appendChild(dayEl); } };
    const handleDataExport = () => { try { const dataStr = JSON.stringify(appData, null, 2); const dataBlob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(dataBlob); const link = document.createElement('a'); link.href = url; link.download = `grabovoi_data_${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); } catch (error) { console.error("Erreur lors de l'exportation:", error); alert("Une erreur est survenue lors de l'exportation."); } };
    const handleDataImport = () => { const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'application/json,.json'; fileInput.onchange = e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const importedData = JSON.parse(event.target.result); if ('completed' in importedData && 'journal' in importedData && 'settings' in importedData) { const confirmation = confirm("Êtes-vous sûr de vouloir importer ces données ?\n\nATTENTION : Cette action écrasera toutes les données actuelles. Il est recommandé d'exporter vos données actuelles avant de continuer."); if (confirmation) { localStorage.setItem('grabovoiAppData', JSON.stringify(importedData)); alert("Données importées avec succès ! L'application va maintenant se recharger."); location.reload(); } } else { alert("Le fichier de sauvegarde semble invalide ou corrompu."); } } catch (error) { console.error("Erreur lecture JSON:", error); alert("Une erreur est survenue. Assurez-vous de sélectionner un fichier de sauvegarde valide."); } }; reader.readAsText(file); }; fileInput.click(); };

    // --- App Initialization ---
    const initializeApp = async () => {
        loadData();
        applyTheme(appData.settings.theme);
        displayMainIntention();
        try {
            const response = await fetch('exercises.json');
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            allExercises = await response.json();
            for (let i = 1; i <= 31; i++) daySelector.insertAdjacentHTML('beforeend', `<option value="${i}">Jour ${i}</option>`);
            displayExercise(new Date());
            calculateStreak();
            
            daySelector.addEventListener('change', (e) => { const newDate = new Date(currentDate); newDate.setDate(parseInt(e.target.value, 10)); displayExercise(newDate); });
            prevDayBtn.addEventListener('click', () => { const newDate = new Date(currentDate); newDate.setDate(newDate.getDate() - 1); displayExercise(newDate); });
            nextDayBtn.addEventListener('click', () => { const newDate = new Date(currentDate); newDate.setDate(newDate.getDate() + 1); displayExercise(newDate); });
            todayBtn.addEventListener('click', () => displayExercise(new Date()));
            markCompleteBtn.addEventListener('click', () => { const todayKey = formatDateKey(new Date()); appData.completed[todayKey] = true; saveData(); calculateStreak(); updateInteractiveElements(currentDate); checkAndUnlockTrophies(); });
            journalText.addEventListener('input', () => { appData.journal[formatDateKey(currentDate)] = journalText.value; checkAndUnlockTrophies(); saveData(); });
            aboutBtn.addEventListener('click', () => aboutModal.classList.add('visible'));
            progressBtn.addEventListener('click', () => { generateCalendar(currentDate); calendarSearchInput.value = ''; filterCalendarDays(''); calendarModal.classList.add('visible'); });
            settingsBtn.addEventListener('click', () => { mainIntentionInput.value = appData.settings.mainIntention; settingsModal.classList.add('visible'); });
            trophiesBtn.addEventListener('click', () => { checkAndUnlockTrophies(); displayTrophies(); trophiesModal.classList.add('visible'); });
            [aboutModal, calendarModal, settingsModal, trophiesModal, chatbotModal].forEach(modal => { if(modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('visible'); }); });
            aboutModalCloseBtn.addEventListener('click', () => aboutModal.classList.remove('visible'));
            calendarCloseBtn.addEventListener('click', () => calendarModal.classList.remove('visible'));
            settingsCloseBtn.addEventListener('click', () => settingsModal.classList.remove('visible'));
            trophiesCloseBtn.addEventListener('click', () => trophiesModal.classList.remove('visible'));
            calPrevMonthBtn.addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); generateCalendar(calendarDate); filterCalendarDays(calendarSearchInput.value); });
            calNextMonthBtn.addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); generateCalendar(calendarDate); filterCalendarDays(calendarSearchInput.value); });
            mainIntentionInput.addEventListener('input', () => { appData.settings.mainIntention = mainIntentionInput.value; displayMainIntention(); saveData(); });
            themeSelector.addEventListener('click', (e) => { if (e.target.classList.contains('theme-btn')) { const theme = e.target.dataset.theme; appData.settings.theme = theme; applyTheme(theme); saveData(); } });
            exportDataBtn.addEventListener('click', handleDataExport);
            importDataBtn.addEventListener('click', handleDataImport);
            calendarSearchInput.addEventListener('input', (e) => filterCalendarDays(e.target.value));

            // Chatbot listeners
            openChatBtn.addEventListener('click', () => { initializeCoach(); chatbotModal.classList.add('visible'); if (chatMessages.children.length === 0) { addMessageToChat("Bonjour ! Je suis votre coach pour la pratique d'aujourd'hui. Comment puis-je vous aider ?", 'bot'); } });
            chatbotCloseBtn.addEventListener('click', () => { chatbotModal.classList.remove('visible'); conversationHistory = []; chatMessages.innerHTML = ''; });
            chatForm.addEventListener('submit', async (e) => { e.preventDefault(); const userMessage = chatInput.value.trim(); if (!userMessage) return; addMessageToChat(userMessage, 'user'); conversationHistory.push({ role: 'user', content: userMessage }); chatInput.value = ''; const typingIndicator = addMessageToChat('...', 'bot typing'); const botResponse = await callCoachAPI(); typingIndicator.textContent = botResponse; typingIndicator.classList.remove('typing'); });

        } catch (error) { console.error("Erreur de chargement:", error); }
    };
    
    const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    calendarWeekdays.innerHTML = weekdays.map(day => `<div>${day}</div>`).join('');

    initializeApp();
});