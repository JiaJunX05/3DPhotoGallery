// ========== 全局变量 ==========
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationX = 0;
let rotationY = 0;
let react = null;
let musicStarted = false;
let effectsStarted = false;
let danmakuInterval = null;
let userName = '';

// ========== 3D相册旋转控制 ==========

/**
 * 初始化鼠标拖拽控制旋转功能
 */
function initDragControl() {
    react = document.getElementById('react');
    if (!react) {
        console.error('未找到相册容器 #react');
        return;
    }

    // 初始状态：允许旋转，但不展开（没有.playing类）
    react.style.animation = 'rotate 20s infinite linear';

    // 鼠标按下事件
    react.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
        react.style.animation = 'none';
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;

        react.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            react.style.animation = 'rotate 20s infinite linear';
        }
    });
}

// ========== 背景特效 ==========

/**
 * 创建滑落爱心效果（类似代码雨）
 */
function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    
    // 随机选择爱心表情
    const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️', '🧡', '💛'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // 随机位置和动画参数
    heart.style.left = Math.random() * 100 + '%';
    const duration = 3 + Math.random() * 5; // 随机下落速度（3-8秒）
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    const rainContainer = document.getElementById('rainContainer');
    rainContainer.appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, (duration + 2) * 1000);
}

/**
 * 创建Lulu猪漂浮表情
 */
function createLuluFloat() {
    const lulu = document.createElement('div');
    lulu.className = 'lulu-float';
    
    // 随机选择Lulu猪表情
    const luluEmojis = ['🐷', '🐽', '🐾', '💕', '😊', '🥰', '😍', '😘'];
    lulu.textContent = luluEmojis[Math.floor(Math.random() * luluEmojis.length)];
    
    // 随机初始位置和动画参数
    lulu.style.left = Math.random() * 100 + '%';
    lulu.style.top = Math.random() * 100 + '%';
    const duration = 10 + Math.random() * 10; // 随机动画时长（10-20秒）
    lulu.style.animationDuration = duration + 's';
    lulu.style.animationDelay = Math.random() * 5 + 's';
    
    const luluContainer = document.getElementById('luluContainer');
    luluContainer.appendChild(lulu);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (lulu.parentNode) {
            lulu.parentNode.removeChild(lulu);
        }
    }, (duration + 5) * 1000);
}

/**
 * 初始化背景特效
 */
function initBackgroundEffects() {
    // 持续创建滑落爱心（每300ms创建一个）
    setInterval(() => {
        createFallingHeart();
    }, 300);
    
    // 创建初始的Lulu猪表情（5个，间隔2秒）
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createLuluFloat();
        }, i * 2000);
    }
    
    // 定期创建新的Lulu猪表情（每8秒一个）
    setInterval(() => {
        createLuluFloat();
    }, 8000);
}

/**
 * 隐藏输入框容器和遮罩层，启动特效
 */
function hidePlayButton() {
    const nameInputContainer = document.getElementById('nameInputContainer');
    const overlay = document.getElementById('overlay');
    
    if (nameInputContainer) {
        nameInputContainer.style.display = 'none';
    }
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    // 启动背景特效和相框呼吸动画
    if (!effectsStarted) {
        effectsStarted = true;
        initBackgroundEffects();
        
        // 添加playing类，启用相框呼吸展开和收缩动画
        const react = document.getElementById('react');
        if (react) {
            react.classList.add('playing');
        }
    }
}

// ========== 音乐播放 ==========

/**
 * 尝试播放音乐
 */
function tryPlayMusic() {
    const birthdayMusic = document.getElementById('birthdayMusic');
    if (!birthdayMusic || musicStarted) return;
    
    // 设置音量和循环
    birthdayMusic.volume = 0.5;
    birthdayMusic.loop = true;
    
    // 尝试播放
    const playPromise = birthdayMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                musicStarted = true;
                console.log('🎵 生日歌自动播放成功！循环播放已启用');
                hidePlayButton();
            })
            .catch(() => {
                // 自动播放被阻止，继续尝试
            });
    }
}

/**
 * 初始化生日歌音频
 */
function initBirthdayMusic() {
    const birthdayMusic = document.getElementById('birthdayMusic');
    if (!birthdayMusic) return;
    
    // 设置音量和循环（但不自动播放）
    birthdayMusic.volume = 0.5;
    birthdayMusic.loop = true;
    
    // 预加载音频，但不播放
    birthdayMusic.load();
}

// ========== 弹幕祝福功能 ==========

// 祝福语模板库
const birthdayWishes = [
    "🎂 {name}，生日快乐！愿你天天开心！",
    "🎉 {name}，祝你生日快乐，身体健康！",
    "🎈 {name}，生日快乐！愿你梦想成真！",
    "🎁 {name}，祝你生日快乐，万事如意！",
    "🎊 {name}，生日快乐！愿你永远年轻！",
    "💕 {name}，祝你生日快乐，幸福美满！",
    "🎀 {name}，生日快乐！愿你心想事成！",
    "🎪 {name}，祝你生日快乐，天天快乐！",
    "🎭 {name}，生日快乐！愿你笑口常开！",
    "🎨 {name}，祝你生日快乐，前程似锦！",
    "🎯 {name}，生日快乐！愿你一切顺利！",
    "🎲 {name}，祝你生日快乐，好运连连！",
    "🎸 {name}，生日快乐！愿你音乐常伴！",
    "🎺 {name}，祝你生日快乐，快乐每一天！",
    "🎻 {name}，生日快乐！愿你生活美满！",
    "🎤 {name}，祝你生日快乐，歌声嘹亮！",
    "🎧 {name}，生日快乐！愿你心情愉悦！",
    "🎬 {name}，祝你生日快乐，精彩人生！",
    "🎪 {name}，生日快乐！愿你充满活力！",
    "🎨 {name}，祝你生日快乐，创意无限！"
];

/**
 * 创建弹幕
 * @param {string} text - 弹幕文本
 */
function createDanmaku(text) {
    const danmakuContainer = document.getElementById('danmakuContainer');
    if (!danmakuContainer) return;

    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku-item';
    danmaku.textContent = text;
    
    // 随机垂直位置（避免重叠）
    const top = Math.random() * (window.innerHeight - 100) + 50;
    danmaku.style.top = top + 'px';
    
    // 随机字体大小
    const fontSize = 1.5 + Math.random() * 0.8;
    danmaku.style.fontSize = fontSize + 'rem';
    
    // 随机颜色（粉色系）
    const colors = [
        '#ff6b9d', '#ff99cc', '#ffb3d9', '#ffcce5', 
        '#ff80b3', '#ff66cc', '#ff99dd', '#ffb3e6'
    ];
    danmaku.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    danmakuContainer.appendChild(danmaku);
    
    // 动画结束后移除
    setTimeout(() => {
        if (danmaku.parentNode) {
            danmaku.parentNode.removeChild(danmaku);
        }
    }, 15000);
}

/**
 * 开始弹幕祝福
 * @param {string} name - 寿星名字
 */
function startDanmaku(name) {
    userName = name || '寿星';
    
    // 清除之前的弹幕
    if (danmakuInterval) {
        clearInterval(danmakuInterval);
    }
    
    // 立即创建几条弹幕
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wish = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)];
            createDanmaku(wish.replace('{name}', userName));
        }, i * 500);
    }
    
    // 持续创建弹幕（每2秒一条）
    danmakuInterval = setInterval(() => {
        const wish = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)];
        createDanmaku(wish.replace('{name}', userName));
    }, 2000);
}

/**
 * 停止弹幕
 */
function stopDanmaku() {
    if (danmakuInterval) {
        clearInterval(danmakuInterval);
        danmakuInterval = null;
    }
}

// ========== 输入框和交互 ==========

/**
 * 初始化输入框和弹幕功能
 */
function initNameInputAndDanmaku() {
    const nameInput = document.getElementById('nameInput');
    const playBtn = document.getElementById('playMusicBtn');
    
    if (!nameInput || !playBtn) return;
    
    // 确保输入框始终保持焦点
    let keepFocus = true;
    
    // 页面加载后立即聚焦
    setTimeout(() => {
        nameInput.focus();
    }, 100);
    
    // 当输入框失去焦点时，自动重新聚焦（直到点击按钮）
    nameInput.addEventListener('blur', () => {
        if (keepFocus) {
            setTimeout(() => {
                nameInput.focus();
            }, 10);
        }
    });
    
    // 输入框回车键触发
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            playBtn.click();
        }
    });
    
    // 按钮点击事件 - 这是唯一触发音乐播放的地方
    playBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        
        if (name) {
            // 停止保持焦点
            keepFocus = false;
            
            // 开始弹幕祝福
            startDanmaku(name);
            
            // 播放音乐
            const birthdayMusic = document.getElementById('birthdayMusic');
            if (birthdayMusic && !musicStarted) {
                birthdayMusic.loop = true;
                tryPlayMusic();
            }
        } else {
            // 如果没有输入名字，提示用户并重新聚焦
            nameInput.placeholder = '请输入名字再开始祝福哦~';
            nameInput.style.borderColor = '#ff6b9d';
            nameInput.focus();
            setTimeout(() => {
                nameInput.placeholder = '请输入寿星的名字...';
                nameInput.style.borderColor = '#fff';
            }, 2000);
        }
    });
}

// ========== 初始化 ==========

/**
 * 页面初始化
 */
function init() {
    initBirthdayMusic();
    initDragControl();
    initNameInputAndDanmaku();
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
