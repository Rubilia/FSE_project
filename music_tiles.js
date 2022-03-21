// Hyperparameters
const canvas_width = 1000;
const canvas_height = 1300;


let tile_speed = 300;
const tile_size_x = 200;
let active_screen = 0;
/* 
0 - 
*/

// Variables for gradient background
const min_bg_brightness = 70;
let bg_color_change_speed_1 = [-.3, .1, -.1];
let bg_color_change_speed_2 = [.1, -.3, .1];

let bg_c1 = [0, 0, 100];
let bg_c2 = [210, 100, 80];

function setup() {
    cnv = createCanvas(canvas_width, canvas_height);
    cnv.mouseClicked(addTile);
    // c1 = color(bg_c1[0], bg_c1[1], bg_c1[2]);
    // c2 = color(63, 191, 191);
    
    // for(let y=0; y<height; y++){
    //   n = map(y,0,height,0,1);
    //   let newc = lerpColor(c1, c2, n);
    //   stroke(newc);
    //   line(0,y,width, y);
    // }
    draw_main_menu();
  }
  
  function draw() {
    // return;
    if (active_screen == 0){
      // Draw game menu
      draw_gradient_background();
      draw_main_menu();
      
      return;
    }
    

    dt = deltaTime / 1000;
    for(i = 0 ; i < tiles.length ;i++){
      tiles[i].move(dt)
    }
  }

  function draw_gradient_background(){
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
    if (bg_c1[1] <= 0 || bg_c1[1] >= 100){
      bg_color_change_speed_1[1] *= -1;
      bg_c1[1] = max(0, min(bg_c1[1], 100));
    }

    bg_c2[1] = (bg_c2[1] + (bg_color_change_speed_2[1] * random(0.8, 1.2)));
    if (bg_c2[1] <= 0 || bg_c2[1] >= 100){
      bg_color_change_speed_2[1] *= -1;
      bg_c2[1] = max(0, min(bg_c2[1], 100));
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
  }

  function draw_main_menu(){
    settings = createImg('assets/settings_tiles_icon.png');
    settings.position(canvas_width - 100, canvas_height - 100);
    settings.size(80, 80);
    settings.mousePressed(draw_settings_menu);
  }

  function draw_settings_menu(){

  }

  function addTile(){
    append(tiles, new Tile(tile_size_x, 800, tile_speed, random([0, 1, 2, 3])));
    a = 0
  }

class TileManager{
  constructor(){
      this.tiles = []
  }

  add_tile(corridor, size){
    append(tiles, new Tile(size.size_x, size.size_y, tile_speed, corridor));
  }

  move(dt){
      tmp_tiles = []
      for(i = 0 ; i < tiles.length ;i++){
        tiles[i].move(dt)
        if (!this.tiles[i].is_out())
          append(tmp_tiles, this.tiles[i]);
        else
          remove(this.tiles[i]);
      }
      this.tiles = tmp_tiles;

  }
}

class Tile {
  constructor(size_x=tile_size_x, size_y, speed_y=tile_speed, corridor){
    this.x = 100 + corridor * 200;
    this.y = -size_y;
    this.v_y = speed_y;
    this.size_x = size_x;
    this.size_y = size_y;
  }

  is_out(){
    return this.y > canvas_height;
  }

  move(dt){
    this.y = this.y + this.v_y * dt;
    this.draw();
  }

  draw(){
    fill("yellow");
    rect(this.x, this.y, this.size_x, this.size_y);
  }
}

class TileSizes {
  constructor(size_x, size_y){
    this.size_x = size_x;
    this.size_y = size_y;
  }

  static small = new TileSizes(tile_size_x, 100)
  static medium = new TileSizes(tile_size_x, 400)
  static large = new TileSizes(tile_size_x, 600)
  static enormous = new TileSizes(tile_size_x, 800)

}

// Utils