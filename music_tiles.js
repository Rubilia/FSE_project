let bg;
let preview_src = 'assets/tiles_preview.jpg';
let game = 0;
let music_tiles_btn_start = null;
let drive_dodge_btn_start = null;
let object_dragging_btn_start = null;
let shapes_btn_start = null;
let main_menu_start_btn = null;
let preview_imgs;

// Shapes
let shapes_font;
let shapes_score = 0;

// Hyperparameters
const canvas_width = 1000;
const canvas_height = 1300;
const tile_size_x = 200;

let tile_speed = 630;
let active_screen = 0;
/* 
0 - main menu of the game
1 - main menu + animation of settings menu (open animation)
2 - main_menu + settings menu on top of it
3 - game
4 - game over screen (with and without animation)
*/

let CHandler;
let game_score = 0;

// Variables for gradient background
const min_bg_brightness = 70;
const max_bg_saturation = 80;
let bg_color_change_speed_1 = [-.3, .1, -.1];
let bg_color_change_speed_2 = [.1, -.3, .1];

let bg_c1 = [0, 0, 100];
let bg_c2 = [210, 100, 80];

// Variables gor buttons and etc
let canvas;

// Preloaded images
let settings_img;
let start_btn;
let level_btns = [];
let nyan_cat_gif;
let sound_icon;
let game_over_img;
let fire_gif;
let logo_font;
let quit_btn;

// Music variables
let fft;
let src_length;
let lvl_music_1, lvl_music_2, lvl_music_3;
let fail_music;
let win_music;

let onsetLow, onsetLowMid, onsetMid;

let is_music = true;

function draw() {
    // Execute all pending callbacks
    CHandler.execute();
}

function setup() {
    // Preload images
    preload_images();

    // Initialize variables
    CHandler = new CallHandler();
    CHandler.add_callable("main_menu_menu_draw", main_menu_menu_draw, -1, {});

    canvas = createCanvas(canvas_width, canvas_height);
    canvas.mouseClicked(mouseClicked);

    // Add tasks to draw basic UI
}

function main_menu_menu_draw(args){
    document.body.classList.add('main_menu_bg');

    // Draw game buttons
    image(music_tiles_btn_start, 100, 500, 250, 250);
    CHandler.add_clickable_region("start_music_tiles", (() => {
        return (abs(mouseX - 225) <= 125 && abs(mouseY - 625) <= 60);
    }), (() => {    
        preview_src = 'assets/tiles_preview.jpg';
        game = 0;
    }), {});


    // image(drive_dodge_btn_start, 100, 640, 250, 250);
    // CHandler.add_clickable_region("start_drive_dodge", (() => {
    //     return (abs(mouseX - 225) <= 125 && abs(mouseY - 765) <= 60);
    // }), (() => {    
    //     preview_src = 'assets/not_implemented.webp';
    //     game = 1;
    // }), {});


    image(object_dragging_btn_start, 100, 640, 250, 250);
    CHandler.add_clickable_region("start_object_dragging", (() => {
        return (abs(mouseX - 225) <= 125 && abs(mouseY - 765) <= 60);
    }), (() => {    
        preview_src = 'assets/not_implemented.webp';
        game = 2;
    }), {});



    image(shapes_btn_start, 100, 780, 250, 250);
    CHandler.add_clickable_region("start_shapes", (() => {
        return (abs(mouseX - 225) <= 125 && abs(mouseY - 905) <= 60);
    }), (() => {    
        preview_src = 'assets/not_implemented.webp';
        game = 3;
    }), {});

    // Draw preview
    textSize(50);
    fill('white');
    text('Preview', 580, 260);
    
    image(preview_imgs[preview_src], 460, 300, 460, 800);
    
    // Draw start_btn
    if (main_menu_start_btn == null){
        main_menu_start_btn = createButton('<span>🇸​​​​​🇹​​​​​🇦​​​​​🇷​​​​​🇹​​​​​</span>');
        main_menu_start_btn.style("vertical-align:middle")
        main_menu_start_btn.class("game_over_btn")
        main_menu_start_btn.position(canvas_width / 2 + 30, canvas_height - 190);
        main_menu_start_btn.mouseClicked(() => {
            main_menu_start_btn.hide();
            if (game == 0){
                CHandler.reset_callbacks();
                main_menu_handler();
                document.body.classList.remove('main_menu_bg');
            }
            else if (game == 3){
                CHandler.reset_callbacks();
                CHandler.add_callable('main_menu_shapes', draw_shapes_menu, -1, {"first":true});
                canvas.class('shapes_back');
                document.body.classList.remove('main_menu_bg');
            }
            else if (game == 2){
                CHandler.reset_callbacks();
                CHandler.add_callable('object_dragging_game', draw_object_dragging, -1, {});
                CHandler.add_clickable_region('object_dragging', (() => {return true;}), mouseClicked_object_dragging, {});
                document.body.classList.remove('main_menu_bg');
              }
            else{
                return;
            }
            main_menu_start_btn.hide();
            setTimeout(() => {
              main_menu_start_btn.hide();
              main_menu_start_btn = null;
            }, 200);
        });
    }
    
    return args;
}

function preload_images(){
    settings_img = loadImage('assets/settings_tiles_icon.png');
    settings_img.resize(80, 80);

    start_btn = loadImage('assets/button_start.png');
    start_btn.resize(400, 120);

    quit_btn = loadImage('assets/quit_btn.png');

    sound_icon = loadImage('assets/sound_icon.png')

    level_btns = [loadImage('assets/btn_lvl_1.png'), loadImage('assets/btn_lvl_2.png'), loadImage('assets/btn_lvl_3.png')];
    nyan_cat_gif = loadImage('assets/nyan_cat.gif');

    logo_font = loadFont("assets/Fonts/zorque.otf");

    game_over_img = loadImage('assets/game_over.jpeg');

    // Preload music
    lvl_music_1 = loadSound('assets/music/lvl1.mp3');
    lvl_music_2 = loadSound('assets/music/lvl2.mp3');
    lvl_music_3 = loadSound('assets/music/lvl3.mp3');

    fail_music = loadSound('assets/music/fail.wav');
    win_music = loadSound('assets/music/win.wav');

    bg = loadImage('assets/background.jpg');

    music_tiles_btn_start = loadImage('assets/music tiles btn.png');
    drive_dodge_btn_start = loadImage('assets/drive and dodge.png');
    object_dragging_btn_start = loadImage('assets/object dragging.png');
    shapes_btn_start = loadImage('assets/shape.png');

    preview_imgs = {'assets/tiles_preview.jpg': loadImage('assets/tiles_preview.jpg'), 'assets/not_implemented.webp': loadImage('assets/not_implemented.webp')};
    shapes_font = loadFont('assets/Fonts/pdark.ttf');
    quit_btn = loadImage('assets/quit_btn.png');
}

// Handles all mouse clicks through CallHandler
function mouseClicked() {
    CHandler.execute_click();
}

function main_menu_handler(){
  CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {});
  CHandler.add_callable("random_tiles_animation", draw_random_tiles, -1, {"tiles_manager": new TileManager(), "idle": 8})
  CHandler.add_callable("random_nyan_cat", ((args) => {
    args["timer"] -= 1;
    if (args["timer"] == 0){
        // Start nyan cat animation
        nyan_cat_gif.play();
        CHandler.add_callable("nyan_cat_animation", ((animation_args) => {
            let x = animation_args["x"];
            let y = animation_args["y"];
            image(nyan_cat_gif, x, y, 875, 360);
            x += 10;
            animation_args["x"] = x;
            return animation_args;
        }), 180, {"x": -300, "y": int(random(100, canvas_height - 100))});
        args["timer"] = int(random(300, 800));
    }
    return args;
  }), -1, {"timer": 10});
  CHandler.add_callable("draw_main_menu", draw_main_menu, -1, {"settings_angle": 0, "angle_rate": PI / 30, "do_rotation": false, "show_start_btn": true, "show_level_buttons": false});
}
 
  function draw_random_tiles(args){
    args["idle"] -= 1;
    manager = args["tiles_manager"];
    
    if (args["idle"] == 0){
        try{
            corridor = random([0, 1, 2, 3]);
            tile_size = random([new TileSizes(tile_size_x, 200), new TileSizes(tile_size_x, 400), new TileSizes(tile_size_x, 600), new TileSizes(tile_size_x, 800)]);

            manager.add_tile(corridor, tile_size);
            args["idle"] = int(random(40, 100));
        } catch(ex){
            console.log(ex);
        }
    }

    manager.move(deltaTime);
    return args;
  }

  function draw_settings_window(args){
    // Darken everything else
    fill(0, 0, 0, 120);
    rect(0, 0, canvas_width, canvas_height);

    if (args["sound_btn"] == 0){
          // Start backwards animation
          args["close_btn"].mouseClicked(() => {
          if (active_screen != 2){
              return;
          }
    
          // Add callable for animation
          CHandler.add_callable("animation_settings_menu", settings_window_animation, 80, {"t": 80, "alpha": 120, "forward": false, "close_btn": args["close_btn"]});
          CHandler.remove_callback("draw_settings_window");
          args["sound_btn"].hide();
        });

        sound_callback = (() => {
          args["sound_btn"].hide();
  
          if (is_music){
              args["sound_btn"] = createImg('assets/no_sound.jpg');
          }
          else{
            args["sound_btn"] = createImg('assets/sound.jpg');
          }
          args["sound_btn"].size(80, 80);
          args["sound_btn"].position(canvas_width / 2 - 50, 420);
          args["sound_btn"].mouseClicked(sound_callback);
          args["sound_btn"].class("sound_btn");
          is_music = !is_music;
      });
        if (is_music){
          args["sound_btn"] = createImg('assets/sound.jpg');
          args["sound_btn"].position(canvas_width / 2 - 50, 420);
          args["sound_btn"].mouseClicked(sound_callback);
        }
        else {
            args["sound_btn"] = createImg('assets/no_sound.jpg');
            args["sound_btn"].position(canvas_width / 2 - 50, 420);
            args["sound_btn"].mouseClicked(sound_callback);
        }
        args["sound_btn"].class("sound_btn");
        args["sound_btn"].size(80, 80);
    }

    // Draw the window itself
    fill("#0EB2B8");
    stroke(2);
    rect(canvas_width / 2 - 300, 300, 600, 460);

    args["close_btn"].position(canvas_width / 2 - 100, 650);
    return args;
  }

  function settings_window_animation(args){
    if (args["forward"]){
        t = args["t"] + 1;
        a = min(args["alpha"] + 4, 120);
    }
    else{
        t = args["t"] - 1;
        a = max(args["alpha"] - 4, 0);
        args["close_btn"].mouseClicked((() => {}));
    }

    // Darken everything else
    fill(0, 0, 0, a);
    rect(0, 0, canvas_width, canvas_height);

    // Draw options menu
    let y_pos = 900 * (1 - exp(-t / 10)) - 600;
    fill("#0EB2B8");
    stroke(2);
    rect(canvas_width / 2 - 300, y_pos, 600, 460);

    if (t == 1 && args["forward"]){

        args["close_btn"] = createA("#", '<div class="liquid"></div><span>Save</span>')
        args["close_btn"].position(100, 400);

        // Start backwards animation
        args["close_btn"].mouseClicked(() => {
            if (active_screen != 2){
              return;
            }

            // Add callable for animation
            CHandler.add_callable("animation_settings_menu", settings_window_animation, 80, {"t": 80, "alpha": 120, "forward": false, "close_btn": args["close_btn"]});
            CHandler.remove_callback("draw_settings_window");
          
        });
    }
    args["close_btn"].position(canvas_width / 2 - 100, y_pos + 350);

    if (args["reps_left"] == 0 && args["forward"]){
        CHandler.add_callable("draw_settings_window", draw_settings_window, -1, {"close_btn": args["close_btn"], "sound_btn": 0});
        CHandler.remove_callback("animation_settings_menu");
        active_screen = 2;
    }
    else if (args["reps_left"] == 0 && !args["forward"]){
        active_screen = 0;
        CHandler.remove_callback("animation_settings_menu");
        args["close_btn"].hide();
        // CHandler.reset_callbacks();
        // main_menu_handler();
    }
    
    args["t"] = t;
    args["alpha"] = a;
    return args;
  }

  function draw_main_menu(args){
    // Draw the name of the game
    fill("grey");
    noStroke();
    textFont(logo_font);
    textSize(100);
    text("Music Tiles", canvas_width / 2 - 300, 250)

    // Draw settings button!

    // Rotation
    translate(canvas_width - 60, canvas_height - 60);
    imageMode(CENTER);

    
    if (args["do_rotation"]){
        angle = args["settings_angle"] + args["angle_rate"];  
        rotate(angle);
    }

    let identify_region_callback = (() => {
        if (!(active_screen == 0 || active_screen == 1)) return false;
        return (dist(mouseX, mouseY, canvas_width - 60, canvas_height - 60)) <= 70;
    });

    let button_pressed_callbak = ((args) => {
        if (CHandler.does_callback_exist("delayed_disable_settings_rotation")){
            return args;
        }
        // Function called when settings button is clicked
        if (active_screen != 0){
          return args;
        }
        
        active_screen = 1;

        // Allow rotation of settings button
        args_ = CHandler.get_internal_state("draw_main_menu");
        args_["do_rotation"] = true;
        args_["settings_angle"] = 0;
        CHandler.update_internal_state("draw_main_menu", args_);

        // Create a task to disable rotation after 360 rotation
        CHandler.add_callable("delayed_disable_settings_rotation", ((args) => {
            args["counter"] -= 1;
            if (args["counter"] == 0){
                args_ = CHandler.get_internal_state("draw_main_menu");
                args_["do_rotation"] = false;
                CHandler.update_internal_state("draw_main_menu", args_);
            }
            return args;
        }), 60, {"counter": 60});

        // Run animation for settings menu
        CHandler.add_callable("animation_settings_menu", settings_window_animation, 80, {"t": 0, "alpha": 0, "forward": true});
        return args;
    });

    image(settings_img, 0, 0, 80, 80);
    CHandler.add_clickable_region("settings_btn_click", identify_region_callback, button_pressed_callbak, {});

    if (args["do_rotation"]){
        rotate(-angle);
        args["settings_angle"] = angle;
    }
    translate(60 - canvas_width, 60 - canvas_height);

    // Draw return button
    image(quit_btn, 50, canvas_height - 50, 80, 80);
    CHandler.add_clickable_region("quit_btn", ((args) => {
        return abs(mouseX - 50) <= 40 && abs(mouseY - canvas_height + 50);
    }), ((args) => {
        location.reload();
        // CHandler.reset_callbacks();
        // CHandler.add_callable("main_menu_menu_draw", main_menu_menu_draw, -1, {});
        return args;
    }), {});


    // Draw buttons
    if (args["show_start_btn"]){

        image(start_btn, canvas_width / 2, canvas_height / 2, 420, 124);

        CHandler.add_clickable_region("start_button", (() => {
          if (!(active_screen == 0)){
              return false
          }
          return abs(mouseX - canvas_width / 2) < 210 && abs(mouseY - canvas_height / 2) < 62;
        }), ((args_start_btn) => {
              if (!args_start_btn["clickable"] || (active_screen == 1)) {return args_start_btn; }

              // Button can only be pressed once - disable its rendering
              args["show_start_btn"] = false;
              args_start_btn["clickable"] = false;

              // Start animation

              CHandler.add_callable("start_button_flies_away", start_btn_animation, 75, {"t": 0, "w": 0, "lvl_delay": 30});

              return args_start_btn;
        }), {"clickable": true});
    }
    else if (args["show_level_buttons"]){
        // Place level buttons
        let music = [lvl_music_1, lvl_music_2, lvl_music_3]
        for (let i = 0; i < 3; i++){
          image(level_btns[i], canvas_width / 2, canvas_height / 2 + 200 + (i - 1) * 200, 440, 124);
        }

        // Lvl 1
        CHandler.add_clickable_region("lvl1_start", (() => {
            return (active_screen == 0 && abs(mouseX - canvas_width / 2) <= 220 && abs(mouseY - canvas_height / 2 + 200 * 0) <= 124 / 2)
        }), ((args) => {
            // Switch to game mode
            active_screen = 3;
            CHandler.reset_callbacks();
            
            CHandler.add_callable("start_music", start_music, 1, {"music": music[0]});
            CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {});
            let manager = new TileManager(true)
            manager.make_clickable();

            onsetLow = new OnsetDetect(40,120,"bass",0.003);
            onsetLowMid = new OnsetDetect(140,400,"lowMid",0.003);
            onsetMid = new OnsetDetect(400,2600,"Mid",0.003);

            CHandler.add_callable("draw_game_tiles", draw_game_tiles, -1, {"tiles_manager": manager, "idle": 1, "bass": onsetLow, "lowMid": onsetLowMid, "Mid": onsetMid, "occupied": [0, 0, 0, 0], "music": music[0]});
            tile_speed = 800;
      }), {});

        // Lvl 2
        CHandler.add_clickable_region("lvl2_start", (() => {
          return (active_screen == 0 && abs(mouseX - canvas_width / 2) <= 220 && abs(mouseY - canvas_height / 2 - 200 * 1) <= 124 / 2)
      }), ((args) => {
          // Switch to game mode
          active_screen = 3;
          CHandler.reset_callbacks();
          
          CHandler.add_callable("start_music", start_music, 1, {"music": music[1]});
          CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {});
          let manager = new TileManager(true)
          manager.make_clickable();

          onsetLow = new OnsetDetect(40,120,"bass",0.003);
          onsetLowMid = new OnsetDetect(140,400,"lowMid",0.003);
          onsetMid = new OnsetDetect(400,2600,"Mid",0.003);

          CHandler.add_callable("draw_game_tiles", draw_game_tiles, -1, {"tiles_manager": manager, "idle": 1, "bass": onsetLow, "lowMid": onsetLowMid, "Mid": onsetMid, "occupied": [0, 0, 0, 0], "music": music[1]});
          tile_speed = 800;
      }), {});

        // Lvl 3
        CHandler.add_clickable_region("lvl3_start", (() => {
          return (active_screen == 0 && abs(mouseX - canvas_width / 2) <= 220 && abs(mouseY - canvas_height / 2 - 200 * 2) <= 124 / 2)
      }), ((args) => {
          // Switch to game mode
          active_screen = 3;
          CHandler.reset_callbacks();
          
          CHandler.add_callable("start_music", start_music, 1, {"music": music[2]});
          CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {});
          let manager = new TileManager(true)
          manager.make_clickable();

          onsetLow = new OnsetDetect(40,120,"bass",0.003);
          onsetLowMid = new OnsetDetect(140,400,"lowMid",0.003);
          onsetMid = new OnsetDetect(400,2600,"Mid",0.003);

          CHandler.add_callable("draw_game_tiles", draw_game_tiles, -1, {"tiles_manager": manager, "idle": 1, "bass": onsetLow, "lowMid": onsetLowMid, "Mid": onsetMid, "occupied": [0, 0, 0, 0], "music": music[2]});
          tile_speed = 800;
      }), {});
    }
    
    return args;
  }

  function start_music(args){
    fft = new p5.FFT();
    fft.setInput(args["music"]);
    if (!is_music){
        args["music"].setVolume(0.003);
    }
    else{
      args["music"].setVolume(1);
    } 
    args["music"].play();

    return args;
  }
  
class OnsetDetect{
    constructor(f1,f2,str,thresh){
        this.isDetected = false;
        this.f1=f1;
        this.f2=f2;
        this.str = str;
        this.treshold = thresh;
        this.energy = 0;
        this.penergy = 0;
        this.skip = 0;
        this.delay = 0;
    }

    update(fftObject) {
      if (this.delay >= 1){
        this.delay -= 1;
        this.skip -= (this.skip > 0)? 1: 0;
        if (this.delay == 1){
          this.isDetected = true;
        }
      }
      if (this.skip > 0 & this.delay == 0){
          this.skip -= 1;
          this.isDetected = false;
          return;
      }

      this.energy = fftObject.getEnergy(this.f1,this.f2)/255;
  
      if(this.isDetected == false){
          if (this.energy-this.penergy > this.treshold || this.energy > 1 - this.treshold){
              //this.isDetected = true;
              this.delay = 20;
              this.skip = 60;
          }
      }
  
      this.penergy = this.energy;
  }
}

function draw_game_tiles(args){
    args["idle"] -= 1;
    manager = args["tiles_manager"];

    fft.analyze();

    args["bass"].update(fft);
    args["lowMid"].update(fft);
    args["Mid"].update(fft);

    let c = ((args["bass"].isDetected) ? 1: 0) + ((args["lowMid"].isDetected) ? 1: 0) + ((args["Mid"].isDetected) ? 1: 0);
    if (c == 3){
        c -= 1;
    }
    let i = c;
    let corridors = [];
    let sizes = [200, 300, 500];
    let t_size = new TileSizes(tile_size_x, sizes[c]);

    c = min(c, args["occupied"].filter(v => v === 0).length);

    // Choose corridors
    while (i > 0){
      let corridors_av = [];
        for (let j = 0; j < 4; j++){
            if (args["occupied"][j] == 0){
                append(corridors_av, j);
            }
        }
        let corridor = random(corridors_av);
        if (!corridors.includes(corridor)){
            i -= 1;
            append(corridors, corridor);
            args["occupied"][corridor] = 30;
        }
    }
    

    for (let i = 0; i < c; i++){
        manager.add_tile(corridors[i], t_size, true, (() => {
            game_score += 10 * c;
        }));
    }
    
    for (let i = 0; i < 4; i++){
        if(args["occupied"][i] > 0){
            args["occupied"][i] -= 1;
        }
    }

    manager.move(deltaTime);

    fill("grey");
    noStroke();
    textFont(logo_font);
    textSize(50);
    text(game_score, canvas_width / 2 - 35, 70);

    if (args["music"].currentTime()>=args["music"].duration()-0.05 && manager.tiles.length == 0){
        CHandler.reset_callbacks();
        CHandler.add_callable("game_won", game_won_screen, -1, {"first": true, "t": 0});
    }

    return args;
}

function game_won_screen(args){
  lvl_music_1.stop();
  lvl_music_2.stop();
  lvl_music_3.stop();

  if (args["first"]){
      win_music.play();
      fireworks_gif = loadImage('assets/fireworks.gif');
      fireworks_gif.play();
      args["first"] = false;
  }
    // Draw main screen
    background("black");
    fill("grey");
    noStroke();
    textFont(logo_font);
    textSize(130);
    text("YOU WON!", canvas_width / 2 - 400, 300);
    textSize(70);
    text("Score: " + game_score, canvas_width / 2 - 390, 380);
    // Draw animation if applicable
    t = args["t"]

    // Fire animation
    image(fireworks_gif, canvas_width / 2, canvas_height + 319 * exp(-t / 4) - 562 / 2, canvas_width, 562)

    if (t == 0){
        let a = createButton('<span>ℝ𝕖𝕥𝕦𝕣𝕟</span>');
        a.style("vertical-align:middle")
        a.class("game_over_btn")
        a.position(canvas_width / 2 - 115, canvas_height - 360);
        a.mouseClicked(() => {
            a.hide();
            CHandler.reset_callbacks();
            main_menu_handler();
            active_screen = 0;
            game_score = 0;
        });

        args["ret_btn"] = a
    }

    args["t"] = min(args["t"] + 1, 60);

    return args;
}

function start_btn_animation(args){
    t = args["t"] + 1;
    w = args["w"] + PI / 100;
    imageMode(CENTER);
    rotate(w);
    x_offset = t * 2;
    y_offset = t * t;
    image(start_btn, canvas_width / 2 + t, canvas_height / 2 - y_offset, 420, 124);
    rotate(-w);

    if (t >= args["lvl_delay"]){
      for (let i = 0; i < 3; i++){
          image(level_btns[i], canvas_width / 2, (canvas_height / 2 + 200 + (i - 1) * 200) + canvas_height / 2 * exp(-(t - args["lvl_delay"])/ 8) / ((t - args["lvl_delay"]) / 6 + 1), 440, 124);
      }
    }

    args["t"] = t;
    args["w"] = w;
    
    // Enable drawing of level buttons
    if (args["reps_left"] == 0){
        args_main_menu = CHandler.get_internal_state("draw_main_menu");
        args_main_menu["show_level_buttons"] = true;
        args_main_menu["show_start_btn"] = false;
        CHandler.update_internal_state("draw_main_menu", args_main_menu);
    }

    return args;
}

class CallHandler{
  constructor(){
    this.callables = [];
    this.internal_states = [];

    this.click_callables = [];
    this.click_internal_states = [];

    this.pending_callables = [];
    this.pending_states = [];
    this.clear_after_iteration = false;
  }

  reset_callbacks(){
    this.clear_after_iteration = true;
  }

  does_callback_exist(name){
    for (let i = 0; i < this.callables.length; i++){
      // Remove callables with a given name
      if (name == this.callables[i][2])
        return true;
    }
    return false;
  }

  get_internal_state(name){
    for (let i = 0; i < this.callables.length; i++){
      // Remove callables with a given name
      if (name == this.callables[i][2])
        return this.internal_states[i];
    }
    return {};
  }

  update_internal_state(name, args){
    for (let i = 0; i < this.callables.length; i++){
      // Remove callables with a given name
      if (name == this.callables[i][2])
        this.internal_states[i] = args;
    }
  }

  add_clickable_region(name, is_inside_callable, click_callable, args){
    // Remove a callbacks with the same name
    this.remove_clickable_region(name);

    args["call_handler"] = this;
    args["name"] = name;

    append(this.click_callables, [is_inside_callable, click_callable, name]);
    append(this.click_internal_states, args);
  }

  // Function to remove callables by name
  remove_clickable_region(name){
    let new_click_callables = [];
    let new_click_internal_states = [];
    for (let i = 0; i < this.click_callables.length; i++){
      // Remove callables with a given name
      if (name == this.click_callables[i][2])
        continue;
  
      // If a callable has a different name - ignore it
      append(new_click_callables, this.click_callables[i]);
      append(new_click_internal_states, this.click_internal_states[i]);
    }

    this.click_callables = new_click_callables;
    this.click_internal_states = new_click_internal_states;
  }

  add_callable(name, callable, repetitions, args={}){
    args["call_handler"] = this;
    args["name"] = name;
    args["reps_left"] = repetitions;

    append(this.pending_callables, [callable, repetitions, name]);
    append(this.pending_states, args);
  }

  // Executes callables from list, updates internal states and number of reps left
  execute(){
    let new_callables = [];
    let new_states = [];
    let i = 0;
    while (i < this.callables.length){
      let call = this.callables[i][0];
      let reps = this.callables[i][1];
      reps -= (reps == -1? 0: 1);

      let previous_state = this.internal_states[i];
      previous_state["reps_left"] = reps;
      
      let state = call(previous_state);
      if (reps > 0 || reps == -1){
        append(new_callables, [call, reps, this.callables[i][2]]);
        append(new_states, state);
      }
      i++;
    }
    if (this.clear_after_iteration){
      this.clear_after_iteration = false;
      this.callables = [];
      this.internal_states = [];

      this.click_callables = [];
      this.click_internal_states = []
    }
    else{
      this.callables = new_callables;
      this.internal_states = new_states;
    }

    // Update list of callables
    for(let i = 0; i < this.pending_callables.length; i++){
        if (this.does_callback_exist(this.pending_callables[i][2])){
            continue; 
        }
        append(this.callables, this.pending_callables[i]);
        append(this.internal_states, this.pending_states[i]);
    }
    this.pending_callables = [];
    this.pending_states = [];
  }

  // Execute a given callbacks if user clickes inside a given region
  execute_click(){
    for (let i = 0; i < this.click_callables.length; i++){
      let is_inside_callable = this.click_callables[i][0];
      if (!is_inside_callable(this.click_internal_states[i]))
        continue;

      let call = this.click_callables[i][1];

      this.click_internal_states[i] = call(this.click_internal_states[i]);
    }
  }

  // Function to remove callables by name
  remove_callback(name){
    let new_callables = [];
    let new_internal_states = [];
    for (let i = 0; i < this.callables.length; i++){
      // Remove callables with a given name
      if (name == this.callables[i][2])
        continue;

      // If a callable has a different name - ignore it
      append(new_callables, this.callables[i]);
      append(new_internal_states, this.internal_states[i]);
    }
    this.callables = new_callables;
    this.internal_states = new_internal_states;
  }
}

function draw_gradient_background(args){
  if (main_menu_start_btn != null){
      main_menu_start_btn.hide();
      main_menu_start_btn = null;
  }
  // Check whether the mode is correct
  if (!(active_screen == 0 || active_screen == 1 || active_screen == 2 || active_screen == 3))
    return;

  // Switch to HSB
  colorMode(HSB, 360, 100, 100);

  let c1 = color(bg_c1[0], bg_c1[1], bg_c1[2]);
  let c2 = color(bg_c2[0], bg_c2[1], bg_c2[2]);

  for(let y=0; y<canvas_height; y++){
    n = map(y,0,canvas_height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,canvas_width, y);
  }

  noStroke();

  // Change colors
  bg_c1[0] = (bg_c1[0] + (bg_color_change_speed_1[0] * random(0.8, 1.2)));
  if (bg_c1[0] <= 0 || bg_c1[0] >= 360){
    bg_color_change_speed_1[0] *= -1;
    bg_c1[0] = max(0, min(bg_c1[0], 360));
  }
    
  bg_c2[0] = (bg_c2[0] + (bg_color_change_speed_2[0] * random(0.8, 1.2)));
  if (bg_c2[0] <= 0 || bg_c2[0] >= 360){
    bg_color_change_speed_2[0] *= -1;
    bg_c2[0] = max(0, min(bg_c2[0], 360));
  }

  bg_c1[1] = (bg_c1[1] + (bg_color_change_speed_1[1] * random(0.8, 1.2)));
  if (bg_c1[1] <= 0 || bg_c1[1] >= max_bg_saturation){
    bg_color_change_speed_1[1] *= -1;
    bg_c1[1] = max(0, min(bg_c1[1], max_bg_saturation));
  }

  bg_c2[1] = (bg_c2[1] + (bg_color_change_speed_2[1] * random(0.8, 1.2)));
  if (bg_c2[1] <= 0 || bg_c2[1] >= max_bg_saturation){
    bg_color_change_speed_2[1] *= -1;
    bg_c2[1] = max(0, min(bg_c2[1], max_bg_saturation));
  }

  bg_c1[2] = (bg_c1[2] + (bg_color_change_speed_1[2] * random(0.8, 1.2)));
  if (bg_c1[2] <= min_bg_brightness || bg_c1[2] >= 100){
    bg_color_change_speed_1[2] *= -1;
    bg_c1[2] = max(min_bg_brightness, min(bg_c1[2], 100));
  }

  bg_c2[2] = max((bg_c2[2] + (bg_color_change_speed_2[2] * random(0.8, 1.2))));
  if (bg_c2[2] <= min_bg_brightness || bg_c2[2] >= 100){
    bg_color_change_speed_2[2] *= -1;
    bg_c2[2] = max(min_bg_brightness, min(bg_c2[2], 100));
  }

  // Switch back to RGB
  colorMode(RGB, 255, 255, 255, 255);

  return args;
}

function game_over_screen(args){
  lvl_music_1.stop();
  lvl_music_2.stop();
  lvl_music_3.stop();

  if (args["first"]){
      fail_music.play();
      fire_gif = loadImage('assets/fire.gif');
      fire_gif.play();
      args["first"] = false;
  }
    // Draw main screen
    // textAlign(CENTER);
    background("black");
    fill("grey");
    noStroke();
    textFont(logo_font);
    textSize(130);
    text("GAME OVER!", canvas_width / 2 - 400, 300);
    textSize(70);
    text("Score: " + game_score, canvas_width / 2 - 390, 380);
    // Draw animation if applicable
    t = args["t"]

    // Fire animation
    image(fire_gif, canvas_width / 2, canvas_height + 319 * exp(-t / 4) - 562 / 2, canvas_width, 562)

    if (t == 0){
        let a = createButton('<span>ℝ𝕖𝕥𝕦𝕣𝕟</span>');
        a.style("vertical-align:middle")
        a.class("game_over_btn")
        a.position(canvas_width / 2 - 115, canvas_height - 360);
        a.mouseClicked(() => {
            a.hide();
            CHandler.reset_callbacks();
            main_menu_handler();
            active_screen = 0;
            game_score = 0;
        });

        args["ret_btn"] = createButton('<span>Return</span>');
    }

    args["t"] = min(args["t"] + 1, 60);

    return args;
}

class TileManager{
  constructor(clickable=false){
      this.tiles = []
      this.tile_callables = {};
      this.clickable = clickable;
  }

  make_clickable(){
    if (this.clickable){
        CHandler.add_callable("tile_manager_click", this.tiles_click, -1, {"manager": this});
    }
  }

  add_tile(corridor, size, clickable=false, click_callback=null){
    try{
        let tile_id = int(random(10, 1000000));
        append(this.tiles, new Tile(size.size_x, size.size_y, tile_speed, corridor, tile_id, clickable));
        if (clickable && this.clickable){
          this.tile_callables[tile_id] = click_callback;
        }
    } catch(ex){
        console.log(ex);
    }
  }

  tiles_click(args){
    let manager = args["manager"];
    let tiles = manager.tiles;
      for (let i = 0; i < tiles.length; i++){

        if (!tiles[i].is_clickable()){
            continue;
        }
        if (abs(mouseX - tiles[i].x) <= tiles[i].size_x && abs(mouseY - tiles[i].y) <= tiles[i].size_y){
            manager.tile_callables[tiles[i].get_id()]({"manager": manager, "id": tiles[i].get_id()});
            manager.delete_tile(tiles[i].get_id());
        }
      }
      
      return args;
  }

  delete_tile(id){
      let new_tiles = [];
      for(let i = 0; i < this.tiles.length; i++){
          if (this.tiles[i].get_id() != id){
              append(new_tiles, this.tiles[i]);
          }
      }
      this.tiles = new_tiles;
  }

  move(dt){
      if (active_screen == 3){
          let a = 0;
      }
      let tmp_tiles = [];

      // Check for game over
      for (let i = 0; i < this.tiles.length; i++){
        if (this.clickable && this.tiles[i].y + this.tiles[i].size_y >= canvas_height){
          CHandler.reset_callbacks();
          this.tiles = [];
          this.tile_callables = {};

          // Draw game over screen
          CHandler.add_callable("game_over_screen", game_over_screen, -1, {"t": -10, "first": true});
          return;
        }
      }
      for(let i = 0 ; i < this.tiles.length ;i++){
        this.tiles[i].move(dt)
        if (!this.tiles[i].is_out()){
          append(tmp_tiles, this.tiles[i]);
        }
      }
      this.tiles = tmp_tiles;
      
      // Draw borders
      fill("grey");
      noStroke();
      rect(98, 0, 2, canvas_height);
      rect(299, 0, 2, canvas_height);
      rect(499, 0, 2, canvas_height);
      rect(701, 0, 2, canvas_height);
      rect(902, 0, 2, canvas_height);
  }
}

class Tile {
  constructor(size_x=tile_size_x, size_y, speed_y=tile_speed, corridor, tile_id, clickable=false){
    this.x = 100 + corridor * 200 + (corridor - 2);
    this.y = -size_y;
    this.v_y = speed_y;
    this.size_x = size_x;
    this.size_y = size_y;
    this.tile_id = tile_id;
    this.clickable = clickable;
  }

  is_clickable(){
    return this.clickable;
  }

  get_id(){
    return this.tile_id;
  }

  is_out(){
    return this.y > canvas_height;
  }

  move(dt){
    this.y = this.y + this.v_y * dt / 1000.;
    this.draw();
  }

  draw(){
    stroke(0, 0, 0);
    fill("yellow");
    rect(this.x, this.y, this.size_x, this.size_y);
    noStroke();
  }
}

class TileSizes {
  constructor(size_x, size_y){
    this.size_x = size_x;
    this.size_y = size_y;
  }

  clone(){
    return new TileSizes(this.size_x, this.size_y);
  }

}

class Polygon{
  constructor(n, c_x, c_y, r, w, fill_color, border_color){
      this.n = n;
      this.c_x = c_x;
      this.c_y = c_y;
      this.w = w;
      this.r = r;
      this.fill_color = fill_color;
      this.border_color = border_color;
      this.coordinates = [];
      this.refresh_coordinates();
      this.is_active = false;
      this.thresh = 10;
  }

  is_close(p){
      for(let i = 0; i < this.n; i++){
          let b = false;
          for(let j = 0; j < p.n; j++){
              b |= (dist(this.coordinates[i][0], this.coordinates[i][1], p.coordinates[j][0], p.coordinates[j][1]) <= this.thresh)
          }
          if (!b){
              return false;
          }
      }
      return true;
  }

  is_inside_polygon(args){
      let s = 0;
      for(let i = 0; i < args["polygon"].n - 1; i++){
          s += abs((args["polygon"].coordinates[i][0] - mouseX) * (args["polygon"].coordinates[i + 1][1] - mouseY) - (args["polygon"].coordinates[i + 1][0] - mouseX) * (args["polygon"].coordinates[i][1] - mouseY));
      }
      
      args["polygon"].is_active = (s <= args["polygon"].n * args["polygon"].r * args["polygon"].r * sin(2 * PI / args["polygon"].n));
      return args["polygon"].is_active;
  }

  onClick(args){
      args["polygon"].is_active = true;
  }

  refresh_coordinates(){
      let points = [];
      for(let i = 0; i < this.n; i++){
          let x, y;
          x = this.c_x + this.r * cos(this.w + 2 * PI * i / this.n);
          y = this.c_y + this.r * sin(this.w + 2 * PI * i / this.n);
          append(points, [x, y]);
      }
      this.coordinates = points;
  }

  draw(){
      // Draw  a Polygon
      fill(this.fill_color);
      stroke(this.border_color);
      strokeWeight(4);
      beginShape();
      for(let i = 0; i < this.n; i++){
          vertex(this.coordinates[i][0], this.coordinates[i][1]);
      }
      endShape(CLOSE);

      // Draw verticies
      noStroke();
      fill(color("rgba(0, 0, 0, 1)"));
      for(let i = 0; i < this.n; i++){
        circle(this.coordinates[i][0], this.coordinates[i][1], min(this.r / 10, 12));
        // vertex(this.coordinates[i][0], this.coordinates[i][1]);
      }
  }

  move(x_c, y_c){
    this.c_x = x_c;
    this.c_y = y_c;
    this.refresh_coordinates();
  }

  rotate(dw){
      this.w += dw;
      this.refresh_coordinates();
  }
}

function shapes_game_screen(args){
  clear();
  if (args["first"]){
      args["first"] = false;

      let n = int(random(3, 7));
      let r = int(random(150, 350));

      args["shape"] = new Polygon(n, int(random(50, canvas_width - 50)), int(random(50, canvas_height / 2)), r, random(-PI/2, PI/2), "rgba(122, 250, 160, 1)", "rgba(4, 151, 48, 1)");
      args["target_shape"] = new Polygon(n, int(random(50, canvas_width - 50)), canvas_height / 2 + int(random(0, canvas_height / 3 - 50)), r, random(-PI/2, PI/2), "rgba(122, 250, 160, 0.2)", "rgba(4, 151, 48, 0.2)");
      CHandler.add_clickable_region("shape_click", args["shape"].is_inside_polygon, args["shape"].onClick, {"polygon" : args["shape"]});
  }
  
  if (args["shape"].is_active){
      args["shape"].move(mouseX, mouseY);
      let dw = 0;
      if (keyIsDown(LEFT_ARROW)) {
          dw = -0.01;
      }
      else if (keyIsDown(RIGHT_ARROW)){
          dw = 0.01;
      }
      polygon = CHandler.get_internal_state("draw_game_screen_shapes")["shape"];
      polygon.rotate(dw);
  }
  args["shape"].draw();
  args["target_shape"].draw();

  if (args["shape"].is_close(args["target_shape"])){
      args["first"] = true;
      shapes_score += 10;
  }
  textFont(shapes_font, 50);
  fill(color('#aaa9ad'));
  text('Score ' + shapes_score, canvas_width / 2 - 400, 100);

  image(quit_btn, 20, canvas_height - 100, 80, 80);
  CHandler.add_clickable_region("quit_btn", ((args) => {
      return (abs(mouseX - 60) <= 40 && abs(mouseY - canvas_height + 60) <= 40);
  }), ((args) => {
      CHandler.reset_callbacks();
      CHandler.add_callable('main_menu_shapes', draw_shapes_menu, -1, {"first":true, "stop": false})
      clear();
      return args;
  }), {});
  return args;
}

function draw_shapes_menu(args){
  if (args["stop"]){
      return args;
  }
  clear();
  textFont(shapes_font, 180);
  fill(color('#aaa9ad'));
  text('SHAPES!', canvas_width / 2 - 400, 300);
  if (args["first"]){
      clear();
      args["first"] = false;
      let btns = {};
      btns["start_btn"] = createButton('Start');
      btns["start_btn"].position(canvas_width / 2 - 150, canvas_height * .6);
      btns["start_btn"].class('start_btn_shapes');
      btns["start_btn"].mouseClicked(() => {
          btns["start_btn"].mouseClicked(() => {});
          setTimeout(() => {
              btns["start_btn"].hide();
              CHandler.reset_callbacks();
              CHandler.add_callable("draw_game_screen_shapes", shapes_game_screen, -1, {"first": true});
              btns["start_btn"].hide();
              setTimeout(() => {btns["start_btn"].hide();}, 300);
          }, 800);
      })
      args["buttons"] = btns;
  }

  // Quit button
  image(quit_btn, 20, canvas_height - 100, 80, 80);
  CHandler.add_clickable_region("quit_btn", ((args) => {
      return (abs(mouseX - 60) <= 40 && abs(mouseY - canvas_height + 60) <= 40);
  }), ((args_) => {
      CHandler.remove_callback("main_menu_shapes");
      CHandler.reset_callbacks();
      CHandler.add_callable("main_menu_menu_draw", main_menu_menu_draw, -1, {});
      canvas.removeClass('shapes_back');
      clear();
      args["buttons"]["start_btn"].hide();
      setTimeout(() => {
          args["buttons"]["start_btn"].hide();
      }, 100);
      return args_;
  }), {});

  return args;
}