const translations = {
  cn: {
    // App title
    appTitle: 'CET-4 词汇卡片',
    appSubtitle: '30天掌握1500个核心词汇',

    // Navigation
    definition: '释义',
    markGreen: '认识',
    markRed: '不认识',
    resetMark: '重置',
    clearAll: '全部清除',

    // Day slider
    dayLabel: '第 {day} 天 / 共30天',
    dayShort: '第{day}天',

    // Groups
    groupLabel: '第 {n} 组',

    // Control panel
    shuffleAll: '全部打乱',
    shuffleWithin: '组内打乱',
    sortByColor: '按颜色排序',
    resetGroup: '重置本组',
    resetAll: '重置全部',

    // Flashcard modal
    partOfSpeech: '词性',
    chineseTranslation: '中文释义',
    pronunciation: '发音',
    exampleSentence: '例句',
    synonyms: '同义词',
    playNormal: '▶ 正常速度',
    playSlow: '▶ 慢速 (0.7x)',
    playSentence: '播放例句',
    sentenceNormal: '▶ 正常',
    speed: '速度',
    previousWord: '上一个',
    nextWord: '下一个',
    close: '关闭',

    // Stats
    statistics: '学习统计',
    totalWords: '总词数',
    knownWords: '已认识',
    unknownWords: '不认识',
    completion: '完成度',
    studyStreak: '连续学习',
    days: '天',
    hardestWords: '最难单词',
    timesMarkedRed: '次标红',
    progressChart: '学习进度',

    // Auth
    login: '登录',
    signup: '注册',
    logout: '退出',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    createAccount: '创建账号',
    haveAccount: '已有账号？登录',
    noAccount: '没有账号？注册',
    loginError: '登录失败',
    signupError: '注册失败',

    // Search
    searchPlaceholder: '搜索单词...',
    noResults: '未找到结果',

    // Instructions
    instructionsTitle: '使用说明',
    instruction1: '每天学习一个新组（50个单词）',
    instruction2: '复习之前所有的组（累积学习）',
    instruction3: '第1天：学习第1组',
    instruction4: '第2天：复习第1组 + 学习第2组',
    instruction5: '第3天：复习第1、2组 + 学习第3组',
    instruction6: '坚持30天完成全部1500个单词',
    instructionGreen: '🟢 绿色 = 我认识这个词',
    instructionRed: '🔴 红色 = 我不认识这个词',
    keyboardTitle: '快捷键',
    keyArrows: '↑↓←→ = 在卡片间导航',
    keyD: 'D = 查看释义',
    keyG: 'G = 标为认识（绿色）',
    keyR: 'R = 标为不认识（红色）',
    keyW: 'W = 重置单个标记',
    keyS: 'S = 朗读单词',
    keyC: 'C = 清除所有标记',
    keyEsc: 'ESC = 关闭弹窗',
    gotIt: '我知道了',

    // Extra Words tab
    cetTab: 'CET-4 词汇',
    extraWordsTab: '扩展词典',
    extraWordsSubtitle: '来自例句和同义词的扩展词汇',
    extraBadge: '扩展',
    letterGroup: '{letter} 开头',
    extraWordsCount: '{count} 个扩展词汇',

    // General
    syncStatus: '已同步',
    offline: '离线',
    syncing: '同步中...',
    print: '打印不认识的词',
    exportRedWords: '导出不认识的词',
    exportSuccess: '已复制到剪贴板！',
    noRedWords: '没有标红的单词',
    language: '语言',
    settings: '设置',

    // Confirm dialogs
    confirmResetAll: '确定要重置所有学习进度吗？此操作不可撤销。',
    confirmResetGroup: '确定要重置第 {n} 组的标记吗？',
    confirmClearAll: '确定要清除所有颜色标记吗？',
    confirm: '确定',
    cancel: '取消',
  },

  en: {
    appTitle: 'CET-4 Vocabulary Cards',
    appSubtitle: 'Master 1,500 core words in 30 days',

    definition: 'Definition',
    markGreen: 'Known',
    markRed: 'Unknown',
    resetMark: 'Reset',
    clearAll: 'Clear All',

    dayLabel: 'Day {day} of 30',
    dayShort: 'Day {day}',

    groupLabel: 'Group {n}',

    shuffleAll: 'Shuffle All',
    shuffleWithin: 'Shuffle Groups',
    sortByColor: 'Sort by Color',
    resetGroup: 'Reset Group',
    resetAll: 'Reset All',

    partOfSpeech: 'Part of Speech',
    chineseTranslation: 'Chinese',
    pronunciation: 'Pronunciation',
    exampleSentence: 'Example',
    synonyms: 'Synonyms',
    playNormal: '▶ Normal Speed',
    playSlow: '▶ Slow (0.7x)',
    playSentence: 'Play sentence',
    sentenceNormal: '▶ Normal',
    speed: 'speed',
    previousWord: 'Previous',
    nextWord: 'Next',
    close: 'Close',

    statistics: 'Study Statistics',
    totalWords: 'Total Words',
    knownWords: 'Known',
    unknownWords: 'Unknown',
    completion: 'Completion',
    studyStreak: 'Study Streak',
    days: 'days',
    hardestWords: 'Hardest Words',
    timesMarkedRed: 'times marked red',
    progressChart: 'Progress',

    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    haveAccount: 'Have an account? Login',
    noAccount: "Don't have an account? Sign Up",
    loginError: 'Login failed',
    signupError: 'Signup failed',

    searchPlaceholder: 'Search words...',
    noResults: 'No results found',

    instructionsTitle: 'How to Use',
    instruction1: 'Study one new group (50 words) each day',
    instruction2: 'Review ALL previous groups cumulatively',
    instruction3: 'Day 1: Study Group 1',
    instruction4: 'Day 2: Review Group 1 + Study Group 2',
    instruction5: 'Day 3: Review Groups 1-2 + Study Group 3',
    instruction6: 'Complete all 1,500 words in 30 days',
    instructionGreen: '🟢 Green = I know this word',
    instructionRed: '🔴 Red = I don\'t know this word',
    keyboardTitle: 'Keyboard Shortcuts',
    keyArrows: '↑↓←→ = Navigate cards',
    keyD: 'D = View definition',
    keyG: 'G = Mark as known (green)',
    keyR: 'R = Mark as unknown (red)',
    keyW: 'W = Reset card marking',
    keyS: 'S = Speak word aloud',
    keyC: 'C = Clear all markings',
    keyEsc: 'ESC = Close popup',
    gotIt: 'Got it!',

    cetTab: 'CET-4 Vocabulary',
    extraWordsTab: 'Extra Dictionary',
    extraWordsSubtitle: 'Extended vocabulary from sentences & synonyms',
    extraBadge: 'Extra',
    letterGroup: 'Starting with {letter}',
    extraWordsCount: '{count} extra words',

    syncStatus: 'Synced',
    offline: 'Offline',
    syncing: 'Syncing...',
    print: 'Print Unknown Words',
    exportRedWords: 'Export Unknown Words',
    exportSuccess: 'Copied to clipboard!',
    noRedWords: 'No red-marked words yet',
    language: 'Language',
    settings: 'Settings',

    confirmResetAll: 'Are you sure you want to reset all progress? This cannot be undone.',
    confirmResetGroup: 'Are you sure you want to reset Group {n} markings?',
    confirmClearAll: 'Are you sure you want to clear all color markings?',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
} as const;

export type TranslationKey = keyof typeof translations.cn;
export type Translations = typeof translations;

export function t(key: TranslationKey, lang: 'cn' | 'en', params?: Record<string, string | number>): string {
  let text = translations[lang][key] as string;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export default translations;
