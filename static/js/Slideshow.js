let slides = document.querySelectorAll(".mySlides");
let dots = document.querySelectorAll(".dot");

let current = 0;

function showSlides() {

    // Remove all classes
    slides.forEach(slide => {
        slide.classList.remove("active", "prev", "next", "hide");
        slide.classList.add("hide");
    });

    // Remove active dot
    dots.forEach(dot => dot.classList.remove("active"));

    // Previous and Next indexes
    let prev = (current - 1 + slides.length) % slides.length;
    let next = (current + 1) % slides.length;

    // Assign classes
    slides[current].classList.remove("hide");
    slides[current].classList.add("active");

    slides[prev].classList.remove("hide");
    slides[prev].classList.add("prev");

    slides[next].classList.remove("hide");
    slides[next].classList.add("next");

    // Active dot
    dots[current].classList.add("active");

    // Move to next slide
    current++;

    if (current >= slides.length) {
        current = 0;
    }
}

// Initial load
showSlides();

// Auto slide every 3 seconds
setInterval(showSlides, 3000);