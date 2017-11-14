'use strict';
var WAHOME_BASE_URL = '';
// var WAHOME_BASE_URL = 'http://localhost:3000';
//var WAHOME_BASE_URL = 'http://olot-dev.cloudapp.net:3000';
var INDEX_PATH  = 'index';
var LOGIN_PATH = 'login';
var PROFILE_PATH = 'profile';
var BOOKINGS = 'bookings';
var BOOKING_STEP1 = 'booking_step1';
var BOOKING_STEP2 = 'booking_step2';
var BOOKING_STEP3 = 'booking_step3';

var WAHOME_TOKEN_KEY = 'WAHOME_TOKEN_KEY';
var WAHOME_CREATE_ACCOUNT_FORM_KEY = 'WAHOME_CREATE_ACCOUNT_FORM_KEY';
var WAHOME_CREATE_BOOKING_FORM_KEY = 'WAHOME_CREATE_BOOKING_FORM_KEY';

var D1_ID = "d1";
var W1_ID = "w1";
var W1D1_ID = "w1d1";
var W2D1_ID = 'w2d1';
var W4D1_ID = 'w4d1';
var PERIOD_IDS = [W1_ID, W1D1_ID, D1_ID];

var getToken = function(){
	var token_str = localStorage.getItem( WAHOME_TOKEN_KEY );
	try{
		var token = JSON.parse( token_str );
		if( token && token.access_token && token.user ){
			return token;
		}
		return null;
	}catch( e ){
		return null;
	}
};
var saveToken = function( token ){
	localStorage.setItem( WAHOME_TOKEN_KEY, JSON.stringify( token ) );
};
var removeToken = function(){
	localStorage.removeItem( WAHOME_TOKEN_KEY );
};

var setAccessTokenToHeader = function( access_token ){
	$.ajaxSetup({
		headers: {
			'Authorization': 'Bearer ' + access_token
		}
	});
};
var removeAccessTokenFromHeader = function(){
	$.ajaxSetup({
		headers: {
			'Authorization': null
		}
	});
};

var getCreateAccountForm = function(){
	var createAccountForm_str = localStorage.getItem( WAHOME_CREATE_ACCOUNT_FORM_KEY );
	try{
		var createAccountForm = JSON.parse( createAccountForm_str );
		if( createAccountForm ){
			return createAccountForm;
		}
		return null;
	}catch( e ){
		return null;
	}
};
var saveCreateAccountForm = function( createAccountForm ){
	localStorage.setItem( WAHOME_CREATE_ACCOUNT_FORM_KEY, JSON.stringify( createAccountForm ) );
};
var removeCreateAccountForm = function(){
	localStorage.removeItem( WAHOME_CREATE_ACCOUNT_FORM_KEY );
};


var setLogin = function( token ){
	saveToken( token );
	setAccessTokenToHeader( token.access_token );
	$( '#button_logout' ).text( '로그아웃' );
};
var setLogout = function(){
	removeToken();
	removeAccessTokenFromHeader();
	$( '#button_logout' ).text( '로그인' );
};

var getHttpErrorText = function( error ){
    if( error &&
    	error.status == 400 &&
    	error.responseJSON != null &&
        error.responseJSON.errors &&
        error.responseJSON.errors.length > 0 &&
        error.responseJSON.errors[ 0 ].message ) {

        return error.responseJSON.errors[ 0 ].message;
    }
    return null;
};

/*
*	About booking fuction
*/
var CLEANING_TIME_STATUS_BEFORE = 1;
var CLEANING_TIME_STATUS_DOING = 2;
var CLEANING_TIME_STATUS_DONE = 3;
var getBookingCleaningTimeStatus = function( booking ){
    if( booking.cleaning_time_status == CLEANING_TIME_STATUS_BEFORE ){
        return CLEANING_TIME_STATUS_BEFORE;
    }
    if( booking.complete_at_by_helper == null ){
        return CLEANING_TIME_STATUS_DOING;
    }
    return CLEANING_TIME_STATUS_DONE;
};
var getBookingCleaningTimeStatusString = function( booking ){
    if( getBookingCleaningTimeStatus( booking ) == CLEANING_TIME_STATUS_BEFORE ){
        return "현재 헬퍼가 청소를 준비중입니다.";
    }
    if( getBookingCleaningTimeStatus( booking ) == CLEANING_TIME_STATUS_DOING ){
        return "현재 헬퍼가 청소를 하고 있습니다.";
    }
    if( getBookingCleaningTimeStatus( booking ) == CLEANING_TIME_STATUS_DONE ){
        return "청소가 종료되었습니다.";
    }
    return "";
};
var getTimeString = function( time ){
    if( !time ){
        return "0시간";
    }

    var hour = parseInt(time);
    var minute = parseInt((time - hour) * 60);

    if( hour == 0 ){
        return minute + "분";
    }

    if( minute == 0 ){
        return hour + "시간";
    }

    return hour + "시간 " + minute + "분";
};

var getCreateBookingForm = function(){
	var createBookingForm_str = localStorage.getItem( WAHOME_CREATE_BOOKING_FORM_KEY );
	try{
		var createBookingForm = JSON.parse( createBookingForm_str );
		if( createBookingForm && createBookingForm.waclean ){
			return createBookingForm;
		}
		return null;
	}catch( e ){
		return null;
	}
};
var saveCreateBookingForm = function( createBookingForm ){
	localStorage.setItem( WAHOME_CREATE_BOOKING_FORM_KEY, JSON.stringify( createBookingForm ) );
};
var removeCreateBookingForm = function(){
	localStorage.removeItem( WAHOME_CREATE_BOOKING_FORM_KEY );
};

var PRICE_TESTING_KEY = 'PRICE_TESTING_KEY';
var PRICE_TESTING_VAF = 'VAF';
var PRICE_TESTING_SF = 'SF';
var getPricingTestData = function(){
    return PRICE_TESTING_VAF;
    // A/B 테스팅을 진행했었음. Conversion rate : VAF 가 2.5%정도 높게 나왔음
//	var pricingTestKey = localStorage.getItem( PRICE_TESTING_KEY );
//	if( !pricingTestKey || pricingTestKey.length < 1 ){
//		var random = Math.floor(Math.random() * 9) % 2
//		if( random ){
//			localStorage.setItem( PRICE_TESTING_KEY, PRICE_TESTING_VAF );
//			return PRICE_TESTING_VAF;
//		}
//		localStorage.setItem( PRICE_TESTING_KEY, PRICE_TESTING_SF );
//		return PRICE_TESTING_SF;
//	}
//	return pricingTestKey;
};

/*
*	Common Functions
*/
var validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};


$( document ).ready( function(){
	/*
	*	Initiallize
	*/
	var token = getToken();
	if( token ){
		setLogin( token );
		$('#layout_menu_profile').show();
	}else{
		setLogout();
		$('#layout_menu_profile').hide();
	}
	getPricingTestData();

	moment.locale('ko');
	/*
	*	Events
	*/
	$( '#button_logout' ).on( 'click', function( e ){
		e.preventDefault();
		var token = getToken();
		if( token ){
			setLogout();
			window.location.href = INDEX_PATH;
		}else{
			window.location.href = LOGIN_PATH;
		}
	});

});
