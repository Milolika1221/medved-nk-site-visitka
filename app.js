(function () {
    "use strict";

    // Мобильное меню
    var burger = document.getElementById("burger");
    var nav = document.getElementById("mainNav");
    if (burger && nav) {
        burger.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            burger.setAttribute("aria-expanded", open ? "true" : "false");
        });
        nav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") nav.classList.remove("open");
        });
    }

    // Выпадающий список телефонов
    var phoneDD = document.getElementById("phoneDD");
    if (phoneDD) {
        var ddBtn = phoneDD.querySelector(".phone-dd-btn");
        ddBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            var open = phoneDD.classList.toggle("open");
            ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
        });
        document.addEventListener("click", function (e) {
            if (!phoneDD.contains(e.target)) {
                phoneDD.classList.remove("open");
                ddBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Значок ГИС: плавный переход к контактам
    var gisFab = document.querySelector(".gis-fab");
    if (gisFab) {
        gisFab.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.querySelector(gisFab.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    }

    var form = document.getElementById("leadForm");
    var status = document.getElementById("formStatus");
    if (!form) return;

    function setStatus(text, ok) {
        status.textContent = text;
        status.className = "form-status " + (ok ? "ok" : "err");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = form.name.value.trim();
        var phone = form.phone.value.trim();
        if (name.length < 2) { setStatus("Укажите имя.", false); form.name.focus(); return; }
        if (phone.replace(/\D/g, "").length < 10) { setStatus("Укажите корректный телефон.", false); form.phone.focus(); return; }
        if (!form.kind.value) { setStatus("Выберите вариант из списка.", false); form.kind.focus(); return; }
        if (form.message.value.trim().length < 3) { setStatus("Заполните комментарий.", false); form.message.focus(); return; }
        if (!form.consent.checked) { setStatus("Отметьте согласие на обработку данных.", false); return; }
        if (form._honey.value) return; // бот — молча игнорируем

        var btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        setStatus("Отправляем…", true);

        fetch('https://api.web3forms.com/submit', {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                access_key: "c0153a93-0b09-41c4-9926-b2506206d8bd",
                subject: "Заявка с сайта: " + (form.kind.value || "общий вопрос") + " — " + name,
                name: name,
                phone: phone,
                kind: form.kind.value,
                message: form.message.value,
                consent: form.consent.checked ? "Да" : "Нет"
            })
        })
        .then(function (r) { return r.json(); })
        .then(function (j) {
            if (j.success === "true" || j.success === true) {
                setStatus("Заявка принята! Перезвоним в течение рабочего часа.", true);
                form.reset();
            } else {
                setStatus("Не удалось отправить. Позвоните нам: +7 (3843) 53-22-33.", false);
            }
        })
        .catch(function () {
            setStatus("Ошибка сети. Позвоните нам: +7 (3843) 53-22-33.", false);
        })
        .finally(function () { btn.disabled = false; });
    });
})();
