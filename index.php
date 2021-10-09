<?php

/*
    Plugin Name: Quick Quiz
    Description: Gauge readers attention by giving quick quiz
    Version: 1.0
    Author: Aryan Singh
    AUthor URI: https://aryansi225.gihub.io/
*/

if (! defined('ABSPATH')) exit; //Cannot access plugin by visiting the url directly

class QuickQuiz{
    function __construct(){
        add_action('init', array($this, 'adminAssets'));
    }

    function adminAssets(){
        wp_register_style('quickquizcss', plugin_dir_url(__FILE__).'build/index.css');
        wp_register_script('quickquizblock', plugin_dir_url(__FILE__).'build/index.js', array('wp-blocks','wp-element','wp-editor'));
        register_block_type('myplugin/quick-quiz', array(
            'editor_script' => 'quickquizblock',
            'editor_style' => 'quickquizcss',
            'render_callback' => array($this, 'theHTML')
        ));
    }

    function theHTML($attributes) {
        if(!is_admin()){
            wp_enqueue_script('quickquizfrontend', plugin_dir_url(__FILE__).'build/frontend.js', array('wp-element'));
            wp_enqueue_style('quickquizfrontendcss', plugin_dir_url(__FILE__).'build/frontend.css');
        }

        ob_start(); ?>
        <div class="quickquizupdate"><pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre></div>
        <?php return ob_get_clean();
    }
}

$quickQuiz = new QuickQuiz();