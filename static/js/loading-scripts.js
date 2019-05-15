// Pre-select elements for performance
var moveable = $("#moveable");
var loader = $(".loader");
var dyn_body = $("#dynamic-body");
var $bar = $("#bar");

// Track current/requested page
var addressloc;

// For importing flask variables
function flask_return(vars) {
    return vars
}

// Timed progress bar
function InitPB(time_length) {
    var progress = setInterval(function () {

        if ($bar.width() >= 50) {
            clearInterval(progress);
        } else {
            $bar.width($bar.width() + 5);
        }

    }, time_length);
};

InitPB(800);

// Wait for window to load completely on first visit
$(window).on('load', function () {

    if (path == undefined) {
        // Redirect to error page if path undefined
        window.location.href = Flask.url_for("route_not_found");
    }
    else
    {
        if (path == "/") {
            // Redirect to index if root path is requested
            addressloc = Flask.url_for("index");
            path = "/index";
        }
        else {
            // Replace '-' with '_' for corresponding flask function
            addressloc = Flask.url_for(path.replace(/-/g, '_'));
        }
    }

    // Load requested contents
    dyn_body.load(addressloc);

    // Push new path to browser
    let stateObj = {foo: "bar"};
    window.history.pushState(stateObj, "Next", path);

    // Wait for all AJAX requests to complete
    $(document).ajaxStop(function () {

        // Fill bar completely
        $bar.animate({
            width: 50,
            duration: 100
        });

        // Hide loader and show page contents
        loader.delay(0).queue(function(){
            loader.removeClass("l-normal").addClass("l-upper");
        });
        moveable.delay(0).queue(function(){
            moveable.removeClass("m-lower").addClass("m-normal");
        });

    });
});

// For handling click events that require dynamic loading
$(document).on("click", '.transition', function(event) {

    // Stop hyperlink from redirecting
    event.preventDefault();

    // Get the link location
    addressloc = $(this).attr('href');

    // Load link contents dynamically
    redirectPage();

});

// For dynamically loading content with animation
function redirectPage() {

    // Push address to browser
    let stateObj = {foo: "bar"};
    // Address is sliced to remove '/static/' subroute
    window.history.pushState(stateObj, "Next", addressloc.slice(7));

    // Scroll user to top of page
    $('html,body').animate({scrollTop:0},300);

    // Show loader, hide page contents
    moveable.removeClass("m-normal").addClass("m-lower");
    loader.removeClass("l-upper").addClass("l-normal");

    // Initialise loading bar from zero
    $bar.width(0);

    // Wait for animation before loading content
    setTimeout(function() {
        dyn_body.load(addressloc);
    }, 1000);
    
    // Loading bar
    InitPB(400);

    // Wait for AJAX requests to complete
    $(document).ajaxStop(function () {

        // Fully fill bar to show completion
        $bar.animate({
            width: 50,
            duration: 100
        });

        // Hide loader and show new page contents
        $bar.promise().done(function() {
            loader.removeClass("l-normal").addClass("l-upper");
            moveable.removeClass("m-lower").addClass("m-normal");
        })
    
    });
};

// Override browser history stack changes
window.onpopstate = function() {
    window.location.href = location.href;
  };