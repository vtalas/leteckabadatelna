// Init nette.ajax script ==================================================
var init = $.nette.ext('init');
init.linkSelector = 'a.ajax, a[data-ajax-confirm]';
$.nette.init();

var utils = {
    isDev: (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('vtalas') !== -1),
    getJsonUrl: function() {
        return this.isDev ? './accidents.json' : $('#google-map').data('url');
    },
    getAccidentUrl: function(link) {

        var base = this.isDev ? 'http://www.leteckabadatelna.cz/' : document.URL;
        if (link && link[0] === '/') {
            link = link.substr(1);
        }
        return base + link;
    }
};

function getGeolocation(done) {

    // prague
    var defaultPos = {
        lat: 50.0837831,
        lng: 14.4331742
    };

    if (!navigator.geolocation) {
        return done(defaultPos);
    }

    navigator.geolocation.getCurrentPosition(function(position) {

        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, function(data, status) {

            if (status !== 'OK') {
                return done(defaultPos);
            }

            var country = data.filter(function(a) {
                return a.types.indexOf('country') !== -1;
            })[0];
            (country && country.formatted_address === 'Czechia') ? done(pos) : done(defaultPos);

        });
    }, function() {
        done(defaultPos)
    });
}

function createMap(map, opt) {

    var url = opt.url;

    $.nette.ajax({
        url: url, success: function(payload) {

            var markers = payload.map(function(e) {

                var mark = new google.maps.Marker({
                    position: new google.maps.LatLng(e.lon, e.lat),
                    map: map,
                    icon: opt.marker,
                    title: e.title
                });

                mark.addListener('click', function() {
                    window.open(utils.getAccidentUrl(e.link), '_blank')
                });

                return mark;
            });

            var markerCluster = new MarkerClusterer(map, markers,
                { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        }
    });
}

function initMap() {

    if ($('#google-map').length <= 0) return;

    getGeolocation(function(pos) {
        var loc = new google.maps.LatLng(pos);
        var options = { zoom: 10, center: loc, mapTypeId: google.maps.MapTypeId.ROADMAP };
        var map = new google.maps.Map(document.getElementById('google-map'), options);

        var url = utils.getJsonUrl();
        createMap(map, {
            url: url,
            marker: {
                url: $('#google-map').data('marker'),
                anchor: new google.maps.Point(0, 32)
            }
        });

        var marker = new google.maps.Marker({
            position: loc,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5
            }
        });

    });
}

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
