<?php

function theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', [] );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles', 20 );

function avada_lang_setup() {
	$lang = get_stylesheet_directory() . '/languages';
	load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );



add_shortcode('getquoteformrecord','getquoteformrecord_func');

function getquoteformrecord_func() {
    $moving_in_address = '';
    if(isset($_GET['moving_in_address']) && $_GET['moving_in_address'] != '') {
      $moving_in_address = $_GET['moving_in_address'];
    }
    $moving_out_address = '';
    if(isset($_GET['moving_out_address']) && $_GET['moving_out_address'] != '') {
      $moving_out_address = $_GET['moving_out_address'];
    }
    $moving_date = '';
    if(isset($_GET['moving_date']) && $_GET['moving_date'] != '') {
      $moving_date = $_GET['moving_date'];
    }
    
    $runscript = '
                <script>
                   jQuery(function(){
                      jQuery("#moving_in_address").val("'.$moving_in_address.'");
                      jQuery("#moving_out_address").val("'.$moving_out_address.'");
                      jQuery("#moving_date").val("'.$moving_date.'");
                   });
                </script>
    ';
    
	return $runscript;
}