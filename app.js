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

    // Плавный переход к контактам (если есть .gis-fab)
    var gisFab = document.querySelector(".gis-fab");
    if (gisFab) {
        gisFab.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.querySelector(gisFab.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Форма заявки -> Web3Forms
    var form = document.getElementById("leadForm");
    var status = document.getElementById("formStatus");
    if (!form || !status) return;

    function setStatus(text, ok) {
        status.textContent = text;
        status.className = "form-status " + (ok ? "ok" : "err");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var nameEl = form.elements["name"];
        var phoneEl = form.elements["phone"];
        var kindEl = form.elements["kind"];
        var messageEl = form.elements["message"];
        var consentEl = form.elements["consent"];
        var botEl = form.elements["botcheck"];

        // Honeypot: если бот заполнил скрытый чекбокс — молча выходим
        if (botEl && botEl.checked) return;

        var name = nameEl ? nameEl.value.trim() : "";
        var phone = phoneEl ? phoneEl.value.trim() : "";

        if (name.length < 2) { setStatus("Укажите имя.", false); if (nameEl) nameEl.focus(); return; }
        if (phone.replace(/\D/g, "").length < 10) { setStatus("Укажите корректный телефон.", false); if (phoneEl) phoneEl.focus(); return; }
        if (!kindEl || !kindEl.value) { setStatus("Выберите вариант из списка.", false); if (kindEl) kindEl.focus(); return; }
        if (!messageEl || messageEl.value.trim().length < 3) { setStatus("Заполните комментарий.", false); if (messageEl) messageEl.focus(); return; }
        if (!consentEl || !consentEl.checked) { setStatus("Отметьте согласие на обработку данных.", false); return; }

        var btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        setStatus("Отправляем…", true);

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                access_key: "c0153a93-0b09-41c4-9926-b2506206d8bd",
                subject: "Заявка с сайта: " + (kindEl.value || "общий вопрос") + " — " + name,
                name: name,
                phone: phone,
                kind: kindEl.value,
                message: messageEl.value,
                consent: "Да"
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
