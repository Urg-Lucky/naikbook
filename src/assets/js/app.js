

jQuery('toggle-menu').on('click',function(){
    jQuery('.sidebar').toggle(500);
})

if ($.fn.owlCarousel) {
    var parnetSlider = $('.partner-slider');
    parnetSlider.owlCarousel({
        items: 7,
        loop: true,
        autoplay: false,
        smartSpeed: 2700,
        margin: 5,
        dots: true,
        responsive: {
            320: {
                items: 3
            },
            480: {
                items: 4
            },
            576: {
                items: 3
            },
            768: {
                items: 4
            },
            1024: {
                items: 5
            },
            1200: {
                items: 6
            },
            1350: {
                items: 7
            }
        }
    });
}


// tab scroll start

const sportScroll = document.getElementById("sprot-box");

if (sportScroll !== null) {
    let isDragging = false;
    let startX, scrollLeft;

    sportScroll.addEventListener("mousedown", function (e) {
        isDragging = true;
        startX = e.pageX - sportScroll.offsetLeft;
        scrollLeft = sportScroll.scrollLeft;
    });

    sportScroll.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sportScroll.offsetLeft;
        const walk = (x - startX) * 3; // adjust the scroll speed
        sportScroll.scrollLeft = scrollLeft - walk;
    });

    sportScroll.addEventListener("mouseup", function (e) {
        isDragging = false;
    });
}



// tab scroll end

// toggle menu start

// jQuery('.toggle-menu').on('click',function(){
//     jQuery('.sidebar').toggle(500);
// })

// jQuery('toggle-menu').on('click', function() {
//     var sidebar = jQuery('.sidebar');
//     if (sidebar.is(':visible')) {
//         sidebar.hide(500); // Hides the dashboard-nav
//     } else {
//         sidebar.show(500); // Shows the dashboard-nav
//     }
// });


const toggleMenu = document.getElementById("toggle-menu");
const sidebar = document.querySelector(".sidebar");
toggleMenu.addEventListener("click", () => {
    toggleMenu.classList.toggle("active");
    sidebar.classList.toggle("active");
    content.classList.toggle("active");
});

window.addEventListener("resize", () => {
    const isSizeMatch = window.matchMedia("(min-width:768px)");
    console.log(isSizeMatch.matches);
    if (isSizeMatch.matches) {
        toggleMenu.classList.add("active");
        sidebar.classList.add("active");
        content.classList.remove("active");
    } else {
        toggleMenu.classList.remove("active");
        sidebar.classList.remove("active");
    }
});

window.onload = () => {
    const isSizeMatch = window.matchMedia("(min-width:768px)");
    if (!isSizeMatch.matches) {
        sidebar.classList.remove("active");
    } else {
        sidebar.classList.add("active");
    }
};

// toggle menu end

// tab start

const sportTab = document.querySelectorAll(".sport__slide__btn");
sportTab.forEach((e) => {
    e.addEventListener("click", () => {
        sportTab.forEach((el) => el.classList.remove("active"));
        if (!e.classList.contains("active")) {
            tabList(e.getAttribute("data-tab"));
            e.classList.add("active");
        }
    });
});

const tabList = (id) => {
    const allTabList = document.querySelectorAll("#sport__list");
    allTabList.forEach((el) => {
        const listNo = el.getAttribute("data-tab-list");
        if (listNo === id) {
            allTabList.forEach((e) => e.classList.remove("active"));
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
};

// tab end

const allCollapseBtn = document.getElementById("all-match-collapse");
const allCollapseBox = document.querySelector(".all__match__list__box");

if (allCollapseBtn !== null && allCollapseBox !== null) {
    allCollapseBtn.addEventListener("click", () => {
        allCollapseBox.classList.toggle("active");
        allCollapseBtn.classList.toggle("active");
    });
}

const allMatchTab = document.querySelectorAll("#all-match-tab");

allMatchTab.forEach((el) => {
    el.addEventListener("click", () => {
        const parentEl = el.closest(".all__match__list");
        const list = parentEl.querySelector(".all__match__content");
        // allMatchTab.forEach((e) =>
        //     e
        //         .closest(".all__match__list")
        //         .querySelector(".all__match__content")
        //         .classList.remove("active")
        // );
        list.classList.toggle("active");
        list.style.backgroundColor = el.getAttribute("data-color");
    });
});

const oneClickBetting = document.getElementById("oneClickBetting");
if (oneClickBetting !== null) {
    oneClickBetting.addEventListener("change", () => {
        const collapseBox = document.getElementById("market-num");
        const toggleEdit = document.querySelector(".market__toggle__edit");
        collapseBox.classList.toggle("active");
        toggleEdit.classList.toggle("active");
    });
}

const marketListToggle = document.getElementById("market-list-toggle");

if (marketListToggle !== null) {
    marketListToggle.addEventListener("click", () => {
        const markListBottom = document.querySelector(".market__list__bottom");
        markListBottom.classList.toggle("active");
    });
}

const tags = document.querySelectorAll(".all__match__content__tag button");

if (tags !== null) {
    tags.forEach((el) => {
        el.addEventListener("mouseover", () => {
            tags.forEach((e) => e.classList.remove("active"));
            el.classList.add("active");
        });
    });
}

const allRightCollapse = document.querySelectorAll("#all-right-collapse");

if (allRightCollapse !== null) {
    allRightCollapse.forEach((el) => {
        el.addEventListener("click", () => {
            const info = el.closest(".all__match__bar__right-2");
            info.classList.toggle("active");
            el.classList.toggle("active");
        });
    });
}


$(document).ready(function(){
    $(".mobileOpenbtn").hide();
});
    $(document).on('click','.homeBT',function(){
    //    $("#toggle-slow").hide();
       $(".mobileOpenbtn").toggle();
    });
    // $(document).on('click','.mobileOpenbtn',function(){
    //     $("#mobileOpenbtn").hide();
    //     $("#toggle-slow").show();
    //     $(".toggle-slow").toggle();
    //  });
    