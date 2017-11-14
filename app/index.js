$( document ).ready( function(){
	$( '#google-map' ).on( 'click', function( e ){
		window.location.href = "https://www.google.co.kr/maps/place/서울특별시+마포구+잔다리로+88/@37.5551889,126.9136242?hl=ko";
	});
	var referral = getUrlVars()[ 'referral' ];
	if( referral && referral.length ){
		ga('send', 'event', 'referral', referral );
        mixpanel.register_once({'Source': referral});
	}

    var refreshToken = function() {
        if( !token.refresh_token ){
            setLogout();
            alert('다시 로그인 해주세요.');
            window.location.href = LOGIN_PATH;
            return;
        }

        isWorking = true;
        $.ajax({
                type : 'POST',
                url : WAHOME_BASE_URL + '/api/token',
                data : {
                    refresh_token : token.refresh_token,
                    type : 'user'
                }
            })
            .done( function( data ){
                setLogin( data );
                token = data;
            })
            .fail( function( jqXhr, status ){
                return;
            });
    }

    var token = getToken();
    if( token ){
        refreshToken();
        return;
    }
});
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
