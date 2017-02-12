function create(id, htmlStr) {
    var frag = document.createDocumentFragment();
    var temp = document.createElement('tr');
    temp.id = id;
    temp.innerHTML = htmlStr;
    return temp;
}
var artists = [];
var tracks = [];
var main = function () {
    var xhttp = new XMLHttpRequest();
    var table = document.getElementById("now-playing-table");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var new_tracks = JSON.parse(xhttp.responseText);
            var new_new_tracks = [];
            var dead_new_tracks = [];
            for (var i = 0; i < new_tracks.length; i++) {
                var found = false;
                for (var j = 0; j < tracks.length; j++) {
                    var id1 = tracks[j]['id'];
                    var id2 = new_tracks[i]['id'];
                    found = found || (id1 == id2);
                }
                if (!found) {
                    new_new_tracks.unshift(new_tracks[i]);
                }
            }

            for (var i = 0; i < tracks.length; i++) {
                var found = false;
                for (var j = 0; j < new_tracks.length; j++) {
                    var id1 = tracks[i]['id'];
                    var id2 = new_tracks[j]['id'];
                    found = found || (id1 == id2);
                }
                if (!found) {
                    dead_new_tracks.unshift(tracks[i]);
                }
            }
            console.log(new_new_tracks);
            console.log(dead_new_tracks);
            for (var $i = 0; $i < new_new_tracks.length; $i ++)
            {
                var data = new_new_tracks[$i];
                var artist_part = data.artist;
                if ('artist_id' in data)
                {
                    artist_part = '<a href="https://musicbrainz.org/artist/'+data['artist_id']+'">'+artist_part+'</a>';
                }
                artist_part += ' - ' + (('title' in data)?data.title:'*********');

                var album_part = data.album+(('date' in data)?('(' + data['date'] + ')'):'');
                if ('album_id' in data)
                {
                    album_part = '<a href="https://musicbrainz.org/album/'+data['album_id']+'">'+album_part+'</a>';
                }
                var elem = create(data['id'], '<td class="title-and-artist2" style="text-align: right">' + 
                        artist_part + '</td><td class="album-title2" style="text-align: left">' + 
                        album_part + '</td>');
                elem.className += ' newtrack';
                if (table.childNodes.length > 0) {
                    table.insertBefore(elem, table.childNodes[0]);
                } else {
                    table.appendChild(elem);
                }
                setTimeout(function(elem){ 
                    elem.className = elem.className.replace(/ *\bnewtrack\b */, ''); 
                    console.log("Clearing newtrack on " + elem.id);
                }, 100, elem)
            }
            for (var i = 0; i < dead_new_tracks.length; i++) {
                var elem = document.getElementById(dead_new_tracks[i]['id']);
                elem.parentNode.removeChild(elem);
            }
            tracks = new_tracks;
        }
    };
    xhttp.open("GET", "res/ext/now-playing.json", true);
    xhttp.send();

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == 4 && xhttp2.status == 200) {
            var artists = JSON.parse(xhttp2.responseText);
            var s = '';
            if (artists.length == 0)
            {
                s = '別に。';
            } else {
                for (var $i = 0; $i < artists.length; $i ++)
                {
                    var data = artists[$i];
                    s += '<div style="font-size:' + Math.round(Math.sqrt(data[1]) * 20) + '%">' + data[0] + '</div>';
                }
            }
            document.getElementById("favorite-artists").innerHTML = s;
        }
    };
    xhttp2.open("GET", "res/ext/favorite-artists.json", true);
    xhttp2.send();
};

