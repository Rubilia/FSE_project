let bg;
let preview_src = 'assets/tiles_preview.jpg';

let canvas_width = 1000;
let canvas_height = 1300;
let game = 0;
let is_in_game = false;
let run_game = false;
let main_menu_start_btn = null;

function setup() {
    createCanvas(canvas_width, canvas_height);
    bg = loadImage('assets/background.jpg');
  }
  
  function draw() {
    background(bg);
    draw_main_menu_interface();
  }

  function draw_main_menu_interface(){
    fill('white');

    if (run_game){
        if (game == 0){
          if (!is_in_game){
              setup_tiles();
              is_in_game = true;
          }
          draw_tiles();
        }
    }


    // Draw game btns
    music_tiles_btn = createImg('assets/music tiles btn.png');
    music_tiles_btn.position(100, 500);
    music_tiles_btn.size(250, AUTO);
    music_tiles_btn.mousePressed(music_tiles_startup);


    drive_dodge_btn = createImg('assets/drive and dodge.png');
    drive_dodge_btn.position(100, 640);
    drive_dodge_btn.size(250, AUTO);
    drive_dodge_btn.mousePressed(drive_dodge_startup);

    object_dragging_btn = createImg('assets/object dragging.png');
    object_dragging_btn.position(100, 780);
    object_dragging_btn.size(250, AUTO);
    object_dragging_btn.mousePressed(object_dragging_startup);

    shapes_btn = createImg('assets/shape.png');
    shapes_btn.position(100, 920);
    shapes_btn.size(250, AUTO);
    shapes_btn.mousePressed(shapes_startup);

    // Draw preview
    textSize(50);
    fill('white')
    text('Preview', 580, 260)

    preview = createImg(preview_src)
    preview.position(460, 300);
    preview.size(460, 800)

    // Draw start_btn
    if (main_menu_start_btn == null){
        main_menu_start_btn = createButton('<span>🇸​​​​​🇹​​​​​🇦​​​​​🇷​​​​​🇹​​​​​</span>');
        main_menu_start_btn.style("vertical-align:middle")
        main_menu_start_btn.class("game_over_btn")
        main_menu_start_btn.position(canvas_width / 2 + 30, canvas_height - 150);
        main_menu_start_btn.mouseClicked(() => {
          main_menu_start_btn.hide();
            run_game = true;
            main_menu_start_btn = null;
        });
    }

  }

  // Run games

  function music_tiles_startup(){
    preview_src = 'assets/tiles_preview.jpg';
    game = 0;
  }

  
  function drive_dodge_startup(){
    preview_src = 'assets/not_implemented.webp'
    game = 1;
  }

  function object_dragging_startup(){
    preview_src = 'assets/not_implemented.webp';
    game = 2;
  }

  function shapes_startup(){
    preview_src = 'assets/not_implemented.webp';
    game - 3;
  }


  