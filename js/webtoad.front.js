
$().ready(function() {


    console.log("askdkjsabdkjbsa");
    return ;

    // Init nette.ajax script ==================================================
    var init = $.nette.ext('init');
    init.linkSelector = 'a.ajax, a[data-ajax-confirm]';
    $.nette.init();

    // Google map ==============================================================

    // Map icons
    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    var gmapMarker = {
        url: $('#google-map').data('marker'),
        // Posunuti
        anchor: new google.maps.Point(0, 32)
    };

    (function($) {

        if ($('#google-map').length <= 0) return;

        var loc = new google.maps.LatLng(50.0837831, 14.4331742);
        // Set options
        var options = { zoom: 10, center: loc, mapTypeId: google.maps.MapTypeId.ROADMAP };

        // Google map
        var map = new google.maps.Map(document.getElementById('google-map'), options);

        $.nette.ajax({
            url: $('#google-map').data('url'), success: function(payload) {
                $(payload).each(function(i, e) {
                    // Create marker
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(e.lon, e.lat),
                        map: map,
                        icon: gmapMarker,
                        title: e.title
                    });

                    // Handle click
                    google.maps.event.addListener(marker, 'click', function() {
                        window.location.href = e.link;
                    });
                });
            }
        });
    })(jQuery);

    // Placeholder tweak ========================================================
    if (!Modernizr.input.placeholder) {

        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
        $('[placeholder]').parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });

    }
});
