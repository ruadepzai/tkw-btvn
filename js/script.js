const courses = [
    {id:'c1', name:'Giao tiếp cơ bản', image:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop', start:'2025-10-10', duration:'8 tuần (16 buổi)', level:'Cơ bản', short:'Luyện kỹ năng nói cơ bản, câu hội thoại hàng ngày.', tags:['basic'], new:true, hot:false, curriculum:['Làm quen & tự giới thiệu','Mua sắm & hỏi đường','Gọi điện thoại cơ bản']},
    {id:'c2', name:'Giao tiếp trung cấp', image:'https://i.pinimg.com/736x/38/2a/30/382a30832e0f9536d3609430adafe7e8.jpg', start:'2025-11-02', duration:'10 tuần (20 buổi)', level:'Trung cấp', short:'Mở rộng vốn từ, hội thoại chuyên sâu hơn.', tags:['intermediate'], new:false, hot:true, curriculum:['Bày tỏ quan điểm','Thảo luận nhóm','Kỹ năng thuyết trình cơ bản']},
    {id:'c3', name:'Luyện phát âm (Pronunciation)', image:'https://i.pinimg.com/736x/6b/a8/1f/6ba81fe6f5f308568f4c926d27b36192.jpg', start:'2025-10-20', duration:'6 tuần (12 buổi)', level:'Tất cả', short:'Cải thiện phát âm, ngữ điệu để tự tin giao tiếp.', tags:['all'], new:true, hot:true, curriculum:['Âm và nhóm âm','Ngữ điệu & nhấn âm','Liên kết âm']},
    {id:'c4', name:'Giao tiếp thương mại (Business)', image:'https://i.pinimg.com/1200x/a3/51/30/a35130edc8113b0b747ed58f84fa3f8c.jpg', start:'2025-12-01', duration:'12 tuần (24 buổi)', level:'Trung cao', short:'Kỹ năng giao tiếp trong môi trường công việc.', tags:['intermediate','online'], new:false, hot:false, curriculum:['Email & gọi điện công việc','Thương lượng','Họp & thuyết trình chuyên nghiệp']},
    {id:'c5', name:'Luyện thi IELTS Speaking', image:'https://i.pinimg.com/736x/23/86/c2/2386c2bec57d785442f52a7076938201.jpg', start:'2025-10-15', duration:'8 tuần (16 buổi)', level:'Nâng cao', short:'Luyện chiến lược trả lời cho phần Speaking.', tags:['advanced'], new:false, hot:true, curriculum:['Part 1: Giới thiệu bản thân','Part 2: Mô tả sự việc','Part 3: Tranh luận & phân tích']}
];

let currentCourse = null;

// Utility functions
function el(q, ctx=document){return ctx.querySelector(q)}
function els(q, ctx=document){return Array.from(ctx.querySelectorAll(q))}

// Render course card for multi-page website
function renderCard(course, showDetailLink = true){
    const div = document.createElement('div');
    div.className = 'course-card';
    div.style.cursor = 'pointer';
    
    const detailButton = showDetailLink ? 
        `<button class="link-ghost" onclick="showCourseDetail('${course.id}')">Chi tiết →</button>` : 
        `<div></div>`;
    
    div.innerHTML = `
        <img class="course-thumb" src="${course.image}" alt="${course.name}">
        <div class="course-body">
            <div class="badges">${course.new?'<span class="badge new">Mới</span>':''}${course.hot?'<span class="badge hot">Hot</span>':''}</div>
            <div class="course-title">${course.name}</div>
            <div class="meta">${course.short}</div>
        </div>
        <div class="card-actions">
            ${detailButton}
            <div class="meta">Khai giảng: ${course.start}</div>
        </div>
    `;

    // Add click event to entire card
    div.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        showCourseDetail(course.id);
    });

    return div;
}

// Show course detail - navigate to detail page
function showCourseDetail(courseId) {
    // Store course ID in localStorage for detail page
    localStorage.setItem('selectedCourseId', courseId);
    window.location.href = 'course-detail.html';
}

// Mount grid with courses
function mountGrid(id, list, showDetailLink = true){
    const container = el(id);
    if (!container) return;
    
    container.innerHTML = '';
    list.forEach(c => container.appendChild(renderCard(c, showDetailLink)));
}

// Filter courses functionality
function filterCourses(filter){
    const container = el('#coursesGrid');
    if (!container) return;

    // Update active chip
    els('.chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-filter') === filter);
    });

    if(filter === 'all') {
        return mountGrid('#coursesGrid', courses);
    }
    
    const map = {basic:'basic', intermediate:'intermediate', advanced:'advanced', online:'online'};
    const list = courses.filter(c => c.tags && c.tags.includes(map[filter]));
    
    if (list.length === 0) {
        container.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;"><p class="muted">Không có khóa học phù hợp với bộ lọc này.</p></div>';
    } else {
        mountGrid('#coursesGrid', list);
    }
}

// Load course detail on detail page
function loadCourseDetail() {
    const courseId = localStorage.getItem('selectedCourseId');
    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
        window.location.href = 'courses.html';
        return;
    }

    currentCourse = course;
    
    // Update page content
    const detailImage = el('#detail-image');
    const detailName = el('#detail-name');
    const detailDesc = el('#detail-desc');
    const detailStart = el('#detail-start');
    const detailDuration = el('#detail-duration');
    const detailLevel = el('#detail-level');
    const detailCurriculum = el('#detail-curriculum');
    
    if (detailImage) detailImage.src = course.image;
    if (detailName) detailName.textContent = course.name;
    if (detailDesc) detailDesc.textContent = course.short;
    if (detailStart) detailStart.textContent = course.start;
    if (detailDuration) detailDuration.textContent = course.duration;
    if (detailLevel) detailLevel.textContent = course.level;
    if (detailCurriculum) {
        detailCurriculum.innerHTML = '<ul>' + course.curriculum.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }

    // Update page title
    document.title = `${course.name} - Trung tâm Tiếng Anh Sena Chill`;
}

// Navigate to contact page with course enrollment
function enrollInCourse(courseId = null) {
    // Store course info for contact page
    if (courseId || currentCourse) {
        const course = courseId ? courses.find(c => c.id === courseId) : currentCourse;
        if (course) {
            localStorage.setItem('enrollmentCourse', JSON.stringify({
                id: course.id,
                name: course.name,
                start: course.start
            }));
        }
    }
    
    // Navigate to contact page
    window.location.href = 'contact.html';
}

// Initialize page based on current page
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Apply fixed header for all pages except home
    if (currentPage !== 'index.html' && currentPage !== '') {
        document.body.classList.add('has-fixed-header');
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('fixed-header');
        }
    }
    
    switch(currentPage) {
        case 'index.html':
        case '':
            // Home page initialization
            mountGrid('#newGrid', courses.filter(c => c.new), true);
            mountGrid('#hotGrid', courses.filter(c => c.hot), true);
            initFAQ();
            break;
            
        case 'courses.html':
            // Courses page initialization
            mountGrid('#coursesGrid', courses, true);
            
            // Add filter functionality
            els('.chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const filter = chip.getAttribute('data-filter');
                    filterCourses(filter);
                });
            });
            break;
            
        case 'course-detail.html':
            // Course detail page initialization
            loadCourseDetail();
            
            // Add enroll button functionality - THAY ĐỔI TẠI ĐÂY
            const enrollBtn = el('#enrollBtn');
            if (enrollBtn) {
                enrollBtn.addEventListener('click', () => {
                    enrollInCourse();
                });
            }
            break;
            
        case 'about.html':
            // About page - no special initialization needed
            break;
            
        case 'contact.html':
            // Contact page initialization
            initContactPage();
            
            const contactForm = el('#contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // Nếu form không hợp lệ thì dừng
                    if (!contactForm.checkValidity()) {
                        contactForm.reportValidity(); // Hiện tooltip mặc định của browser
                        return;
                    }

                    // Thành công
                    alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.');
                    contactForm.reset();
                    
                    // Clear enrollment course data and remove notification
                    localStorage.removeItem('enrollmentCourse');
                    
                    // Remove the enrollment notification
                    const notification = document.querySelector('.enrollment-notification');
                    if (notification) {
                        notification.remove();
                    }
                });
            }
            break;
    }
}

// Initialize contact page with enrollment data
function initContactPage() {
    const enrollmentData = localStorage.getItem('enrollmentCourse');
    if (enrollmentData) {
        try {
            const course = JSON.parse(enrollmentData);
            
            // Pre-fill course selection if there's a course select field
            const courseSelect = el('#course');
            if (courseSelect) {
                // Find and select the course option
                const options = courseSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === course.id || option.textContent.includes(course.name)) {
                        option.selected = true;
                    }
                });
            }
            
            // Or pre-fill a message field if exists
            const messageField = el('#message') || el('textarea[name="message"]');
            if (messageField && !messageField.value.trim()) {
                messageField.value = `Tôi muốn đăng ký khóa học: ${course.name}\nKhai giảng: ${course.start}`;
            }
            
            // Show a notification
            const notification = document.createElement('div');
            notification.className = 'enrollment-notification'; // Add class for easy removal
            notification.style.cssText = `
                background: #dbeafe;
                color: #1e40af;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-left: 4px solid #2563eb;
            `;
            notification.innerHTML = `📚 Bạn đang đăng ký khóa học: <strong>${course.name}</strong>`;
            
            const form = el('#contactForm') || el('form');
            if (form) {
                form.insertBefore(notification, form.firstChild);
            }
            
        } catch (e) {
            console.warn('Could not parse enrollment data:', e);
        }
    }
}

// FAQ functionality
function initFAQ() {
    const faqItems = els('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Sticky header functionality
function initStickyHeader() {
    const stickyHeader = el('#stickyHeader');
    if (!stickyHeader) return;

    window.addEventListener('scroll', function() {
        const originalHeader = el('header');
        const scrollY = window.scrollY;
        const headerHeight = originalHeader.offsetHeight;
        
        // Show sticky header after scrolling past 80% of original header height
        if (scrollY > headerHeight * 0.8) {
            stickyHeader.classList.add('show');
        } else {
            stickyHeader.classList.remove('show');
        }
    });
}

// Get URL parameters for course detail page
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Alternative method to show course detail using URL parameters
function showCourseDetailByUrl(courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
}

// Load course detail from URL parameter (alternative method)
function loadCourseDetailFromUrl() {
    const courseId = getUrlParameter('id') || localStorage.getItem('selectedCourseId');
    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
        window.location.href = 'courses.html';
        return;
    }

    // Same implementation as loadCourseDetail
    loadCourseDetail();
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile menu functionality (for future enhancement)
function toggleMobileMenu() {
    const nav = el('nav');
    if (nav) {
        nav.classList.toggle('mobile-active');
    }
}

// Search functionality (for future enhancement)
function searchCourses(query) {
    const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.short.toLowerCase().includes(query.toLowerCase()) ||
        course.level.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = el('#coursesGrid');
    if (container) {
        if (filtered.length === 0) {
            container.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;"><p class="muted">Không tìm thấy khóa học phù hợp.</p></div>';
        } else {
            mountGrid('#coursesGrid', filtered);
        }
    }
}

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Local storage utilities for user preferences
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function getUserPreference(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return defaultValue;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize current page
    initializePage();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Add global event listeners
    
    // Logo click handlers
    const logos = els('.logo');
    logos.forEach(logo => {
        if (logo.style.cursor === 'pointer') {
            logo.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    });
    
    // Navigation links active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    els('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add smooth scrolling to anchor links
    els('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = el(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states to buttons
    els('.btn-primary, .btn-ghost').forEach(btn => {
        // Skip contact form submit button and enroll button
        if(btn.closest('#contactForm') || btn.id === 'enrollBtn') return;

        btn.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Đang xử lý...';
            this.disabled = true;
            
            // Reset after 2 seconds (simulate processing)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
    
    // Console welcome message
    console.log('%c🎓 Chào mừng đến với Sena Chill English Center!', 'color: #2563EB; font-size: 16px; font-weight: bold;');
    console.log('%c📚 Website được thiết kế bởi Sena Chill Team', 'color: #666; font-size: 12px;');
});

// Export functions for global access (if needed)
window.showCourseDetail = showCourseDetail;
window.filterCourses = filterCourses;
window.scrollToTop = scrollToTop;
window.searchCourses = searchCourses;
window.enrollInCourse = enrollInCourse;