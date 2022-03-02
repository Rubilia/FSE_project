let bg;
let preview_src = 'assets/tiles_preview.jpg';

function setup() {
    createCanvas(1000, 1300);
    bg = loadImage('assets/background.jpg');
  }
  
  function draw() {
    background(bg);
    draw_main_menu();
  }

  function draw_main_menu(){
    fill('white')
    // Draw settings btn
    settings = createImg('assets/settings_tiles_icon.png');
    settings.position(900, 1200);
    settings.size(90, 90);
    settings.mousePressed(draw_settings_menu);

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

    // Create score menu
    fill('white')
    draw_scores();

    // Draw preview
    textSize(50);
    fill('white')
    text('Preview', 580, 260)

    preview = createImg(preview_src)
    preview.position(460, 300);
    preview.size(460, 800)
  }

  function draw_scores(){
      // Load score - to be added
      textSize(40);
      
      text('High scores', 110, 160)
      fill("grey")
      rect(80, 200, 280, 290)
      textSize(30)
      fill('white')
      text('Try to play a game!', 90, 240)
      
  }

  function draw_settings_menu(){
    // Draws settings   
  }


  // Run games

  function music_tiles_startup(){
    preview_src = 'assets/tiles_preview.jpg';
  }

  
  function drive_dodge_startup(){
    preview_src = 'assets/drive_dodge_preview.jpg'
  }

  function object_dragging_startup(){
    preview_src = 'assets/obj_dragging_preview.jpg';
  }

  function shapes_startup(){
    preview_src = 'assets/shapes_preview.jpg';
  }