// ===== REAL-TIME CLOCK =====
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Format as HH:MM (24h)
    const timeStr = `${hours}:${minutes.toString().padStart(2, '0')}`;
    const statusTime = document.getElementById('statusTime');
    if (statusTime) {
        statusTime.textContent = timeStr;
    }
    // Also update StrongBond status bar time
    const sbStatusTime = document.getElementById('sbStatusTime');
    if (sbStatusTime) {
        sbStatusTime.textContent = timeStr;
    }
}

// ===== CALENDAR WIDGET =====
function updateCalendar() {
    const now = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dayEl = document.getElementById('calDay');
    const dateEl = document.getElementById('calDate');
    const widgetDay = document.getElementById('widgetDay');
    const widgetDateNum = document.getElementById('widgetDateNum');

    if (dayEl) dayEl.textContent = days[now.getDay()];
    if (dateEl) dateEl.textContent = now.getDate();
    if (widgetDay) widgetDay.textContent = fullDays[now.getDay()];
    if (widgetDateNum) {
        widgetDateNum.textContent = months[now.getMonth()] + ' ' + now.getDate();
    }
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const frame = document.getElementById('iphoneFrame');
    const wallpaper = document.getElementById('wallpaper');

    if (!frame || !wallpaper) return;

    frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle tilt on frame
        const tiltX = y * -4;
        const tiltY = x * 4;
        frame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Parallax on wallpaper
        wallpaper.style.transform = `scale(1.05) translate(${x * -8}px, ${y * -8}px)`;
    });

    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        wallpaper.style.transform = 'scale(1) translate(0, 0)';
    });
}

// ===== DYNAMIC ISLAND ANIMATION =====
function initDynamicIsland() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;

    let expanded = false;

    island.addEventListener('click', () => {
        expanded = !expanded;
        if (expanded) {
            island.style.width = '220px';
            island.style.height = '45px';
            island.style.borderRadius = '24px';
        } else {
            island.style.width = '';
            island.style.height = '';
            island.style.borderRadius = '';
        }
    });
}

// ===== TAP HAPTIC FEEDBACK (visual) =====
function initTapEffects() {
    const icons = document.querySelectorAll('.app-grid .app-icon, .dock .app-icon');

    icons.forEach((icon) => {
        icon.addEventListener('mousedown', () => {
            icon.style.transform = 'scale(0.85)';
        });

        icon.addEventListener('mouseup', () => {
            icon.style.transform = 'scale(1)';
            setTimeout(() => {
                icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'scale(1)';
            }, 50);
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
        });
    });
}

// ===== LONG PRESS (jiggle mode preview) =====
function initLongPress() {
    const icons = document.querySelectorAll('.app-grid .app-icon, .dock .app-icon');
    let pressTimer;

    icons.forEach((icon) => {
        icon.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                icons.forEach((i) => {
                    i.style.animation = 'jiggle 0.15s ease-in-out infinite alternate';
                });
            }, 800);
        });

        icon.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });

        icon.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
    });

    // Click anywhere to stop jiggle
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.app-icon')) {
            icons.forEach((i) => {
                i.style.animation = '';
            });
        }
    });

    // Add jiggle keyframes
    const style = document.createElement('style');
    style.textContent = `
    @keyframes jiggle {
      0% { transform: rotate(-1.5deg); }
      100% { transform: rotate(1.5deg); }
    }
  `;
    document.head.appendChild(style);
}

// ============================================
// STRONGBOND APP
// ============================================

function initStrongBondApp() {
    const overlay = document.getElementById('sbAppOverlay');
    const closeBtn = document.getElementById('sbCloseBtn');
    const tabs = document.querySelectorAll('.sb-tab');
    const screens = document.querySelectorAll('.sb-screen');

    if (!overlay) return;

    // Open app when StrongBond icon is clicked
    const sbIconEl = document.getElementById('strongbondIcon');
    if (sbIconEl) {
        sbIconEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openStrongBondApp();
        });
        // Also support touch
        sbIconEl.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openStrongBondApp();
        });
    }

    // Close app
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeStrongBondApp();
        });
    }

    // Tab switching
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetScreen = tab.getAttribute('data-tab');

            // Update active tab
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active screen
            screens.forEach((s) => {
                s.classList.remove('active');
                if (s.getAttribute('data-screen') === targetScreen) {
                    s.classList.add('active');
                    // Reset scroll
                    const scroll = s.querySelector('.sb-screen-scroll');
                    if (scroll) scroll.scrollTop = 0;
                }
            });
        });
    });

    function openStrongBondApp() {
        overlay.classList.add('visible');
        updateTime(); // Sync time
    }

    function closeStrongBondApp() {
        overlay.classList.remove('visible');
        // Reset to first tab
        setTimeout(() => {
            tabs.forEach((t) => t.classList.remove('active'));
            screens.forEach((s) => s.classList.remove('active'));
            if (tabs[0]) tabs[0].classList.add('active');
            if (screens[0]) screens[0].classList.add('active');
        }, 350);
    }

    // Dismiss notification on click
    const notification = document.getElementById('sbNotification');
    if (notification) {
        notification.addEventListener('click', () => {
            notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        });
    }

    // Share card interaction - subtle tilt
    const shareCard = document.getElementById('sbShareCard');
    if (shareCard) {
        shareCard.addEventListener('mousemove', (e) => {
            const rect = shareCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const inner = shareCard.querySelector('.sb-share-card-inner');
            if (inner) {
                inner.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            }
        });

        shareCard.addEventListener('mouseleave', () => {
            const inner = shareCard.querySelector('.sb-share-card-inner');
            if (inner) {
                inner.style.transition = 'transform 0.4s ease';
                inner.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
                setTimeout(() => {
                    inner.style.transition = '';
                }, 400);
            }
        });
    }

    // Card click effects
    const cards = overlay.querySelectorAll('.sb-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    updateCalendar();
    initParallax();
    initDynamicIsland();
    initTapEffects();
    initLongPress();
    initStrongBondApp();

    // Update time every second
    setInterval(updateTime, 1000);

    // Update calendar every minute
    setInterval(updateCalendar, 60000);
});
