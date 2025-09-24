const courses = [
    {id:'c1', name:'Giao tiếp cơ bản', image:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop', start:'2025-10-10', duration:'8 tuần (16 buổi)', level:'Cơ bản', short:'Luyện kỹ năng nói cơ bản, câu hội thoại hàng ngày.', tags:['basic'], new:true, hot:false, curriculum:['Làm quen & tự giới thiệu','Mua sắm & hỏi đường','Gọi điện thoại cơ bản']},
    {id:'c2', name:'Giao tiếp trung cấp', image:'https://i.pinimg.com/736x/38/2a/30/382a30832e0f9536d3609430adafe7e8.jpg', start:'2025-11-02', duration:'10 tuần (20 buổi)', level:'Trung cấp', short:'Mở rộng vốn từ, hội thoại chuyên sâu hơn.', tags:['intermediate'], new:false, hot:true, curriculum:['Bày tỏ quan điểm','Thảo luận nhóm','Kỹ năng thuyết trình cơ bản']},
    {id:'c3', name:'Luyện phát âm (Pronunciation)', image:'https://i.pinimg.com/736x/6b/a8/1f/6ba81fe6f5f308568f4c926d27b36192.jpg', start:'2025-10-20', duration:'6 tuần (12 buổi)', level:'Tất cả', short:'Cải thiện phát âm, ngữ điệu để tự tin giao tiếp.', tags:['all'], new:true, hot:true, curriculum:['Âm và nhóm âm','Ngữ điệu & nhấn âm','Liên kết âm']},
    {id:'c4', name:'Giao tiếp thương mại (Business)', image:'https://i.pinimg.com/1200x/a3/51/30/a35130edc8113b0b747ed58f84fa3f8c.jpg', start:'2025-12-01', duration:'12 tuần (24 buổi)', level:'Trung cao', short:'Kỹ năng giao tiếp trong môi trường công việc.', tags:['intermediate','online'], new:false, hot:false, curriculum:['Email & gọi điện công việc','Thương lượng','Họp & thuyết trình chuyên nghiệp']},
    {id:'c5', name:'Luyện thi IELTS Speaking', image:'https://i.pinimg.com/736x/23/86/c2/2386c2bec57d785442f52a7076938201.jpg', start:'2025-10-15', duration:'8 tuần (16 buổi)', level:'Nâng cao', short:'Luyện chiến lược trả lời cho phần Speaking.', tags:['advanced'], new:false, hot:true, curriculum:['Part 1: Giới thiệu bản thân','Part 2: Mô tả sự việc','Part 3: Tranh luận & phân tích']}
];


let currentCourse = null;


function el(q, ctx=document){return ctx.querySelector(q)}
function els(q, ctx=document){return Array.from(ctx.querySelectorAll(q))}


function renderCard(course){
    const div = document.createElement('div');
    div.className = 'course-card';
    div.style.cursor = 'pointer'; // Thêm cursor pointer để hiển thị rằng card có thể click
    div.innerHTML = `
        <img class="course-thumb" src="${course.image}" alt="${course.name}">
        <div class="course-body">
            <div class="badges">${course.new?'<span class="badge new">Mới</span>':''}${course.hot?'<span class="badge hot">Hot</span>':''}</div>
            <div class="course-title">${course.name}</div>
            <div class="meta">${course.short}</div>
        </div>
        <div class="card-actions">
            <button class="link-ghost" data-id="${course.id}">Chi tiết →</button>
            <div class="meta">Khai giảng: ${course.start}</div>
        </div>
    `;

    // Thêm event listener cho toàn bộ card
    div.addEventListener('click', (e) => {
        // Ngăn chặn event bubbling nếu click vào button
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        showDetail(course.id);
    });

    // Vẫn giữ event listener cho button (để đảm bảo tương thích)
    div.querySelector('[data-id]')?.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn chặn event bubbling
        showDetail(course.id);
    });

    return div;
}


function mountGrid(id, list){
    const container = el(id);
    container.innerHTML = '';
    list.forEach(c => container.appendChild(renderCard(c)));
}


function init(){
    //home
    mountGrid('#newGrid', courses.filter(c=>c.new));
    mountGrid('#hotGrid', courses.filter(c=>c.hot));
    //courses 
    mountGrid('#coursesGrid', courses);

    // logo click - quay về trang chủ
    el('#logo')?.addEventListener('click', () => {
        navigateTo('home');
    });
    el('#stickyLogo')?.addEventListener('click', () => {
        navigateTo('home');
    });

    // nav
    els('[data-view]').forEach(elm=>elm.addEventListener('click', (e)=>{
        const v = elm.getAttribute('data-view');
        if(v) navigateTo(v);
    }));
    els('.nav-link').forEach(a=>a.addEventListener('click', (e)=>{e.preventDefault(); navigateTo(a.getAttribute('data-view'));}));

    // chips
    els('.chip').forEach(ch=>ch.addEventListener('click', ()=>{
        const f = ch.getAttribute('data-filter');
        filterCourses(f);
    }))


    el('#backBtn').addEventListener('click', ()=>navigateTo('courses'));
    el('#enrollBtn').addEventListener('click', ()=>{ if(currentCourse) alert('Đăng ký: '+currentCourse.name); });
}

function filterCourses(filter){
    if(filter==='all') return mountGrid('#coursesGrid', courses);
    const map = {basic:'basic', intermediate:'intermediate', advanced:'advanced', online:'online'};
    const list = courses.filter(c=> c.tags && c.tags.includes(map[filter]) );
    mountGrid('#coursesGrid', list.length?list:[{id:'empty',name:'Không có khóa phù hợp',image:'',start:'',duration:'',level:'',short:'',new:false,hot:false}]);
}

function showDetail(id){
    const course = courses.find(c=>c.id===id);
    if(!course) return;
    currentCourse = course;
    el('#detail-image').src = course.image;
    el('#detail-name').textContent = course.name;
    el('#detail-desc').textContent = course.short;
    el('#detail-start').textContent = course.start;
    el('#detail-duration').textContent = course.duration;
    el('#detail-level').textContent = course.level;
    el('#detail-curriculum').innerHTML = '<ul>' + course.curriculum.map(it=>`<li>${it}</li>`).join('') + '</ul>';
    navigateTo('detail');
}

function navigateTo(view){
    els('.view').forEach(v=>v.style.display='none');
    el('#view-'+view).style.display = 'block';
    // update active nav
    els('.nav-link').forEach(a=> a.classList.toggle('active', a.getAttribute('data-view')===view));
    // scroll top
    window.scrollTo({top:0,behavior:'smooth'});
}

// initial load
window.addEventListener('DOMContentLoaded', ()=>{init(); navigateTo('home');});

window.addEventListener('scroll', function() {
    const stickyHeader = document.getElementById('stickyHeader');
    const originalHeader = document.querySelector('header');
    const scrollY = window.scrollY;
    const headerHeight = originalHeader.offsetHeight;
    
    // Hiển thị sticky header sau khi cuộn qua 80% chiều cao header gốc
    if (scrollY > headerHeight * 0.8) {
        stickyHeader.classList.add('show');
    } else {
        stickyHeader.classList.remove('show');
    }
});