import { useState, useEffect, useRef } from 'react'
import './App.css'

// Import assets
import stage0 from './assets/stage0.png'
import stage1 from './assets/stage1.png'
import stage2 from './assets/stage2.png'
import stage3 from './assets/stage3.png'
import stage4 from './assets/stage4.png'
import stage5 from './assets/stage5.png'

// Questions for each habit
const habitQuestions = {
    water: [
        { id: 'w1', question: "How many glasses of water should we drink daily? 💧", options: ["1 glass", "3 glasses", "6-8 glasses"], correct: "6-8 glasses" },
        { id: 'w2', question: "When is a good time to drink water? 🕒", options: ["Only when thirsty", "Throughout the day", "Never"], correct: "Throughout the day" },
        { id: 'w3', question: "What does water do for our body? 💪", options: ["Nothing", "Keeps us hydrated", "Makes us sleepy"], correct: "Keeps us hydrated" }
    ],
    meditate: [
        { id: 'm1', question: "What helps us feel calm? 🧘", options: ["Shouting loud", "Deep breathing", "Running fast"], correct: "Deep breathing" },
        { id: 'm2', question: "Where is a good place to meditate? 🌳", options: ["Quiet spot", "Busy street", "Loud concert"], correct: "Quiet spot" },
        { id: 'm3', question: "How long should we meditate? ⏱️", options: ["1 second", "A few minutes", "All day"], correct: "A few minutes" }
    ],
    lunch: [
        { id: 'l1', question: "What is a healthy lunch component? 🥪", options: ["Only Candy", "Vegetables & Protein", "Ice Cream"], correct: "Vegetables & Protein" },
        { id: 'l2', question: "Why do we eat lunch? 🔋", options: ["To get energy", "To sleep", "To watch TV"], correct: "To get energy" },
        { id: 'l3', question: "Which drink is best with lunch? 🥛", options: ["Soda", "Water or Milk", "Juice only"], correct: "Water or Milk" }
    ],
    homework: [
        { id: 'h1', question: "Should homework be done before play? 📝", options: ["Yes", "No", "Only on weekends"], correct: "Yes" },
        { id: 'h2', question: "What helps us focus on homework? 💡", options: ["Loud music", "Quiet space", "Dark room"], correct: "Quiet space" },
        { id: 'h3', question: "Why do we do homework? 🧠", options: ["To learn", "To waste time", "For fun only"], correct: "To learn" }
    ],
    dinner: [
        { id: 'd1', question: "What is good to do before dinner? 🍽️", options: ["Wash hands", "Sleep", "Jump on bed"], correct: "Wash hands" },
        { id: 'd2', question: "What should be on our dinner plate? 🥗", options: ["Only dessert", "Balanced meal", "Chips"], correct: "Balanced meal" },
        { id: 'd3', question: "Why shouldn't we eat too late? 🌙", options: ["Bad dreams", "Hard to digest", "Ghosts"], correct: "Hard to digest" }
    ],
    sleep: [
        { id: 's1', question: "Why is sleep important? 😴", options: ["To be tired", "To grow & rest", "To watch TV"], correct: "To grow & rest" },
        { id: 's2', question: "How many hours should kids sleep? 🛌", options: ["1 hour", "4 hours", "9-11 hours"], correct: "9-11 hours" },
        { id: 's3', question: "What helps us sleep better? 📖", options: ["Reading a book", "Playing video games", "Eating candy"], correct: "Reading a book" }
    ]
}

const TREE_TYPES = {
    mango: { name: 'Mango', emoji: '🥭', color: '#FFD700' },
    apple: { name: 'Apple', emoji: '🍎', color: '#FF5252' },
    orange: { name: 'Orange', emoji: '🍊', color: '#FFA726' },
    guava: { name: 'Guava', emoji: '🍈', color: '#9CCC65' },
    coconut: { name: 'Coconut', emoji: '🥥', color: '#795548' }
}


const SUCCESS_MESSAGES = [
    "Great job today! 🌟 Come back tomorrow to help your tree grow!",
    "You did it! 🌱 Let’s grow more tomorrow!",
    "Yay! Today’s task is done 💚",
    "Your tree grew today! 🌳 See you tomorrow!",
    "Watering done for today 💧 Your tree is happy!",
    "All done for today 🌙 Your tree is resting.",
    "Nice work today 🌱 Time to grow again tomorrow.",
    "Today’s growth is complete 💫 See you tomorrow!"
]

// Shown when starting a new tree / month
const RESET_MESSAGES = [
    "New month, new beginnings! 🌱 Pick a tree to start growing again.",
    "Your last tree had a great month! Ready to grow a new one? 🌳",
    "Fresh start! Choose a new tree to grow your habits this month. 🌼"
]

// Shown when the user reaches day 30
const CELEBRATION_MESSAGES = [
    "🎉 Wow! 30 days of growing good habits!",
    "🏆 Amazing work! Your habit tree is fully grown!",
    "🌳 You did it! A whole month of consistency!",
    "⭐ So proud of you! Keep shining and growing!"
]

// Parent gate question pool (single random question each time gate opens)
const PARENT_GATE_QUESTIONS = [
    {
        id: 'q1',
        question: "Which month comes before March?",
        answer: "February",
        options: ["January", "February", "April"]
    },
    {
        id: 'q2',
        question: "What day comes after Friday?",
        answer: "Saturday",
        options: ["Thursday", "Saturday", "Sunday"]
    },
    {
        id: 'q3',
        question: "What is 10 + 15?",
        answer: "25",
        options: ["20", "24", "25", "30"]
    },
    {
        id: 'q4',
        question: "Which number is bigger: 50 or 5?",
        answer: "50",
        options: ["5", "50"]
    },
    {
        id: 'q5',
        question: "How many minutes are there in 1 hour?",
        answer: "60",
        options: ["30", "45", "60", "90"]
    },
    {
        id: 'q6',
        question: "How many wheels does a car usually have?",
        answer: "4",
        options: ["2", "3", "4", "6"]
    },
    {
        id: 'q7',
        question: "Which one is used to tell time?",
        answer: "Clock",
        options: ["Clock", "Spoon", "Pillow"]
    }
]

// Helper to create a fresh month/user data, used for new profiles
const createInitialUserData = () => {
    // MIGRATION: Check for old flat data (from an older version of the app)
    const oldName = localStorage.getItem('userName')
    const oldTree = localStorage.getItem('treeType')
    const oldStage = parseInt(localStorage.getItem('growthStage')) || 1
    const oldStreak = parseInt(localStorage.getItem('consecutiveStreak')) || 0
    const oldLastDate = localStorage.getItem('lastCompletedDate') || ''

    const now = new Date()
    const currentMonthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    return {
        userName: oldName || '',
        history: [], // [{ monthId, treeType, growthStage, fruitsEarned, status }]
        currentMonth: {
            monthId: currentMonthId,
            treeType: oldTree || null,
            growthStage: oldStage,
            consecutiveStreak: oldStreak,
            lastCompletedDate: oldLastDate,
            fruitsEarned: 0, // Start fresh
            isCelebrated: false // For Day 30 celebration
        },
        // Settings could go here
        rewards: {}
    }
}

function App() {
    // --- STATE MANAGEMENT ---
    // Multi-profile shell
    const [profiles, setProfiles] = useState(() => {
        const saved = localStorage.getItem('habitGardenProfiles')
        return saved ? JSON.parse(saved) : []
    })

    const [currentProfileId, setCurrentProfileId] = useState(() => {
        const saved = localStorage.getItem('habitGardenCurrentProfileId')
        return saved || null
    })

    const [appView, setAppView] = useState('profileSelect') // 'profileSelect' | 'dashboard' | 'tasks'

    const [showProfile, setShowProfile] = useState(false);

    // Core Data Structure (per profile)
    const [userData, setUserData] = useState(() => {
        const profileKey = currentProfileId ? `habitGardenData_${currentProfileId}` : 'habitGardenData'
        const saved = localStorage.getItem(profileKey)
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch (e) {
                console.error('Failed to parse saved habitGardenData', e)
            }
        }
        return createInitialUserData()
    })

    // Transient State (Daily)
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('habits')
        return saved ? JSON.parse(saved) : {
            water: false, meditate: false, lunch: false,
            homework: false, dinner: false, sleep: false
        }
    })

    const [dailyQuote, setDailyQuote] = useState(() => {
        const saved = localStorage.getItem('dailySuccessMessage')
        if (saved) {
            const { date, message } = JSON.parse(saved)
            if (date === new Date().toDateString()) return message
        }
        return ''
    })

    const [usedQuestions, setUsedQuestions] = useState(() => {
        const saved = localStorage.getItem('usedQuestions')
        return saved ? JSON.parse(saved) : {}
    })

    // UI State
    const [nameInput, setNameInput] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activeHabit, setActiveHabit] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [modalMessage, setModalMessage] = useState('')
    const [animKey, setAnimKey] = useState(0)
    const [profileTab, setProfileTab] = useState('child')
    const [parentLocked, setParentLocked] = useState(true)
    const [gateAnswer, setGateAnswer] = useState('')
    const [gateError, setGateError] = useState('')
    const [parentQuestion, setParentQuestion] = useState(null)

    // --- LOGIC & EFFECTS ---

    // Load userData when profile changes
    useEffect(() => {
        if (!currentProfileId) return
        const key = `habitGardenData_${currentProfileId}`
        const saved = localStorage.getItem(key)
        if (saved) {
            try {
                setUserData(JSON.parse(saved))
                return
            } catch (e) {
                console.error('Failed to parse saved habitGardenData for profile', currentProfileId, e)
            }
        }
        // If nothing saved yet, start fresh for this profile
        setUserData(createInitialUserData())
    }, [currentProfileId])

    // 1. Persistence & Month Check
    useEffect(() => {
        if (!currentProfileId || !userData) return

        // Save Data (per profile)
        const key = `habitGardenData_${currentProfileId}`
        localStorage.setItem(key, JSON.stringify(userData))
        localStorage.setItem('habits', JSON.stringify(habits))
        localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions))

        // Check Month Change
        const now = new Date()
        const realMonthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

        if (userData.currentMonth.monthId !== realMonthId) {
            // NEW MONTH DETECTED!
            archiveCurrentMonth(realMonthId)
        }
    }, [userData, habits, usedQuestions])

    // 2. Daily Reset Check (Habits only)
    useEffect(() => {
        const todayStr = new Date().toDateString()
        const lastOpenDate = localStorage.getItem('lastOpenDate')

        if (lastOpenDate !== todayStr) {
            // New Day: Reset Habits
            setHabits({
                water: false, meditate: false, lunch: false,
                homework: false, dinner: false, sleep: false
            })
            setDailyQuote('')
            localStorage.removeItem('dailySuccessMessage')
            localStorage.setItem('lastOpenDate', todayStr)

            // Check Streak (in userData now)
            // Logic: If lastCompletedDate was not yesterday, reset streak.
            // Using userData ref directly might be stale if inside simple effect, but we can check state.
            // Better to do this in a function update or just reliance on the render cycle check below?
            // Let's do a safe check:
            checkStreakReset(todayStr)
        }
    }, [])

    // Helper to archive month
    const archiveCurrentMonth = (newMonthId) => {
        setUserData(prev => {
            // Calculate status
            const isComplete = prev.currentMonth.growthStage >= 30
            const historyEntry = {
                monthId: prev.currentMonth.monthId,
                treeType: prev.currentMonth.treeType || 'unknown',
                growthStage: prev.currentMonth.growthStage,
                fruitsEarned: prev.currentMonth.fruitsEarned || 0, // We need to track this
                status: isComplete ? 'Completed' : 'In Progress'
            }

            return {
                ...prev,
                history: [...prev.history, historyEntry],
                currentMonth: {
                    monthId: newMonthId,
                    treeType: null, // Reset tree
                    growthStage: 1, // Reset to Seed
                    consecutiveStreak: 0,
                    lastCompletedDate: '',
                    fruitsEarned: 0,
                    isCelebrated: false
                }
            }
        })
    }

    const checkStreakReset = (todayStr) => {
        setUserData(prev => {
            const last = prev.currentMonth.lastCompletedDate
            if (!last) return prev // Fresh start

            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toDateString()

            if (last !== yesterdayStr && last !== todayStr) {
                // Streak broken
                return {
                    ...prev,
                    currentMonth: { ...prev.currentMonth, consecutiveStreak: 0 }
                }
            }
            return prev
        })
    }

    // --- ACTIONS ---

    const handleStart = () => {
        if (nameInput.trim()) {
            setUserData(prev => ({ ...prev, userName: nameInput }))
        }
    }

    const selectTree = (type) => {
        setUserData(prev => ({
            ...prev,
            currentMonth: { ...prev.currentMonth, treeType: type }
        }))
    }

    const toggleHabit = (habit) => {
        setHabits(prev => {
            const newHabits = { ...prev, [habit]: !prev[habit] }
            checkDailyCompletion(newHabits)
            return newHabits
        })
    }

    const checkDailyCompletion = (currentHabits) => {
        const allCompleted = Object.values(currentHabits).every(Boolean)
        const today = new Date().toDateString()
        const { growthStage, lastCompletedDate } = userData.currentMonth

        if (allCompleted) {
            // 1. Growth Logic
            if (lastCompletedDate !== today && growthStage <= 30) {
                // Determine fruit gain (logic from before: 1 fruit per 3 streak?? or just simple accumulation)
                // App requirement: "Every 7 continuous... + On Day 30"
                // Let's simplified keep track of "Fruits Earned" for history.
                // We'll calculate it derived for now or store it. Let's store it.

                setUserData(prev => {
                    const cur = prev.currentMonth
                    const newStreak = cur.consecutiveStreak + 1
                    const newStage = cur.growthStage < 30 ? cur.growthStage + 1 : cur.growthStage // Cap at 30? Or freeze? "Growth freezes" if missed.
                    // Actually prompt says "Days 26-30: Fruit tree".
                    // If we are at 30, we stay at 30.

                    // Fruits: Week logic
                    let addedFruits = 0
                    if (newStreak > 0 && newStreak % 7 === 0) addedFruits = 1 // Simplified weekly reward
                    if (newStage === 30 && cur.growthStage === 29) addedFruits += 5 // Bonus for finish?

                    return {
                        ...prev,
                        currentMonth: {
                            ...cur,
                            growthStage: newStage,
                            lastCompletedDate: today,
                            consecutiveStreak: newStreak,
                            fruitsEarned: (cur.fruitsEarned || 0) + addedFruits,
                            isCelebrated: newStage === 30 && !cur.isCelebrated
                        }
                    }
                })
                setAnimKey(prev => prev + 1)
                setAppView('dashboard')
            }

            // 2. Success Message
            if (!dailyQuote) {
                const lastIdx = parseInt(localStorage.getItem('lastSuccessMsgIdx')) || -1
                let newIdx;
                do { newIdx = Math.floor(Math.random() * SUCCESS_MESSAGES.length) }
                while (newIdx === lastIdx && SUCCESS_MESSAGES.length > 1)

                const newMsg = SUCCESS_MESSAGES[newIdx]
                setDailyQuote(newMsg)
                localStorage.setItem('dailySuccessMessage', JSON.stringify({ date: today, message: newMsg }))
                localStorage.setItem('lastSuccessMsgIdx', newIdx)
            }
        }
    }

    const handleHabitClick = (habit) => {
        if (habits[habit]) { toggleHabit(habit); return }

        const allQuestions = habitQuestions[habit]
        const usedIds = usedQuestions[habit] || []
        let available = allQuestions.filter(q => !usedIds.includes(q.id))
        if (available.length === 0) available = allQuestions

        const q = available[Math.floor(Math.random() * available.length)]
        setActiveHabit(habit); setCurrentQuestion(q); setModalMessage(''); setShowModal(true)
    }

    const handleAnswer = (option) => {
        if (option === currentQuestion.correct) {
            setHabits(prev => {
                const newH = { ...prev, [activeHabit]: true }
                checkDailyCompletion(newH)
                return newH
            })
            setUsedQuestions(prev => {
                const u = prev[activeHabit] || []
                const all = habitQuestions[activeHabit]
                const newU = [...u, currentQuestion.id]
                return { ...prev, [activeHabit]: newU.length >= all.length ? [] : newU }
            })
            setShowModal(false); setActiveHabit(null); setCurrentQuestion(null)
        } else {
            setModalMessage("Good try! Try again 😊")
        }
    }

    // --- PARENT GATE ACTIONS ---
    const loadParentGateQuestion = () => {
        const rand = PARENT_GATE_QUESTIONS[Math.floor(Math.random() * PARENT_GATE_QUESTIONS.length)]
        setParentQuestion(rand)
        setGateAnswer('')
        setGateError('')
    }

    const checkParentGate = () => {
        if (!parentQuestion) return
        const normalizedUser = (gateAnswer || '').trim().toLowerCase()
        const normalizedAnswer = (parentQuestion.answer || '').trim().toLowerCase()
        if (normalizedUser && normalizedUser === normalizedAnswer) {
            setParentLocked(false)
            setGateError('')
        } else {
            setGateError('Please try again.')
        }
    }

    // --- VISUALS ---
    const { userName } = userData || {}
    const { treeType, growthStage, consecutiveStreak, fruitsEarned, isCelebrated } = userData?.currentMonth || {}
    const completedCount = Object.values(habits).filter(Boolean).length
    const isDailyDone = completedCount === 6

    const getPlantImage = () => {
        if (growthStage <= 3) return stage1
        if (growthStage <= 10) return stage2
        if (growthStage <= 15) return stage3
        if (growthStage <= 18) return stage4
        return stage5
    }

    // Derived Visuals
    const showFlowers = growthStage >= 11 && growthStage <= 25
    const showFruits = growthStage >= 19
    // Logic for fruit count visual:
    // "Every 7 continuous days + Day 30"
    // We can use the real `fruitsEarned` or the visual formula. Formula is nicer for lots of fruits.
    // Let's mix: show visual based on Streak + constant base for Stage.
    const visualFruitCount = growthStage >= 26 ? 8 : Math.floor(consecutiveStreak / 3) + 1

    const habitIcons = {
        water: '💧', meditate: '🧘', lunch: '🥪',
        homework: '📚', dinner: '🍽️', sleep: '😴'
    }

    // --- TOP-LEVEL VIEWS ---

    // 1) Profile selection (Netflix-kids style)
    if (!currentProfileId) {
        return (
            <div className="app-container profile-select">
                <h1>Good Habit Garden 🌱</h1>
                <p className="message">Who is playing today?</p>

                <div className="profile-grid">
                    {profiles.map((p) => (
                        <button
                            key={p.id}
                            className="profile-card"
                            onClick={() => {
                                setCurrentProfileId(p.id)
                                localStorage.setItem('habitGardenCurrentProfileId', p.id)
                                setAppView('dashboard')
                            }}
                        >
                            <div className="profile-avatar">
                                {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-name">{p.name}</div>
                        </button>
                    ))}

                    <button
                        className="profile-card add-profile"
                        onClick={() => {
                            const name = prompt("What's your name?")
                            if (!name) return
                            const id = `p_${Date.now()}`
                            const next = [...profiles, { id, name }]
                            setProfiles(next)
                            localStorage.setItem('habitGardenProfiles', JSON.stringify(next))
                            setCurrentProfileId(id)
                            localStorage.setItem('habitGardenCurrentProfileId', id)
                            setAppView('dashboard')
                        }}
                    >
                        +
                    </button>
                </div>
            </div>
        )
    }

    // If we have a profile but userData not loaded yet, simple loading state
    if (!userData) {
        return (
            <div className="app-container">
                <p className="message">Loading your garden...</p>
            </div>
        )
    }

    // 2) Existing name-collection view (acts as first-time setup per profile)
    if (!userName) {
        return (
            <div className="app-container">
                <h1>Good Habit Garden 🌱</h1>
                <div className="name-input-section">
                    <p className="message">Hi! What is your name?</p>
                    <input type="text" placeholder="Enter your name" value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()} />
                    <button className="start-btn" onClick={handleStart}>Next ➡️</button>
                    <p className="message" style={{ fontSize: '0.9rem', marginTop: '20px', cursor: 'pointer' }} onClick={() => { setProfileTab('parent'); setShowProfile(true); setParentLocked(true); loadParentGateQuestion(); }}>
                        🌱 Parents: Tap here
                    </p>
                </div>
                {/* Re-use Profile Modal for Parent Access from Login? */}
                {showProfile && (
                    <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setShowProfile(false) }}>
                    <div className="modal-content profile-modal">
                        <h3 style={{ color: 'var(--primary)' }}>Parent Zone 🔒</h3>
                        {!parentLocked ? (
                                <div className="parent-dashboard">
                                    <p>Welcome! This app helps your child build consistency.</p>
                                    <button className="close-modal-btn" onClick={() => setShowProfile(false)}>Close</button>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ marginTop: 0 }}>{parentQuestion?.question}</p>
                                    <div className="options-grid">
                                        {(parentQuestion?.options || []).map((opt, idx) => (
                                            <button
                                                key={idx}
                                                className="option-btn"
                                                onClick={() => { setGateAnswer(opt); setGateError(''); }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="start-btn" style={{ marginTop: '10px', fontSize: '1rem' }} onClick={checkParentGate}>Continue</button>
                                    {gateError && <p style={{ color: 'red' }}>{gateError}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // 3) Dashboard view (homepage after profile select, before tasks)
    if (appView === 'dashboard') {
        const profile = profiles.find(p => p.id === currentProfileId)
        const treeName = TREE_TYPES[treeType]?.name || 'tree'
        const days = Array.from({ length: 30 }, (_, i) => i + 1)

        return (
            <div className="app-container dashboard">
                <h1 className="dash-greeting">Hi {profile?.name || userName}!</h1>

                <div className="dash-card">
                    <p className="message">
                        You are growing{" "}
                        {['A', 'E', 'I', 'O', 'U'].includes(treeName.charAt(0).toUpperCase()) ? 'an' : 'a'}{" "}
                        <strong>{treeName.toLowerCase()}</strong>.
                    </p>
                    <p>Day {growthStage || 1} of 30</p>
                </div>

                <div className="day-grid">
                    {days.map((day) => {
                        let state = 'future'
                        if (growthStage && day < growthStage) state = 'done'
                        if (growthStage && day === growthStage) state = 'today'
                        return (
                            <button
                                key={day}
                                className={`day-card ${state}`}
                                onClick={() => {
                                    if (state === 'future') return
                                    if (state === 'done') {
                                        alert('This day is already finished. Great job!')
                                        return
                                    }
                                    setAppView('tasks')
                                }}
                            >
                                <span className="day-number">{day}</span>
                            </button>
                        )
                    })}
                </div>

                <button
                    className="small-btn"
                    onClick={() => {
                        setCurrentProfileId(null)
                        localStorage.removeItem('habitGardenCurrentProfileId')
                    }}
                >
                    Switch profile
                </button>
            </div>
        )
    }

    // Tree selection (runs inside a profile, before dashboard/tasks)
    if (!treeType) {
        return (
            <div className="app-container">
                <h1>Welcome, {userName}! 🌿</h1>
                <p className="message">
                    {userData.history.length > 0 ? RESET_MESSAGES[Math.floor(Math.random() * RESET_MESSAGES.length)] : "Pick the tree you want to grow:"}
                </p>
                <div className="tree-selection-grid">
                    {Object.entries(TREE_TYPES).map(([key, info]) => (
                        <button key={key} className="tree-select-btn" onClick={() => selectTree(key)} style={{ borderColor: info.color }}>
                            <span className="tree-emoji">{info.emoji}</span>
                            <span className="tree-name">{info.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // Fallback: if not explicitly on dashboard, show main tasks view
    return (
        <div className="app-container">
            {/* Header: Profile Icon */}
            <div className="header-row">
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Good Habit Garden 🌱</h1>
                <button className="profile-btn" onClick={() => { setShowProfile(true); setParentLocked(true); loadParentGateQuestion(); }}>👤</button>
            </div>

            {/* Main Game UI */}
            <div className="header-info">
                <span>📅 Day {growthStage} / 30</span>
                <span>🔥 Streak: {consecutiveStreak}</span>
            </div>

            <div className="game-section">
                <h2>{userName}'s {TREE_TYPES[treeType].name} Tree 🌳</h2>
                <p className="message-box">{isDailyDone && dailyQuote ? dailyQuote : "Complete daily tasks to grow!"}</p>

                <div className="plant-stage">
                    <img key={animKey} src={getPlantImage()} alt="Plant Stage" className={`plant-img ${isDailyDone ? 'pulse-anim' : ''}`} />

                    {showFlowers && (
                        <div className="fruit-overlay">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={`fl-${i}`} className="fruit" style={{
                                    top: `${30 + Math.random() * 30}%`, left: `${30 + Math.random() * 40}%`,
                                    animationDelay: `${i * 0.2}s`, fontSize: '1.2rem', opacity: 0.8
                                }}>🌸</span>
                            ))}
                        </div>
                    )}

                    {showFruits && (
                        <div className="fruit-overlay">
                            {Array.from({ length: Math.min(visualFruitCount, 15) }).map((_, i) => {
                                const isBaby = growthStage >= 19 && growthStage <= 25
                                return (
                                    <span key={`fr-${i}`} className="fruit" style={{
                                        top: `${20 + Math.random() * 40}%`, left: `${20 + Math.random() * 60}%`,
                                        fontSize: isBaby ? '1.2rem' : '1.8rem', opacity: isBaby ? 0.8 : 1,
                                        animationDelay: `${i * 0.1}s`
                                    }}>{TREE_TYPES[treeType].emoji}</span>
                                )
                            })}
                        </div>
                    )}

                    {isCelebrated && (
                        <div className="celebration">
                            <h3>{CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]}</h3>
                        </div>
                    )}
                </div>

                <div className="habits-list">
                    {Object.keys(habits).map((habit) => (
                        <label key={habit} className={`habit-item ${habits[habit] ? 'done' : ''}`}>
                            <input type="checkbox" checked={habits[habit]} onChange={() => handleHabitClick(habit)} />
                            <span>{habitIcons[habit]} {habit.charAt(0).toUpperCase() + habit.slice(1)}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* MCQ Modal */}
            {showModal && activeHabit && currentQuestion && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{habitIcons[activeHabit]} Question Time!</h3>
                        <p className="question-text">{currentQuestion.question}</p>
                        <div className="options-grid">{currentQuestion.options.map((option, idx) => <button key={idx} className="option-btn" onClick={() => handleAnswer(option)}>{option}</button>)}</div>
                        {modalMessage && <div className="modal-feedback error">{modalMessage}</div>}
                        <button className="close-modal-btn" onClick={() => setShowModal(false)}>Close / Cancel</button>
                    </div>
                </div>
            )}

            {/* Profile UI */}
            {showProfile && (
                <div className="modal-overlay" style={{ zIndex: 10000 }}>
                    <div className="modal-content profile-modal">
                        <div className="profile-tabs">
                            <button className={`start-btn ${profileTab === 'child' ? '' : 'outline'}`} onClick={() => setProfileTab('child')}>My Garden</button>
                            <button className={`start-btn ${profileTab === 'parent' ? '' : 'outline'}`} onClick={() => setProfileTab('parent')} style={{ background: '#FF9800' }}>Parent Zone</button>
                        </div>

                        {profileTab === 'child' && (
                            <div className="child-profile">
                                <h3>🌱 {userName}'s Growth Journey</h3>
                                <div className="history-list">
                                    {userData.history.length === 0 ? (
                                        <p style={{ color: '#888' }}>No past months yet. Keep growing! 🌟</p>
                                    ) : (
                                        userData.history.map((entry, i) => (
                                            <div key={i} className="history-card" style={{ borderLeftColor: entry.status === 'Completed' ? '#4CAF50' : '#FFC107' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <strong>{entry.monthId}</strong>
                                                    <span>{entry.status === 'Completed' ? '🏆' : '🌱'}</span>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    Tree: {entry.treeType} <br />
                                                    Days Grown: {entry.growthStage} / 30 <br />
                                                    Fruits: {entry.fruitsEarned} 🍎
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button className="close-modal-btn" onClick={() => setShowProfile(false)}>Close</button>
                            </div>
                        )}

                        {profileTab === 'parent' && (
                            <div className="parent-zone">
                                <h3 style={{ color: '#FF9800' }}>Parent Zone 🔒</h3>
                                {!parentLocked ? (
                                    <div className="parent-dashboard" style={{ textAlign: 'left' }}>
                                        <div className="info-card">
                                            <h4>📊 Monthly Summary</h4>
                                            <p>
                                                Your child is growing{" "}
                                                {['A', 'E', 'I', 'O', 'U'].includes((TREE_TYPES[treeType]?.name || '').charAt(0).toUpperCase()) ? 'an' : 'a'}{" "}
                                                <strong>{(TREE_TYPES[treeType]?.name || '').toLowerCase()}</strong> tree.
                                            </p>
                                            <ul style={{ fontSize: '0.9rem' }}>
                                                <li>Days Participated: <strong>{growthStage} / 30</strong></li>
                                                <li>Current Streak: <strong>{consecutiveStreak} days</strong></li>
                                            </ul>
                                            <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Consistency matters more than perfection. Every small step helps habits grow.</p>
                                        </div>

                                        <div className="info-card" style={{ background: '#E3F2FD' }}>
                                            <h4 style={{ color: '#2196F3' }}>🎁 Family Rewards (Optional)</h4>
                                            <p style={{ fontSize: '0.9rem' }}>You can set real-world rewards for fruit milestones:</p>
                                            <textarea placeholder="e.g. 10 Fruits = Movie Night" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}></textarea>
                                        </div>

                                        <button className="close-modal-btn" onClick={() => setShowProfile(false)}>Close Parent Zone</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ marginTop: 0 }}>{parentQuestion?.question}</p>
                                        <div className="options-grid">
                                            {(parentQuestion?.options || []).map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    className="option-btn"
                                                    onClick={() => { setGateAnswer(opt); setGateError(''); }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        <button className="start-btn" style={{ marginTop: '10px', fontSize: '1rem', background: '#FF9800' }} onClick={checkParentGate}>Continue</button>
                                        {gateError && <p style={{ color: 'red' }}>{gateError}</p>}
                                        <button className="close-modal-btn" onClick={() => setShowProfile(false)}>Cancel</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


export default App
