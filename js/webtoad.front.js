// Init nette.ajax script ==================================================
var init = $.nette.ext('init');
init.linkSelector = 'a.ajax, a[data-ajax-confirm]';
$.nette.init();

// Google map ==============================================================

function getGeolocation(done) {

    var defaultPos = {
        lat: 50.0837831,
        lng: 14.4331742
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };


            done(pos);
        }, function() {
            done(defaultPos)
        });
    } else {
        done(defaultPos)
    }
}

function createMap(map, opt) {

    var url = opt.url;

    $.nette.ajax({
        url: url, success: function(payload) {

            var markers = payload.map(function(e) {

                return new google.maps.Marker({
                    position: new google.maps.LatLng(e.lon, e.lat),
                    map: map,
                    icon: opt.marker,
                    title: e.title
                });
            });

            var markerCluster = new MarkerClusterer(map, markers,
                { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });


            for (var i = 0, n = markers.length; i < n; i++) {
                var marker = markers[i];
                marker.addListener('click', function() {
                    window.location.href = marker.link;
                });
            }
        }
    });
}

function initMap() {

    // Map icons
    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.

    if ($('#google-map').length <= 0) return;

    getGeolocation(function(pos) {
        var loc = new google.maps.LatLng(pos);
        var options = { zoom: 10, center: loc, mapTypeId: google.maps.MapTypeId.ROADMAP };
        var map = new google.maps.Map(document.getElementById('google-map'), options);

        var url = $('#google-map').data('url');
        if (window.location.href.indexOf('localhost') !== -1) {
            url = './accidents.json';
        }


        createMap(map, {
            url: url,
            marker: {
                url: $('#google-map').data('marker'),
                anchor: new google.maps.Point(0, 32)
            }
        })
    });
}

/*
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
*/
