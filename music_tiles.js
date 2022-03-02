function setup() {
    createCanvas(1000, 1300);
    draw_main_menu();
  }
  
  function draw() {
    background("grey");
  }

  function draw_main_menu(){
    settings = createImg('assets/settings_tiles_icon.png');
    settings.position(20, 20);
    settings.size(80, 80);
    settings.mousePressed(draw_settings_menu);
  }

  function draw_settings_menu(){

  }