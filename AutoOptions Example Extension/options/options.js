const r = document.getElementById('reset');
r.addEventListener("click", function() {
    r.innerText = "Done!";
    r.style.cssText = "color: green; pointer-events: none";
    setTimeout(()=> {
        r.innerText = "Reset to default!";
        r.removeAttribute('style');
    }, 1000);
})