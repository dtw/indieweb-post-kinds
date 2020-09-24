<?php
wp_nonce_field( 'replykind_metabox', 'replykind_metabox_nonce' );
$kind_post = new Kind_Post( get_the_ID() );
$kind = $kind_post->get_kind();
$type     = Kind_Taxonomy::get_kind_info( $kind, 'property' );
$cite     = $kind_post->get_cite();
$attachment = 0;
$time = array();
$summary = '';

if ( ! is_array( $cite ) ) {
	$cite = empty( $cite ) ? array() : array( $cite );
}
if ( empty( $cite ) ) {
	if ( array_key_exists( 'kindurl', $_GET ) && wp_http_validate_url( $_GET['kindurl'] ) ) {
		$cite = array( 'url' => $_GET['kindurl'] );
	}
}

$duration = divide_iso8601_duration( $kind_post->get_duration() );
if ( in_array( $kind, array( 'audio', 'video', 'photo' ) ) ) {
	if ( isset( $cite['url'] ) ) {
		$attachment = attachment_url_to_postid( $cite['url'] );
	} else if ( wp_is_numeric_array( $cite ) ) {
		$attachment = attachment_url_to_postid( $cite[0]  );
	}
} 
if ( $attachment ) {
	$attachment_post = new Kind_Post( $attachment );
	$cite = $attachment_post->get_cite();
}

if ( ! wp_is_numeric_array( $cite ) ) {
	$cite = mf2_to_jf2( $cite );
	$author = ifset( $cite['author'], array() );
	if ( 1 === count( $author ) && wp_is_numeric_array( $author ) ) {
		$author = array_pop( $author );
	}
	if ( is_string( $author ) ) {
		$author = array( 'name' => $author );
	}

	if ( isset( $author['name'] ) && is_array( $author['name'] ) ) {
		$author['name'] = implode( ';', $author['name'] );
	}
	if ( isset( $author['url'] ) && is_array( $author['url'] ) ) {
		$author['url'] = implode( ';', $author['url'] );
	}
	if ( isset( $cite['summary'] ) ) {
		if ( is_array( $cite['summary'] ) && array_key_exists( 'html', $cite['summary'] ) ) {
			$summary = $cite['summary']['html'];
		} else if ( is_string( $cite['summary'] ) ) {
			$summary = $cite['summary'];
		}
	}

	if ( isset( $cite['category'] ) ) {
			$tags = $cite['category'];
		if ( is_array( $tags ) ) {
			$tags = implode( ';', $tags );
		}
	} else {
		$tags = '';
	}
}



// FIXME: Discards extra URLs as currently unsupported
if ( isset( $cite['url'] ) && is_array( $cite['url'] ) ) {
			$cite['url'] = array_shift( $cite['url'] );
}
?>
<a href="#kind-details" class="show-kind-details button hide-if-no-js"><?php _e( 'Details', 'indieweb-post-kinds' ); ?></a>
<a href="#kind-author" class="show-kind-author-details button hide-if-no-js"><?php _e( 'Author', 'indieweb-post-kinds' ); ?></a>
<a id="add-kind-media" class="button hide-if-no-js hidden" href="javascript:;">Upload or Attach Media</a>
<button class="clear-kindmeta-button button hide-if-no-js"><?php _e( 'Clear', 'indieweb-post-kinds' ); ?></button>
<p class="field-row">
	<label for="cite_url" class="three-quarters">
		<?php _e( 'URL', 'indieweb-post-kinds' ); ?>
			<input type="text" name="cite_url" id="cite_url" class="widefat" value="<?php echo ifset( $cite['url'] ); ?>" />
	</label>
</p>
<p class="field-row">
	<label for="cite_name" class="three-quarters">
		<?php _e( 'Name', 'indieweb-post-kinds' ); ?>
			<input type="text" name="cite_name" id="cite_name" class="widefat" value="<?php echo ifset( $cite['name'] ); ?>" />
	</label>
</p>
<p class="field-row hide-if-js" id="rsvp-option">
	<?php echo Kind_Metabox::rsvp_select( $kind_post->get( 'rsvp' ) ); ?>
</p>
<p id="kind-media hide-if-no-js">
<?php $show_media = ( isset( $cite['url'] ) && in_array( $kind, array( 'photo', 'audio', 'video' ) ) ); ?>
<div id="kind-media-container" <?php echo ( $show_media ) ? '' : 'class="hidden"'; ?> >
<?php if ( $attachment ) {
	if ( wp_attachment_is( 'image', $attachment ) ) {
		echo wp_get_attachment_image( $attachment );
	}
	elseif ( wp_attachment_is( 'audio', $attachment ) ) {
		$view = new Kind_Media_View( $attachment, 'audio' );
		echo $view->get();
	}
	elseif ( wp_attachment_is( 'video', $attachment ) ) {
		$view = new Kind_Media_View( $attachment, 'video' );
		echo $view->get();
	}
} ?>
	</div>
	<input type="hidden" id="cite_media" name="cite_media" value="<?php echo $attachment; ?>" >
</p>


<?php require_once 'reply-details.php'; ?>
<?php require_once 'reply-author.php'; ?>

	<div class="loading">
		<img src="<?php echo esc_url( includes_url( '/images/wpspin-2x.gif' ) ); ?>" class="loading-spinner" />
	</div>

<?php
