var slice = Array.prototype.slice; var pages = [
    { title: "Intro", id: "intro_page" },
    { title: "Contact", id: "contact_page" },
    { title: "FAQ", id: "faq_page" }
];
var index = 0;

function resize_elements() {
    // Get container width, doc width, calc margin width
    var cw = document.getElementById("container").clientWidth;
    var dw = document.width;
    var width = (dw - cw) / 2;
    
    var pages = slice.call(document.getElementsByClassName('slider'), 1);
    pages.forEach(function(page) {
      page.style.webkitTransform = "translate3d("+ dw +"px, 0, 0)";
    });
    
    var elements = document.getElementsByClassName('nav-btn');
    var iterable = slice.call(elements,0);
    iterable.forEach(function(el) {
        el.style.width = width + "px";
    });
    
    if(dw <= cw) {
      iterable.forEach(function(el) {
          el.classList.add('ghost');
      });
    } else {
      iterable.forEach(function(el) {
          el.classList.remove('ghost');
      });
    }
    
    var right = document.getElementById("right_indicator");
    var left = document.getElementById("left_indicator");
    set_indicators(left,right);
}

function keyed_navigation(e) {
  if(e.keyCode == 39) {
      navigate(true);
  } else if (e.keyCode == 37) {
      navigate(false);
  }
}

function navigate(advance) {
    // `advance` means user clicked next, slider should slide to left (negative).
    var dw = document.width;
    var right = document.getElementById("right_indicator");
    var left = document.getElementById("left_indicator");
    var original = document.getElementById(pages[index].id);
    
    if(advance) {
        if( (index+1) <= (pages.length-1)) {
            index++;            
            left.classList.remove('ghost');
            
            var next = document.getElementById(pages[index].id);
            original.style.webkitTransform = "translate3d(-"+ dw +"px, 0, 0)";
            if(next) next.style.webkitTransform = "translate3d(0px, 0, 0)";
        } else {
            left.classList.remove('ghost');
            right.classList.add('ghost');
        }
    } else {
        if( (index) > 0 ) {
            index--;
            right.classList.remove('ghost');
            
            var prev = document.getElementById(pages[index].id);
            original.style.webkitTransform = "translate3d("+ dw +"px, 0, 0)";
            if(prev) prev.style.webkitTransform = "translate3d(0px, 0, 0)";
        } else {
            right.classList.remove('ghost');
            left.classList.add('ghost');
        }
    }
    set_indicators(left,right);
}

function set_indicators(left, right){
  if(index == 0) {
      left.classList.add('ghost');
  } else if(index == pages.length-1) {
      right.classList.add('ghost');
  }
  
  // unselect current
  var selected = document.getElementsByClassName('list-nav selected')[0];
  selected.classList.remove('selected');
  
  // add current index
  selected = document.getElementsByClassName(pages[index].id)[0];
  selected.classList.add('selected');
}

function init() {

    document.addEventListener("click", function(e) {
        if(e.target.classList.contains('next')) {
            navigate(true);
        }
        else if (e.target.classList.contains('prev')) {
            navigate(false);
        }
    }, true);
    
    document.getElementById("chkNeverShow")
    .addEventListener("change", function(evt) {
        var checked = evt.target.checked;
        // TODO: save option
    });
    
    resize_elements();
}

window.addEventListener("DOMContentLoaded", init, true);
window.addEventListener("resize", resize_elements, true);
window.addEventListener("keyup", keyed_navigation, true);
