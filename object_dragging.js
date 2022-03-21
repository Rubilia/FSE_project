let background_od;
function setup() {
  createCanvas(1000, 1300);
  background_od = loadImage('assests/background_od.jpg');
}
function draw(){
  background(background_od);
  draw_main_menu();
}

function draw_main_menu(){
  fill('white')
    // Draw settings btn
    settings = createImg('assets/settings_tiles_icon.png');
    settings.position(900, 1200);
    settings.size(90, 90);
    settings.mousePressed(draw_settings_menu);

}