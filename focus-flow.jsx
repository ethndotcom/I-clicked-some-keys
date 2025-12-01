import React, { useState, useEffect, useRef } from 'react';

// Sample data
const initialTasks = [
  {
    id: 1,
    title: 'Finish RetailCo Presentation',
    priority: 'high',
    color: '#FF6B6B',
    estimatedMinutes: 45,
    calendarDate: '2025-12-01',
    steps: [
      { id: 1, text: 'Review MWBE data', completed: true },
      { id: 2, text: 'Create executive summary slide', completed: true },
      { id: 3, text: 'Add financial projections', completed: false },
      { id: 4, text: 'Final polish and export', completed: false },
    ],
    completedAt: null,
    timeSpent: 0,
  },
  {
    id: 2,
    title: 'ML Assignment - Decision Trees',
    priority: 'medium',
    color: '#FFB347',
    estimatedMinutes: 60,
    calendarDate: '2025-12-02',
    steps: [
      { id: 1, text: 'Load and preprocess dataset', completed: true },
      { id: 2, text: 'Implement tree algorithm', completed: false },
      { id: 3, text: 'Evaluate model performance', completed: false },
    ],
    completedAt: null,
    timeSpent: 0,
  },
  {
    id: 3,
    title: 'Update Portfolio Website',
    priority: 'low',
    color: '#7EC8A3',
    estimatedMinutes: 30,
    calendarDate: '2025-12-03',
    steps: [
      { id: 1, text: 'Add new certifications', completed: false },
      { id: 2, text: 'Update project screenshots', completed: false },
    ],
    completedAt: null,
    timeSpent: 0,
  },
];

const priorityConfig = {
  high: { label: 'High', color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.15)' },
  medium: { label: 'Medium', color: '#FFB347', bg: 'rgba(255, 179, 71, 0.15)' },
  low: { label: 'Low', color: '#7EC8A3', bg: 'rgba(126, 200, 163, 0.15)' },
};

const colorOptions = ['#FF6B6B', '#FFB347', '#7EC8A3', '#6B9FFF', '#C78FFF', '#FF8FCF', '#8FD4E8', '#FFE066'];

// Icon components
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const TimerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Format time helper
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Weekly report data generator
const generateWeeklyData = (tasks) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    completed: Math.floor(Math.random() * 5) + 1,
    minutes: Math.floor(Math.random() * 120) + 30,
  }));
};

export default function FocusFlow() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeView, setActiveView] = useState('tasks');
  const [activeTask, setActiveTask] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    color: '#FFB347',
    estimatedMinutes: 25,
    calendarDate: new Date().toISOString().split('T')[0],
    steps: [],
  });
  const [newStepText, setNewStepText] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [weeklyData] = useState(generateWeeklyData(tasks));
  
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (timerRunning && activeTask) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, activeTask]);

  const allStepsCompleted = (task) => {
    return task.steps.length > 0 && task.steps.every(s => s.completed);
  };

  const toggleStep = (taskId, stepId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          steps: task.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          ),
        };
      }
      return task;
    }));
  };

  const startTimer = (task) => {
    setActiveTask(task);
    setTimerSeconds(task.timeSpent || 0);
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    if (activeTask) {
      setTasks(tasks.map(t =>
        t.id === activeTask.id ? { ...t, timeSpent: timerSeconds } : t
      ));
    }
  };

  const completeTask = () => {
    if (activeTask && allStepsCompleted(activeTask)) {
      const completed = {
        ...activeTask,
        timeSpent: timerSeconds,
        completedAt: new Date().toISOString(),
      };
      setCompletedTasks([...completedTasks, completed]);
      setTasks(tasks.filter(t => t.id !== activeTask.id));
      setActiveTask(null);
      setTimerRunning(false);
      setTimerSeconds(0);
    }
  };

  const addNewTask = () => {
    if (newTask.title.trim() && newTask.steps.length > 0) {
      const task = {
        ...newTask,
        id: Date.now(),
        steps: newTask.steps.map((s, i) => ({ ...s, id: i + 1 })),
        completedAt: null,
        timeSpent: 0,
      };
      setTasks([...tasks, task]);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        priority: 'medium',
        color: '#FFB347',
        estimatedMinutes: 25,
        calendarDate: new Date().toISOString().split('T')[0],
        steps: [],
      });
    }
  };

  const addStepToNewTask = () => {
    if (newStepText.trim()) {
      setNewTask({
        ...newTask,
        steps: [...newTask.steps, { text: newStepText.trim(), completed: false }],
      });
      setNewStepText('');
    }
  };

  const removeStepFromNewTask = (index) => {
    setNewTask({
      ...newTask,
      steps: newTask.steps.filter((_, i) => i !== index),
    });
  };

  const currentTask = activeTask ? tasks.find(t => t.id === activeTask.id) || activeTask : null;
  const progress = currentTask ? (currentTask.steps.filter(s => s.completed).length / currentTask.steps.length) * 100 : 0;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <div style={styles.logoRing} />
          </div>
          <span style={styles.logoText}>Focus Flow</span>
        </div>

        <nav style={styles.nav}>
          {[
            { id: 'tasks', icon: <ListIcon />, label: 'Tasks' },
            { id: 'calendar', icon: <CalendarIcon />, label: 'Calendar' },
            { id: 'reports', icon: <ChartIcon />, label: 'Reports' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                ...styles.navItem,
                ...(activeView === item.id ? styles.navItemActive : {}),
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarStats}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{tasks.length}</span>
            <span style={styles.statLabel}>Active</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{completedTasks.length}</span>
            <span style={styles.statLabel}>Done</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Timer Bar - Always visible when task is active */}
        {currentTask && (
          <div style={styles.timerBar}>
            <div style={styles.timerInfo}>
              <div style={{
                ...styles.timerDot,
                backgroundColor: currentTask.color,
                boxShadow: timerRunning ? `0 0 12px ${currentTask.color}` : 'none',
              }} />
              <span style={styles.timerTaskName}>{currentTask.title}</span>
            </div>
            
            <div style={styles.timerCenter}>
              <div style={styles.timerDisplay}>
                <TimerIcon />
                <span style={styles.timerTime}>{formatTime(timerSeconds)}</span>
              </div>
              <div style={styles.timerProgress}>
                <div style={{ ...styles.timerProgressFill, width: `${progress}%`, backgroundColor: currentTask.color }} />
              </div>
            </div>

            <div style={styles.timerControls}>
              {timerRunning ? (
                <button onClick={pauseTimer} style={styles.timerBtn}>
                  <PauseIcon />
                </button>
              ) : (
                <button onClick={() => setTimerRunning(true)} style={styles.timerBtn}>
                  <PlayIcon />
                </button>
              )}
              <button
                onClick={completeTask}
                disabled={!allStepsCompleted(currentTask)}
                style={{
                  ...styles.completeBtn,
                  opacity: allStepsCompleted(currentTask) ? 1 : 0.4,
                  cursor: allStepsCompleted(currentTask) ? 'pointer' : 'not-allowed',
                }}
                title={!allStepsCompleted(currentTask) ? 'Complete all steps first' : 'Mark complete'}
              >
                {!allStepsCompleted(currentTask) && <LockIcon />}
                Complete
              </button>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeView === 'tasks' && (
          <div style={styles.content}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>Your Tasks</h1>
                <p style={styles.subtitle}>Focus on what matters most</p>
              </div>
              <button onClick={() => setShowNewTaskModal(true)} style={styles.addBtn}>
                <PlusIcon />
                <span>New Task</span>
              </button>
            </div>

            <div style={styles.taskGrid}>
              {/* Active Task Detail */}
              {currentTask && (
                <div style={{ ...styles.activeTaskCard, borderColor: currentTask.color }}>
                  <div style={styles.activeTaskHeader}>
                    <span style={styles.activeLabel}>Currently Focusing</span>
                    <button onClick={() => { pauseTimer(); setActiveTask(null); }} style={styles.minimizeBtn}>
                      <CloseIcon />
                    </button>
                  </div>
                  <h3 style={styles.activeTaskTitle}>{currentTask.title}</h3>
                  
                  <div style={styles.stepsContainer}>
                    <h4 style={styles.stepsTitle}>Steps to Complete</h4>
                    {currentTask.steps.map(step => (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(currentTask.id, step.id)}
                        style={{
                          ...styles.stepItem,
                          opacity: step.completed ? 0.6 : 1,
                        }}
                      >
                        <div style={{
                          ...styles.stepCheckbox,
                          backgroundColor: step.completed ? currentTask.color : 'transparent',
                          borderColor: step.completed ? currentTask.color : 'rgba(255,255,255,0.3)',
                        }}>
                          {step.completed && <CheckIcon />}
                        </div>
                        <span style={{
                          ...styles.stepText,
                          textDecoration: step.completed ? 'line-through' : 'none',
                        }}>{step.text}</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.stepProgress}>
                    <span>{currentTask.steps.filter(s => s.completed).length} of {currentTask.steps.length} steps</span>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${progress}%`, backgroundColor: currentTask.color }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Task List */}
              <div style={styles.taskList}>
                {['high', 'medium', 'low'].map(priority => {
                  const priorityTasks = tasks.filter(t => t.priority === priority);
                  if (priorityTasks.length === 0) return null;
                  
                  return (
                    <div key={priority} style={styles.priorityGroup}>
                      <div style={styles.priorityHeader}>
                        <div style={{ ...styles.priorityDot, backgroundColor: priorityConfig[priority].color }} />
                        <span style={styles.priorityLabel}>{priorityConfig[priority].label} Priority</span>
                        <span style={styles.priorityCount}>{priorityTasks.length}</span>
                      </div>
                      
                      {priorityTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            ...styles.taskCard,
                            borderLeftColor: task.color,
                            backgroundColor: currentTask?.id === task.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <div style={styles.taskInfo}>
                            <h4 style={styles.taskTitle}>{task.title}</h4>
                            <div style={styles.taskMeta}>
                              <span style={styles.taskMetaItem}>
                                <TimerIcon /> {task.estimatedMinutes}m
                              </span>
                              <span style={styles.taskMetaItem}>
                                {task.steps.filter(s => s.completed).length}/{task.steps.length} steps
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => startTimer(task)}
                            style={{
                              ...styles.startBtn,
                              backgroundColor: task.color,
                            }}
                          >
                            {currentTask?.id === task.id ? <PauseIcon /> : <PlayIcon />}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div style={styles.content}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>Calendar</h1>
                <p style={styles.subtitle}>December 2025</p>
              </div>
            </div>

            <div style={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={styles.calendarHeader}>{day}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 1; // December starts on Monday (index 1)
                const isValidDay = day >= 0 && day < 31;
                const dayNum = day + 1;
                const dateStr = `2025-12-${dayNum.toString().padStart(2, '0')}`;
                const dayTasks = tasks.filter(t => t.calendarDate === dateStr);
                const isToday = dayNum === 1;
                
                return (
                  <div key={i} style={{
                    ...styles.calendarDay,
                    opacity: isValidDay ? 1 : 0.3,
                    backgroundColor: isToday ? 'rgba(107, 159, 255, 0.15)' : 'transparent',
                    border: isToday ? '1px solid rgba(107, 159, 255, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {isValidDay && (
                      <>
                        <span style={{ ...styles.calendarDayNum, color: isToday ? '#6B9FFF' : 'inherit' }}>
                          {dayNum}
                        </span>
                        <div style={styles.calendarTasks}>
                          {dayTasks.slice(0, 2).map(task => (
                            <div key={task.id} style={{
                              ...styles.calendarTask,
                              backgroundColor: task.color,
                            }}>
                              {task.title.slice(0, 12)}{task.title.length > 12 ? '...' : ''}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <span style={styles.calendarMore}>+{dayTasks.length - 2} more</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div style={styles.content}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>Weekly Report</h1>
                <p style={styles.subtitle}>Your productivity insights</p>
              </div>
            </div>

            <div style={styles.reportGrid}>
              <div style={styles.reportCard}>
                <h3 style={styles.reportCardTitle}>Tasks Completed</h3>
                <div style={styles.barChart}>
                  {weeklyData.map((d, i) => (
                    <div key={i} style={styles.barGroup}>
                      <div style={styles.barContainer}>
                        <div style={{
                          ...styles.bar,
                          height: `${(d.completed / 5) * 100}%`,
                          backgroundColor: '#6B9FFF',
                        }} />
                      </div>
                      <span style={styles.barLabel}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.reportCard}>
                <h3 style={styles.reportCardTitle}>Focus Time (minutes)</h3>
                <div style={styles.barChart}>
                  {weeklyData.map((d, i) => (
                    <div key={i} style={styles.barGroup}>
                      <div style={styles.barContainer}>
                        <div style={{
                          ...styles.bar,
                          height: `${(d.minutes / 150) * 100}%`,
                          backgroundColor: '#7EC8A3',
                        }} />
                      </div>
                      <span style={styles.barLabel}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <span style={styles.statCardValue}>{weeklyData.reduce((a, b) => a + b.completed, 0)}</span>
                  <span style={styles.statCardLabel}>Tasks This Week</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statCardValue}>{Math.round(weeklyData.reduce((a, b) => a + b.minutes, 0) / 60)}h</span>
                  <span style={styles.statCardLabel}>Total Focus Time</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statCardValue}>{Math.round(weeklyData.reduce((a, b) => a + b.minutes, 0) / 7)}m</span>
                  <span style={styles.statCardLabel}>Daily Average</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statCardValue}>{completedTasks.length}</span>
                  <span style={styles.statCardLabel}>Completed All-Time</span>
                </div>
              </div>

              {completedTasks.length > 0 && (
                <div style={styles.completedSection}>
                  <h3 style={styles.completedTitle}>Recently Completed</h3>
                  {completedTasks.slice(-5).reverse().map(task => (
                    <div key={task.id} style={styles.completedItem}>
                      <div style={{ ...styles.completedDot, backgroundColor: task.color }} />
                      <span style={styles.completedName}>{task.title}</span>
                      <span style={styles.completedTime}>{formatTime(task.timeSpent)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div style={styles.modalOverlay} onClick={() => setShowNewTaskModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Task</h2>
              <button onClick={() => setShowNewTaskModal(false)} style={styles.modalClose}>
                <CloseIcon />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Name</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What do you need to focus on?"
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <div style={styles.prioritySelect}>
                    {Object.entries(priorityConfig).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setNewTask({ ...newTask, priority: key, color: val.color })}
                        style={{
                          ...styles.priorityOption,
                          backgroundColor: newTask.priority === key ? val.bg : 'transparent',
                          borderColor: newTask.priority === key ? val.color : 'rgba(255,255,255,0.1)',
                          color: newTask.priority === key ? val.color : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Est. Time (min)</label>
                  <input
                    type="number"
                    value={newTask.estimatedMinutes}
                    onChange={e => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date</label>
                  <input
                    type="date"
                    value={newTask.calendarDate}
                    onChange={e => setNewTask({ ...newTask, calendarDate: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Color</label>
                  <div style={styles.colorPicker}>
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewTask({ ...newTask, color })}
                        style={{
                          ...styles.colorOption,
                          backgroundColor: color,
                          transform: newTask.color === color ? 'scale(1.2)' : 'scale(1)',
                          boxShadow: newTask.color === color ? `0 0 0 2px #1a1a2e, 0 0 0 4px ${color}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Steps (required)</label>
                <div style={styles.stepsInput}>
                  <input
                    type="text"
                    value={newStepText}
                    onChange={e => setNewStepText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addStepToNewTask()}
                    placeholder="Add a step and press Enter"
                    style={styles.input}
                  />
                  <button onClick={addStepToNewTask} style={styles.addStepBtn}>
                    <PlusIcon />
                  </button>
                </div>
                <div style={styles.stepsList}>
                  {newTask.steps.map((step, i) => (
                    <div key={i} style={styles.newStepItem}>
                      <span style={styles.stepNumber}>{i + 1}</span>
                      <span style={styles.newStepText}>{step.text}</span>
                      <button onClick={() => removeStepFromNewTask(i)} style={styles.removeStepBtn}>
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowNewTaskModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button
                onClick={addNewTask}
                disabled={!newTask.title.trim() || newTask.steps.length === 0}
                style={{
                  ...styles.createBtn,
                  opacity: newTask.title.trim() && newTask.steps.length > 0 ? 1 : 0.5,
                }}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0d0d14',
    color: '#ffffff',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  // Sidebar
  sidebar: {
    width: '240px',
    backgroundColor: '#12121c',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px',
    padding: '0 8px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6B9FFF 0%, #C78FFF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    width: '16px',
    height: '16px',
    border: '3px solid white',
    borderRadius: '50%',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  navItemActive: {
    backgroundColor: 'rgba(107, 159, 255, 0.12)',
    color: '#6B9FFF',
  },
  sidebarStats: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Main
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Timer Bar
  timerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    backgroundColor: '#16161f',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  timerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  timerDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'box-shadow 0.3s ease',
  },
  timerTaskName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  timerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 2,
  },
  timerDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.6)',
  },
  timerTime: {
    fontSize: '28px',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '1px',
  },
  timerProgress: {
    width: '200px',
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  timerProgressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  timerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    justifyContent: 'flex-end',
  },
  timerBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  completeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#7EC8A3',
    border: 'none',
    borderRadius: '10px',
    color: '#0d0d14',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },

  // Content
  content: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    margin: '4px 0 0 0',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#6B9FFF',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Task Grid
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },

  // Active Task Card
  activeTaskCard: {
    backgroundColor: '#16161f',
    borderRadius: '16px',
    padding: '24px',
    borderLeft: '4px solid',
  },
  activeTaskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  activeLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  minimizeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTaskTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 24px 0',
  },
  stepsContainer: {
    marginBottom: '20px',
  },
  stepsTitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 12px 0',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  stepCheckbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#ffffff',
  },
  stepText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    transition: 'all 0.2s ease',
  },
  stepProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },

  // Task List
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  priorityGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  priorityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  priorityLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  priorityCount: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    marginLeft: 'auto',
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '12px',
    borderLeft: '3px solid',
    transition: 'all 0.2s ease',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 6px 0',
  },
  taskMeta: {
    display: 'flex',
    gap: '16px',
  },
  taskMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  startBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    color: '#0d0d14',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },

  // Calendar
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
  },
  calendarHeader: {
    padding: '12px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  calendarDay: {
    minHeight: '100px',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  calendarDayNum: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  calendarTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  calendarTask: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '500',
    color: '#0d0d14',
  },
  calendarMore: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
  },

  // Reports
  reportGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  reportCard: {
    backgroundColor: '#16161f',
    borderRadius: '16px',
    padding: '24px',
  },
  reportCardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 20px 0',
  },
  barChart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '120px',
    gap: '8px',
  },
  barGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    height: '100%',
  },
  barContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease',
  },
  barLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#16161f',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statCardValue: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6B9FFF 0%, #C78FFF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statCardLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  completedSection: {
    backgroundColor: '#16161f',
    borderRadius: '16px',
    padding: '24px',
  },
  completedTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 16px 0',
  },
  completedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  completedDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  completedName: {
    flex: 1,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  completedTime: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    fontVariantNumeric: 'tabular-nums',
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '500px',
    maxHeight: '90vh',
    backgroundColor: '#1a1a28',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  modalClose: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  prioritySelect: {
    display: 'flex',
    gap: '8px',
  },
  priorityOption: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  colorPicker: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  stepsInput: {
    display: 'flex',
    gap: '8px',
  },
  addStepBtn: {
    width: '48px',
    backgroundColor: 'rgba(107, 159, 255, 0.2)',
    border: 'none',
    borderRadius: '10px',
    color: '#6B9FFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  newStepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  newStepText: {
    flex: 1,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  removeStepBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  createBtn: {
    padding: '12px 24px',
    backgroundColor: '#6B9FFF',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
