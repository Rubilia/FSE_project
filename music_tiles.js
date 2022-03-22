// Hyperparameters
const canvas_width = 1000;
const canvas_height = 1300;
const tile_size_x = 200;

let tile_speed = 300;
let active_screen = 0;
/* 
0 - main menu of the game
1 - main menu with the settings menu
*/

let CHandler;

// Variables for gradient background
const min_bg_brightness = 70;
let bg_color_change_speed_1 = [-.3, .1, -.1];
let bg_color_change_speed_2 = [.1, -.3, .1];

let bg_c1 = [0, 0, 100];
let bg_c2 = [210, 100, 80];

// Variables gor buttons and etc
let canvas;
let settings_btn;

// Preloaded images
let settings_img;

function preload_images(){
  settings_img = loadImage('assets/settings_tiles_icon.png');
  settings_img.resize(80, 80);
}

function setup() {
    // Preload images
    preload_images();

    // Initialize variables
    CHandler = new CallHandler();

    canvas = createCanvas(canvas_width, canvas_height);
    canvas.mouseClicked(addTile);

    // Add tasks to draw basic UI
    CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {})
    CHandler.add_callable("draw_main_menu", draw_main_menu, -1, {"settings_angle": 0, "angle_rate": PI / 180})
  }
  
  function draw() {
    // Execute all pending callbacks
      CHandler.execute();
  }


  function draw_main_menu(args){
    angle = args["settings_angle"] + args["angle_rate"];
    rotate(angle);
    settings_btn = image(settings_img, canvas_width - 100, canvas_height - 100, 80, 80);
    // settings_btn.mousePressed(() => {active_screen = 1;});
    rotate(0);
    
    args["settings_angle"] = angle;
    return args;
  }

  function draw_settings_menu(){
    fill(color(0, 0, 0, 255));
    rect(0, 0, canvas_width, canvas_height);
  }

  function addTile(){
    append(tiles, new Tile(tile_size_x, 800, tile_speed, random([0, 1, 2, 3])));
    a = 0
  }

class CallHandler{
  constructor(){
    this.callables = [];
    this.internal_states = [];
  }

  add_callable(name, callable, repetitions, args={}){
    args["call_handler"] = this;
    args["name"] = name;

    append(this.callables, [callable, repetitions, name]);
    append(this.internal_states, args);
  }

  // Executes callables from list, updates internal states and number of reps left
  execute(){
    // draw_gradient_background(0);
    let new_callables = [];
    let new_states = [];
    for (let i = 0; i < this.callables.length; i++){
        let call = this.callables[i][0];
        let reps = this.callables[i][1];
        reps -= (reps == -1? 0: 1);

        let previous_state = this.internal_states[i];
        
        let state = call(previous_state);
        if (reps > 0 || reps == -1){
          append(new_callables, [call, reps, this.callables[i][2]]);
          append(new_states, state);
        }
    }
    this.callables = new_callables;
    this.internal_states = new_states;
  }

  // Function to remove callables by name
  remove_callback(name){
    new_callables = [];
    new_internal_states = [];
    for (let i = 0; i < this.callables.length; i++){
      // Remove callables with a given name
      if (name == this.callables[i][2])
        continue;

      // If a callable has a different name - ignore it
      append(new_callables, this.callables[i]);
      append(new_internal_states, this.internal_states[i]);
    }
  }
}

function draw_gradient_background(args){
  // Check whether the mode is correct
  if (!(active_screen == 0 || active_screen == 1))
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

  return args;
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