// Hyperparameters
const canvas_width = 1000;
const canvas_height = 1300;

let tile_speed = 300
const tile_size_x = 200
let tiles = []

function setup() {
    cnv = createCanvas(canvas_width, canvas_height);
    cnv.mouseClicked(addTile);
    draw_main_menu();
  }
  
  function draw() {
    background("grey");
    draw_main_menu();

    dt = deltaTime / 1000;
    for(i = 0 ; i < tiles.length ;i++){
      tiles[i].move(dt)
    }
  }

  function draw_main_menu(){
    settings = createImg('assets/settings_tiles_icon.png');
    settings.position(20, 20);
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