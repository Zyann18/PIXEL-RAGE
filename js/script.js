/* =========================================================
   PIXEL//RAGE
   Main JavaScript + Enhance
========================================================= */


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (event) => {
    if (cursor) {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    }
});


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });
}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth" });
}


/* =========================================================
   REVIEW FILTER
========================================================= */

const filterButtons = document.querySelectorAll(".filter-button");
const reviewCards = document.querySelectorAll(".review-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        reviewCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === "all" || category === filter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});


/* =========================================================
   REVIEW MODAL
========================================================= */

const reviewModal = document.getElementById("reviewModal");
const modalTitle = document.getElementById("modalTitle");
const modalScore = document.getElementById("modalScore");
const modalDescription = document.getElementById("modalDescription");

function openReview(title, score, description) {
    modalTitle.textContent = title;
    modalScore.textContent = score;
    modalDescription.textContent = description;
    reviewModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    reviewModal.classList.remove("active");
    document.body.style.overflow = "";
}

reviewModal.addEventListener("click", (event) => {
    if (event.target === reviewModal) {
        closeModal();
    }
});


/* =========================================================
   ESC CLOSE MODAL
========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* =========================================================
   SPEEDRUN
========================================================= */

function openSpeedrun() {
    openReview(
        "NIGHT//SHIFT SPEEDRUN",
        "01:47",
        "Current speedrun record. Full run available in the video section."
    );
}


/* =========================================================
   CHALLENGES
========================================================= */

function showChallenge(name) {
    openReview(
        name,
        "COMPLETE",
        "Challenge successfully completed. Detailed gameplay footage will be published soon."
    );
}


/* =========================================================
   CONTENT FORM
========================================================= */

const contentForm = document.getElementById("contentForm");
const contentTitle = document.getElementById("contentTitle");
const contentCategory = document.getElementById("contentCategory");
const contentScore = document.getElementById("contentScore");
const contentDescription = document.getElementById("contentDescription");
const contentImage = document.getElementById("contentImage");
const contentVideo = document.getElementById("contentVideo");
const previewContent = document.getElementById("previewContent");


/* =========================================================
   MEDIA PREVIEW
========================================================= */

function updatePreview() {
    const imageURL = contentImage.value.trim();
    const videoURL = contentVideo.value.trim();

    previewContent.innerHTML = "";

    if (!imageURL && !videoURL) {
        previewContent.textContent = "No media selected.";
        return;
    }

    if (imageURL) {
        const image = document.createElement("img");
        image.src = imageURL;
        image.alt = "Preview";
        image.onerror = () => { image.style.display = "none"; };
        previewContent.appendChild(image);
    }

    if (videoURL) {
        const video = document.createElement("video");
        video.src = videoURL;
        video.controls = true;
        previewContent.appendChild(video);
    }
}

contentImage.addEventListener("input", updatePreview);
contentVideo.addEventListener("input", updatePreview);


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getSavedContent() {
    const data = localStorage.getItem("pixelRageContent");
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveContent(data) {
    localStorage.setItem("pixelRageContent", JSON.stringify(data));
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    if (!value) return "";
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CREATE REVIEW CARD
========================================================= */

function createReviewCard(data) {
    const article = document.createElement("article");
    article.className = "review-card";
    article.dataset.category = data.category;

    const score = data.score || "—";

    article.innerHTML = `
        <div class="card-image">
            <img src="${escapeHTML(data.image)}" alt="${escapeHTML(data.title)}">
            <span class="card-category">${escapeHTML(data.category.toUpperCase())}</span>
            <span class="card-score">${escapeHTML(score)}</span>
        </div>
        <div class="card-content">
            <span class="card-date">NEW / 2026</span>
            <h3>${escapeHTML(data.title)}</h3>
            <p>${escapeHTML(data.description)}</p>
            <button>READ REVIEW →</button>
        </div>
    `;

    const button = article.querySelector("button");
    button.addEventListener("click", () => {
        openReview(data.title, score, data.description);
    });

    return article;
}


/* =========================================================
   LOAD SAVED CONTENT
========================================================= */

function loadSavedContent() {
    const saved = getSavedContent();
    const grid = document.getElementById("reviewGrid");
    saved.forEach(item => {
        const card = createReviewCard(item);
        grid.prepend(card);
    });
}

loadSavedContent();


/* =========================================================
   FORM SUBMISSION
========================================================= */

contentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
        title: contentTitle.value.trim(),
        category: contentCategory.value,
        score: contentScore.value.trim(),
        description: contentDescription.value.trim(),
        image: contentImage.value.trim(),
        video: contentVideo.value.trim(),
        createdAt: new Date().toISOString()
    };

    if (!data.title) {
        alert("Please enter a game title.");
        return;
    }

    if (!data.description) {
        alert("Please enter a description.");
        return;
    }

    /* SAVE */
    const saved = getSavedContent();
    saved.push(data);
    saveContent(saved);

    /* ADD CARD TO UI */
    const grid = document.getElementById("reviewGrid");
    const card = createReviewCard(data);
    grid.prepend(card);

    /* RESET FORM */
    contentForm.reset();
    previewContent.textContent = "No media selected.";

    /* FEEDBACK */
    alert("CONTENT PUBLISHED!");
    scrollToSection("reviews");
});


/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterForm.querySelector("input").value;
    if (!email) return;
    alert(`WELCOME TO THE CLUB, ${email}`);
    newsletterForm.reset();
});


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document.addEventListener("error", (event) => {
    if (event.target.tagName === "IMG") {
        event.target.style.background = "#d4d0c5";
        event.target.alt = "Image unavailable";
    }
}, true);


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener("load", () => {
    console.log("PIXEL//RAGE ONLINE.");
});


/* =========================================================
   =========================================================
   ENHANCE.JS — dimulai dari sini
   =========================================================
   ========================================================= */

(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const store = {
        get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
        set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
    };
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

    /* ---------- toast (replaces alert) ---------- */
    const toastBox = el("div", "toast-box");
    document.body.append(toastBox);
    function toast(msg) {
        const t = el("div", "toast"); t.textContent = msg; toastBox.append(t);
        setTimeout(() => t.remove(), 2600);
    }
    window.alert = toast;

    /* ---------- progress bar, back-to-top, nav spy ---------- */
    const bar = el("div", "progress"); document.body.prepend(bar);
    const topBtn = el("button", "to-top"); topBtn.textContent = "↑"; topBtn.setAttribute("aria-label", "Back to top");
    topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
    document.body.append(topBtn);
    addEventListener("scroll", () => {
        const h = document.documentElement;
        bar.style.width = (scrollY / ((h.scrollHeight - innerHeight) || 1)) * 100 + "%";
        topBtn.classList.toggle("show", scrollY > 600);
    }, { passive: true });

    const spy = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    ["reviews", "speedruns", "challenges", "submit"].forEach(id => $("#" + id) && spy.observe($("#" + id)));

    /* ---------- cursor grows on interactive elements ---------- */
    const cur = $(".cursor");
    document.addEventListener("mouseover", e => cur && cur.classList.toggle("big", !!e.target.closest("a,button,input,select,textarea,.review-card")));

    /* ---------- ticker: duplicate content so the -50% loop is seamless ---------- */
    const track = $(".ticker-track");
    if (track) track.innerHTML += track.innerHTML;

    /* ---------- scroll reveal ---------- */
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    const reveal = n => { n.classList.add("reveal"); io.observe(n); };
    $$(".section-header,.featured-card,.challenge-card,.content-form,.speedrun-content").forEach(reveal);

    /* featured score count-up */
    const fs = $(".score-box strong");
    if (fs) {
        const to = parseFloat(fs.textContent);
        new IntersectionObserver((es, o) => {
            if (!es[0].isIntersecting) return;
            o.disconnect(); let s = null;
            const step = t => { s ??= t; const p = Math.min((t - s) / 1200, 1); fs.textContent = (to * p).toFixed(1); if (p < 1) requestAnimationFrame(step); };
            requestAnimationFrame(step);
        }).observe(fs);
    }

    /* featured "read full review" now opens the modal */
    const rr = $(".read-review");
    if (rr) rr.onclick = () => openReview("NEON AFTERMATH", $(".score-box strong").dataset.final || "9.5", $(".featured-info p").textContent.trim());

    /* ---------- reviews: search, sort, extra filters, favourites, delete ---------- */
    const grid = $("#reviewGrid");
    const state = { filter: "all", q: "", sort: "newest" };
    const favs = () => store.get("prFavs", []);
    let lowest = 0;

    const filters = $(".filters");
    [["saved", "♥ SAVED"], ["speedrun", "SPEEDRUN"], ["challenge", "CHALLENGE"]].forEach(([f, label]) => {
        const b = el("button", "filter-button"); b.dataset.filter = f; b.textContent = label; filters.append(b);
    });

    const toolbar = el("div", "toolbar", `
        <input type="search" id="reviewSearch" placeholder="SEARCH GAMES...  ( press / )" aria-label="Search reviews">
        <select id="reviewSort" aria-label="Sort reviews">
            <option value="newest">SORT: NEWEST</option>
            <option value="score">SORT: TOP SCORE</option>
            <option value="az">SORT: A–Z</option>
        </select>
        <span class="count" id="reviewCount"></span>`);
    const empty = el("div", "empty"); empty.textContent = "NOTHING FOUND. PLAY MORE."; empty.hidden = true;
    grid.before(toolbar); grid.after(empty);
    const count = $("#reviewCount");

    function applyView() {
        const q = state.q.toLowerCase(), f = favs();
        const cards = $$(".review-card", grid);
        let n = 0;
        cards.forEach(c => {
            const title = $("h3", c).textContent.trim();
            const okF = state.filter === "all" || (state.filter === "saved" ? f.includes(title) : c.dataset.category === state.filter);
            const okQ = !q || (title + " " + $("p", c).textContent).toLowerCase().includes(q);
            c.style.display = okF && okQ ? "" : "none";
            if (okF && okQ) n++;
        });
        count.textContent = `${n} / ${cards.length} RESULTS`;
        empty.hidden = n > 0;
    }

    function applySort() {
        const sc = c => parseFloat($(".card-score", c).textContent) || 0;
        const cmp = {
            newest: (a, b) => a.dataset.order - b.dataset.order,
            score: (a, b) => sc(b) - sc(a),
            az: (a, b) => $("h3", a).textContent.trim().localeCompare($("h3", b).textContent.trim())
        }[state.sort];
        $$(".review-card", grid).sort(cmp).forEach(c => grid.append(c));
    }

    filters.addEventListener("click", e => {
        const b = e.target.closest(".filter-button");
        if (!b) return;
        $$(".filter-button", filters).forEach(x => x.classList.toggle("active", x === b));
        state.filter = b.dataset.filter; applyView();
    });
    $("#reviewSearch").addEventListener("input", e => { state.q = e.target.value.trim(); applyView(); });
    $("#reviewSort").addEventListener("change", e => { state.sort = e.target.value; applySort(); });

    function enhanceCard(c) {
        if (c.dataset.enhanced) return;
        c.dataset.enhanced = "1";
        c.dataset.order ??= --lowest;
        reveal(c);
        const box = $(".card-image", c), img = $("img", box), title = $("h3", c).textContent.trim();
        if (img && !img.getAttribute("src")) { img.remove(); box.classList.add("noimg"); }

        const fav = el("button", "fav"); fav.type = "button"; fav.textContent = "♥"; fav.title = "Save";
        fav.classList.toggle("on", favs().includes(title));
        fav.onclick = e => {
            e.stopPropagation();
            const list = favs(), i = list.indexOf(title);
            i > -1 ? list.splice(i, 1) : list.push(title);
            store.set("prFavs", list); fav.classList.toggle("on", i === -1);
            toast(i === -1 ? "SAVED: " + title : "REMOVED: " + title);
            applyView();
        };
        box.append(fav);

        if ($(".card-date", c).textContent.includes("NEW")) {          // user-created cards only
            const del = el("button", "del"); del.type = "button"; del.textContent = "×"; del.title = "Delete";
            del.onclick = () => {
                if (!confirm("Delete " + title + "?")) return;
                const desc = $("p", c).textContent.trim();
                const data = store.get("pixelRageContent", []);
                const i = data.findIndex(d => d.title === title && d.description === desc);
                if (i > -1) { data.splice(i, 1); store.set("pixelRageContent", data); }
                c.remove(); applyView(); toast("DELETED");
            };
            box.append(del);
        }
    }
    $$(".review-card", grid).forEach((c, i) => { c.dataset.order = i + 1; enhanceCard(c); });
    new MutationObserver(() => { $$(".review-card", grid).forEach(enhanceCard); applyView(); }).observe(grid, { childList: true });
    applyView();

    /* ---------- modal: reader score, share, comments ---------- */
    const box = $(".modal-box");
    const extra = el("div", "modal-extra");
    box.insertBefore(extra, box.querySelector(".btn"));
    const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    function decorate(title, score) {
        const ratings = store.get("prRatings", {}), mine = ratings[title];
        const critic = parseFloat(score);
        extra.innerHTML = `<h4>YOUR SCORE</h4><div class="rate"></div><div class="rate-note"></div>
            <h4>COMMENTS</h4><ul class="comments"></ul>
            <div class="comment-row"><input maxlength="200" placeholder="SAY SOMETHING..."><button class="mini" type="button">POST</button></div>
            <p style="margin-top:14px"><button class="mini share" type="button">COPY LINK ⧉</button></p>`;
        const note = $(".rate-note", extra);
        const paint = () => {
            const r = store.get("prRatings", {})[title];
            $$(".rate button", extra).forEach(b => b.classList.toggle("on", +b.dataset.v === r));
            note.textContent = r ? (isNaN(critic) ? `YOU RATED IT ${r}/10` : `YOU: ${r}/10 — ${r === critic ? "SAME AS US" : (r > critic ? "+" : "") + (r - critic).toFixed(1) + " VS OUR SCORE"}`) : "CLICK TO RATE";
        };
        for (let i = 1; i <= 10; i++) {
            const b = el("button"); b.type = "button"; b.dataset.v = i; b.textContent = i;
            b.onclick = () => { const all = store.get("prRatings", {}); all[title] = i; store.set("prRatings", all); paint(); };
            $(".rate", extra).append(b);
        }
        paint();

        const list = $(".comments", extra), input = $("input", extra);
        const draw = () => {
            list.innerHTML = "";
            const cs = store.get("prComments", {})[title] || [];
            if (!cs.length) { const li = el("li"); li.textContent = "NO COMMENTS YET."; list.append(li); }
            cs.forEach(c => { const li = el("li"); li.textContent = c; list.append(li); });
        };
        const post = () => {
            const v = input.value.trim(); if (!v) return;
            const all = store.get("prComments", {}); (all[title] ||= []).push(v); store.set("prComments", all);
            input.value = ""; draw();
        };
        $(".comment-row .mini", extra).onclick = post;
        input.onkeydown = e => { if (e.key === "Enter") post(); };
        $(".share", extra).onclick = () => {
            const url = location.href.split("#")[0] + "#" + slug(title);
            (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("LINK COPIED"), () => toast(url));
        };
        draw();
    }
    const _open = window.openReview;
    window.openReview = (t, s, d) => { _open(t, s, d); decorate(t, s); };

    /* ---------- poll ---------- */
    const titles = $$(".review-card h3", grid).slice(-4).map(h => h.textContent.trim());
    const seed = [12, 9, 17, 6];
    const poll = el("section", "poll");
    poll.id = "poll";
    poll.innerHTML = `<span class="eyebrow">COMMUNITY</span><h2>YOUR VOTE.<br>OUR WINNER.</h2><div class="poll-list"></div>
        <p class="poll-note">VOTES ARE STORED IN THIS BROWSER ONLY.</p>`;
    const vs = $(".video-section");
    vs ? vs.before(poll) : document.body.append(poll);
    reveal($(".poll-list", poll));
    const list = $(".poll-list", poll);
    function drawPoll() {
        const votes = store.get("prPoll", null), my = store.get("prPollMine", null);
        const nums = titles.map((t, i) => seed[i] + (votes && votes[t] ? votes[t] : 0));
        const total = nums.reduce((a, b) => a + b, 0);
        list.innerHTML = "";
        titles.forEach((t, i) => {
            const b = el("button", "poll-opt"); b.type = "button";
            const pct = Math.round(nums[i] / total * 100);
            b.innerHTML = `<i style="width:${my ? pct : 0}%"></i><span></span><span>${my ? pct + "%" : "VOTE"}</span>`;
            b.children[1].textContent = t + (my === t ? "  ✓" : "");
            b.onclick = () => {
                if (store.get("prPollMine", null)) return toast("YOU ALREADY VOTED");
                const v = store.get("prPoll", {}); v[t] = (v[t] || 0) + 1;
                store.set("prPoll", v); store.set("prPollMine", t); poll.classList.add("voted"); drawPoll(); toast("VOTE COUNTED");
            };
            list.append(b);
        });
    }
    drawPoll();

    /* ---------- reaction test in the speedrun section ---------- */
    const sc = $(".speedrun-content");
    if (sc) {
        const best = store.get("prBest", null);
        const rt = el("div", "reaction", `<span>REACTION TEST // BEST: <b>${best ? best + " MS" : "—"}</b></span><button class="rt-box" type="button">CLICK TO START</button>`);
        sc.append(rt);
        const rbox = $(".rt-box", rt), bestEl = $("b", rt);
        let st = "idle", timer, t0, b = best;
        rbox.onclick = () => {
            if (st === "idle") {
                st = "wait"; rbox.className = "rt-box wait"; rbox.textContent = "WAIT FOR YELLOW...";
                timer = setTimeout(() => { st = "go"; t0 = performance.now(); rbox.className = "rt-box go"; rbox.textContent = "CLICK!"; }, 1000 + Math.random() * 2500);
            } else if (st === "wait") {
                clearTimeout(timer); st = "idle"; rbox.className = "rt-box"; rbox.textContent = "TOO EARLY. AGAIN?";
            } else {
                const ms = Math.round(performance.now() - t0);
                st = "idle"; rbox.className = "rt-box"; rbox.textContent = ms + " MS — AGAIN?";
                if (!b || ms < b) { b = ms; store.set("prBest", ms); bestEl.textContent = ms + " MS"; toast("NEW PERSONAL BEST"); }
            }
        };
    }

    /* ---------- missing video notice ---------- */
    const src = $("#mainVideo source");
    if (src) src.addEventListener("error", () => {
        const m = el("div", "video-missing"); m.textContent = "NO VIDEO FILE FOUND — ADD assets/videos/gameplay.mp4";
        $(".video-wrapper").append(m);
    });

    /* ---------- keyboard: "/" focuses search, Konami toggles rage mode ---------- */
    document.addEventListener("keydown", e => {
        if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
            e.preventDefault(); $("#reviewSearch").focus(); scrollToSection("reviews");
        }
    });
    const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos = 0;
    document.addEventListener("keydown", e => {
        pos = e.key === code[pos] ? pos + 1 : (e.key === code[0] ? 1 : 0);
        if (pos === code.length) { pos = 0; toast(document.body.classList.toggle("rage") ? "RAGE MODE: ON" : "RAGE MODE: OFF"); }
    });

    /* open a review from a shared link (#void-runner) */
    if (location.hash.length > 1) {
        const hit = $$(".review-card", grid).find(c => slug($("h3", c).textContent) === location.hash.slice(1));
        if (hit) setTimeout(() => $("button", $(".card-content", hit)).click(), 400);
    }
})();


/* =========================================================
   CUSTOM VIDEO CONTROLS
========================================================= */

(function() {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const videoProgress = document.getElementById('videoProgress');
    const videoTime = document.getElementById('videoTime');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!video || !playPauseBtn) return;

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '❚❚';
        } else {
            video.pause();
            playPauseBtn.textContent = '▶';
        }
    });

    // Video click to play/pause
    video.addEventListener('click', () => {
        playPauseBtn.click();
    });

    // Update progress bar
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = progress + '%';

        // Update time display
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);

        videoTime.textContent = 
            `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')} / ` +
            `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
    });

    // Seek
    videoProgress.addEventListener('click', (e) => {
        const rect = videoProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });

    // Mute/Unmute
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        const videoWrapper = video.closest('.video-wrapper');
        if (!document.fullscreenElement) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
            fullscreenBtn.textContent = '⛶';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            fullscreenBtn.textContent = '⛶';
        }
    });

    // Reset button when video ends
    video.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶';
    });

    // Space bar to play/pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            const videoSection = document.querySelector('.video-section');
            const rect = videoSection?.getBoundingClientRect();
            if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
                e.preventDefault();
                playPauseBtn.click();
            }
        }
    });

})();
