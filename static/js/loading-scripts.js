function flask_return(vars) {
    return vars
}

var current_path;
var current_mode = 'standard';

var progress = setInterval(function () {

    var $bar = $("#bar");

    if ($bar.width() >= 50) {
        clearInterval(progress);
    } else {
        $bar.width($bar.width() + 5);
    }

}, 800);

var moveable = $("#moveable");
var loader = $(".loader");

$(window).on('load', function () {

    var path = c_page;

    if (path != undefined)
    {
        // window.location.replace(window.location.origin);
        if (path == "/")
        {
            addressloc = Flask.url_for("index");
            path = "/index";
        }
        else
        {
            addressloc = Flask.url_for(path.replace(/-/g, '_'));
        }
        // path = "/" + path;
    }
    else
    {
        addressloc = Flask.url_for("index");
        path = "/index";
    }

    current_path = addressloc;
    $("#dynamic-body").load(addressloc);
    let stateObj = {foo: "bar"};
    window.history.pushState(stateObj, "Next", path);

    $(document).ajaxStop(function () {

        $("#bar").animate({
            width: 50,
            duration: 100
        });

        loader.delay(0).queue(function(){
            loader.removeClass("l-normal").addClass("l-upper");
        });
        moveable.delay(0).queue(function(){
            moveable.removeClass("m-lower").addClass("m-normal");
        });

    });
});

$(document).on("click", '.transition', function(event) {
    event.preventDefault(); // Stop hyperlink
    addressloc = $(this).attr('href'); // Get hyperlink location
    redirectPage(addressloc);
});

function redirectPage(redirection, cond = 'null') {

    addressloc = redirection;

    if (cond == 'null')
    {
        let stateObj = {foo: "bar"};
        window.history.pushState(stateObj, "Next", addressloc.slice(7));
    }
    else
    {
        let stateObj = {foo: "bar"};
        window.history.pushState(stateObj, "Next", "/index");
    }

    $('html,body').animate({scrollTop:0},300); // Scroll to top

    moveable.removeClass("m-normal").addClass("m-lower");
    loader.removeClass("l-upper").addClass("l-normal");
    $("#bar").width(0);

    setTimeout(function() {
        $("#dynamic-body").load(addressloc);
        current_path = addressloc;
    }, 1000);
    
    var progress = setInterval(function () {
        var $bar = $("#bar");

        if ($bar.width() >= 50) {
            clearInterval(progress);
        } else {
            $bar.width($bar.width() + 5);
        }
    }, 400);

    $(document).ajaxStop(function () {

        $("#bar").animate({
            width: 50,
            duration: 100
        });

        $("#bar").promise().done(function() {
            loader.removeClass("l-normal").addClass("l-upper");
            moveable.removeClass("m-lower").addClass("m-normal");
        })
    
        _ajax_end_callback(cond);
    });
};

function _ajax_end_callback(cond)
{
    if (cond == 'null')
    {
        $("#about-div").removeAttr("style");
        $(".features").removeAttr("style");
        $(".p-tile").removeAttr("style");
        return;
    }
    else if (cond == 'work')
    {
        $("#about-div").removeAttr("style");
        $(".features").removeAttr("style");

        $(".p-tile").css("display", "none");
        return;
    }
    else if (cond == 'contact')
    {
        $(".p-tile").removeAttr("style");

        $("#about-div").css("display", "none");
        $(".features").css("display", "none");
        return;
    }
}

$(document).on("click", '#nav-work', function(event) {
    event.preventDefault();

    if (current_path == "/index" && current_mode != 'contact')
    {
        $(".p-tile").animate({height: 0, margin: 0, padding: 0}, 1000);

        setTimeout(function() {
            $(".p-tile").css("display", "none")
        }, 1000);
    } else {
        redirectPage(Flask.url_for("index"), 'work');
    }

    current_mode = 'work';

});

$(document).on("click", '#nav-contact', function(event) {
    
    event.preventDefault();

    if (current_path == "/index" && current_mode != 'work')
    {
        $("#about-div").animate({height: 0, margin: 0, padding: 0}, 1000);
        $(".features").animate({height: 0, margin: 0, padding: 0}, 1000);

        setTimeout(function() {
            $("#about-div").css("display", "none");
            $(".features").css("display", "none");
        }, 1000);
    } else {
        redirectPage(Flask.url_for("index"), 'contact');
    }

    current_mode = 'contact';

});

window.onpopstate = function() {
    window.location.href = location.href;
  };