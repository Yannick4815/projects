(() => {
    "use strict";
    function e(e, t, n) {
        for (; e.firstChild;)e.removeChild(e.firstChild);
        let i = null,
            o = new Date(t.get_time().getFullYear(),
                t.get_time().getMonth(),
                1).getDay(),
            a = new Date(t.get_time().getFullYear(), t.get_time().getMonth() + 1, 0).getDate();
        for (let t = 0; t < o; t++) {
            const t = document.createElement("div");
            Object.assign(t.style, { width: "40px", height: "34px" }),
                e.appendChild(t)
        }
        for (let o = 0; o < a; o++) {
            const a = document.createElement("div");
            a.date = new Date(t.get_time().getFullYear(), t.get_time().getMonth(), 1 + o),
                a.textContent = a.date.getDate(),
                Object.assign(a.style, {
                    textAlign: "center",
                    width: "40px",
                    height: "40px",
                    lineHeight: "40px",
                    borderRadius: "50%"
                }),
                a.addEventListener("mouseenter", (() => {
                    i !== a && (a.style.backgroundColor = "rgba(65, 160, 160, 0.404)", a.style.cursor = "pointer")
                })),
                a.addEventListener("mouseleave", (() => { i !== a && (a.style.backgroundColor = "") })),
                a.addEventListener("click", (e => {
                    let div = document.getElementById("calDiv");
                    var t; null !== i && Object.assign(i.style, { backgroundColor: "", color: "" }),
                        Object.assign(a.style, { backgroundColor: "teal", color: "#FFF" }),
                        i = a,
                        t = e.target.date,
                        //n.value=`${t.getDate()}.${t.getMonth()+1}.${String(t.getFullYear()).slice(2,4)}`})),
                        n.value = `${t.getDate().toString().padStart(2, "0")}.${(t.getMonth() + 1).toString().padStart(2, "0")}.${String(t.getFullYear()).slice(2, 4)}`,
                        document.getElementById("formDateInput").value = n.value,
                        document.getElementById("calendar1").shadowRoot.querySelector("div").style.display = "none",
                        document.getElementById("calendar2").shadowRoot.querySelector("div").style.display = "none"
                })),
                //
                e.appendChild(a)
        }
    }
    const t = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        n = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    function i(t, i, o, a, s, l) {
        const r = document.createElement("button");
        return Object.assign(r.style, {
            backgroundColor: "transparent", border: "none", fontSize: "20px", transform: "scale(1,1)", height: "30px", lineHeight: "30px"
        }),
            r.addEventListener("mouseover", (() => { r.style.cursor = "pointer" })),
            r.addEventListener("click", (() => {
                t.set_time(new Date(t.get_time().getFullYear(), t.get_time().getMonth() + o)),
                    e(s, t, l),
                    a.textContent = n[t.get_time().getMonth()] + " " + t.get_time().getFullYear();
            })),
            r.textContent = i, r
    }
    function o() {
        this.time = new Date,
            this.get_time = function () {
                return this.time
            },
            this.set_time = function (e) { this.time = e }
    }
    class a extends HTMLElement {
        constructor() {
            super(),
                this.input = document.createElement("input"),
                this.input.type = "text",
                this.input.setAttribute("style", "border: 0; border-bottom: 2px solid #333;padding: 5px;font-size:18px;background-color: transparent;outline: none;transition: .3s;margin: 10px 0;width: 90%;border-radius: 0;");
            this.input.setAttribute("placeholder", "tt.mm.jj");
            this.input.setAttribute("id", "calInput");
            this.shadow = this.attachShadow({ mode: "open" });

            const e = document.createElement("style");
            e.textContent = ":host { all: inherit }",
                this.shadow.appendChild(e)
        } connectedCallback() {
            this.shadow.appendChild(this.input),
                this.container = function (a) {
                    const s = new o, [l, r, d, c] = function (e) {
                        const t = document.createElement("div"),
                            n = document.createElement("div"),
                            i = document.createElement("div"),
                            o = document.createElement("div");
                        return Object.assign(n.style, {
                            width: "280px", textAlign: "center", marginBottom: "10px", display: "flex", justifyContent: "space-between", height: "30px"
                        }),
                            Object.assign(o.style, { width: "280px", display: "flex", flexWrap: "wrap" }),
                            Object.assign(i.style, { width: "280px", display: "flex", flexWrap: "wrap" }),
                            Object.assign(t.style, { width: "280px", display: "none", padding: "20px", fontFamily: 'Calibri, "Trebuchet MS", Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif', boxShadow: "1px 3px 10px rgba(0, 0, 0, 0.2)", position: "absolute", zIndex: "3", backgroundColor: "white" }),
                            t.setAttribute("id", "calDiv"),
                            t.addEventListener("click", (e => e.stopPropagation())),
                            t.appendChild(n), t.appendChild(i),
                            t.appendChild(o), e.appendChild(t),
                            [t, n, i, o]
                    }
                        (a.parentNode);
                    return function (e, t, o, a) {
                        const s = document.createElement("div");
                        Object.assign(s.style, {
                            width: "150px", display: "inline-block", fontWeight: "bold", marginBottom: "5px", height: "30px", lineHeight: "30px"
                        }),
                            s.textContent = n[o.get_time().getMonth()] + " " + o.get_time().getFullYear();
                        const l = i(o, "<", -1, s, t, a),
                            r = i(o, ">", 1, s, t, a);
                        e.append(l, s, r)
                    }(r, c, s, a),
                        function (e) {
                            for (let n = 0; n < 7; n++) {
                                const i = document.createElement("div");
                                i.textContent = t[n],
                                    Object.assign(i.style, {
                                        textAlign: "center", width: "40px", height: "40px", color: "#696969", lineHeight: "40px"
                                    }),
                                    e.appendChild(i)
                            }
                        }
                            (d), e(c, s, a), l
                }(this.input),
                this.input.addEventListener("click", (e => e.stopPropagation())),
                this.input.addEventListener("focus", (() => { this.container.style.display = "block" })),
                window.addEventListener("click", (e => { this.container.style.display = "none" }))
        }
    }
    customElements.define("carbox-picker", a)
})();