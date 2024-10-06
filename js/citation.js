jQuery( document ).ready( function( $ ) {
        var elem = document.createElement( 'input' );

         elem.setAttribute( 'type', 'date' );
         if ( 'text' === elem.type ) {
                        $( '#mf2_start_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#mf2_end_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#cite_published_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#cite_updated_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });

                }
                elem.setAttribute( 'type', 'time' );
                if ( 'text' === elem.type ) {
                                $( '#mf2_start_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#mf2_end_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#cite_published_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#cite_updated_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });

                }
	$( '#duration' ).datepair();

function clearPostProperties() {
	var fieldIds = [
		'cite_url',
		'cite_name',
		'cite_summary',
		'cite_tags',
		'cite_media',
		'cite_author_name',
		'cite_author_url',
		'cite_author_photo',
		'cite_featured',
		'cite_publication',
		'mf2_rsvp',
		'mf2_start_time',
		'mf2_start_date',
		'mf2_end_time',
		'mf2_end_date',
		'cite_published_time',
		'cite_published_date',
		'cite_updated_time',
		'cite_updated_date',
		'duration_years',
		'duration_months',
		'duration_days',
		'duration_hours',
		'duration_minutes',
		'duration_seconds'
	];
		if ( ! confirm( PKAPI.clear_message ) ) {
			return;
		}
		$.each( fieldIds, function( count, val ) {
			document.getElementById( val ).value = '';
		});
		$( '#kind-media-container' ).addClass( 'hidden' );
		$( '#kind-media-container' ).children( 'img' ).hide();
		$( '#add-kind-media' ).show();

}

function addhttp( url ) {
	if ( ! /^(?:f|ht)tps?\:\/\//.test( url ) ) {
		url = 'http://' + url;
	}
	return url;
}

function showLoadingSpinner() {
	$( '#replybox-meta' ).addClass( 'is-loading' );
}

function hideLoadingSpinner() {
	$( '#replybox-meta' ).removeClass( 'is-loading' );
}

//function used to validate website URL
function checkUrl( url ) {

    //regular expression for URL
    var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;

    if ( pattern.test( url ) ) {
        return true;
    } else {
        return false;
    }
}

function getLinkCitation() {
	if ( '' === $( '#mf2_url' ).val() ) {
		return;
	}
	$.ajax({
		type: 'GET',

		// Here we supply the endpoint url, as opposed to the action in the data object with the admin-ajax method
		url: PKAPI.api_url + 'parse/',
		beforeSend: function( xhr ) {

		// Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
		xhr.setRequestHeader( 'X-WP-Nonce', PKAPI.api_nonce );
		},
		data: {
			url: $( '#mf2_url' ).val(),
			follow: true
		},
		success: function( response ) {
			var published;
			var updated;
			if ( 'undefined' === typeof response ) {
				alert( 'Error: Unable to Retrieve' );
				return;
			}
			if ( 'message' in response ) {
				alert( response.message );
				return;
			}
			if ( 'name' in response ) {
				$( '#title' ).val( response.name );
			}
			if ( 'publication' in response ) {
				$( '#mf2_publication' ).val( response.publication ) ;
			}
			if ( 'published' in response ) {
				published = moment.parseZone( response.published );
				$( '#mf2_published_date' ).val( published.format( 'YYYY-MM-DD' ) ) ;
				$( '#mf2_published_time' ).val( published.format( 'HH:mm:ss' ) ) ;
				$( '#mf2_published_offset' ).val( published.format( 'Z' ) );
			}
			if ( 'updated' in response ) {
				updated = moment.parseZone( response.updated );
				$( '#mf2_updated_date' ).val( updated.format( 'YYYY-MM-DD' ) ) ;
				$( '#mf2_updated_time' ).val( updated.format( 'HH:mm:ss' ) ) ;
				$( '#mf2_updated_offset' ).val( updated.format( 'Z' ) );
			}
			if ( 'summary' in response ) {
				$( '#excerpt' ).val( response.summary ) ;
			}
			if ( 'content' in response ) {
				$( '#content' ).val( response.content.text ) ;
			}
			if ( 'featured' in response ) {
				$( '#mf2_featured' ).val( response.featured ) ;
			}
			if ( ( 'author' in response ) && ( 'string' != typeof response.author ) ) {
				if ( 'name' in response.author ) {
					if ( 'string' === typeof response.author.name ) {
						$( '#mf2_author_name' ).val( response.author.name );
					} else {
						$( '#mf2_author_name' ).val( response.author.name.join( ';' ) ) ;
					}
				}
				if ( 'photo' in response.author ) {
					if ( 'string' === typeof response.author.name ) {
						$( '#mf2_author_photo' ).val( response.author.photo );
					} else {
						$( '#mf2_author_photo' ).val( response.author.photo.join( ';' ) ) ;
					}
				}
				if ( 'url' in response.author ) {
					if ( 'string' === typeof response.author.url ) {
						$( '#mf2_author_url' ).val( response.author.url );
					} else {
						$( '#mf2_author_url' ).val( response.author.url.join( ';' ) ) ;
					}
				}
			}
			if ( 'category' in response ) {
				if ( 'object' === typeof response.category ) {
					$( '#new-tag-citation_tags' ).val( response.category.join( ',' ) );
				}
			}
		alert( PKAPI.success_message );
		console.log( response );
		},
		fail: function( response ) {
			console.log( response );
			alert( response.message );
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			alert( jqXHR.responseJSON.message );
			console.log( jqXHR );
		},
		always: hideLoadingSpinner()
	});
}

jQuery( document )
	.on( 'click', '#lookup-citation', function( event ) {
		getLinkCitation();
		event.preventDefault();
	})
});
