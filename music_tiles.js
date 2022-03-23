// Hyperparameters
const canvas_width = 1000;
const canvas_height = 1300;
const tile_size_x = 200;

let tile_speed = 400;
let active_screen = 0;
/* 
0 - main menu of the game
1 - main menu + animation of settings menu (open animation)
2 - main_menu + settings menu on top of it
*/

let CHandler;

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

function preload_images(){
  settings_img = loadImage('assets/settings_tiles_icon.png');
  settings_img.resize(80, 80);

  start_btn = loadImage('assets/button_start.png');
  start_btn.resize(400, 120);
}

function draw() {
  // Execute all pending callbacks
    CHandler.execute();
}

// Handles all mouse clicks through CallHandler
function mouseClicked() {
    CHandler.execute_click();
}

function setup() {
    // Preload images
    preload_images();

    // Initialize variables
    CHandler = new CallHandler();

    canvas = createCanvas(canvas_width, canvas_height);
    // canvas.mouseClicked(addTile);

    // Add tasks to draw basic UI
    CHandler.add_callable("draw_gradient_background", draw_gradient_background, -1, {});
    CHandler.add_callable("random_tiles_animation", draw_random_tiles, -1, {"tiles_manager": new TileManager(), "idle": 8})
    CHandler.add_callable("draw_main_menu", draw_main_menu, -1, {"settings_angle": 0, "angle_rate": PI / 30, "do_rotation": false, "show_start_btn": true});
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

  function draw_main_menu(args){
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

        return args;
    });

    image(settings_img, 0, 0, 80, 80);
    CHandler.add_clickable_region("settings_btn_click", identify_region_callback, button_pressed_callbak, {});

    if (args["do_rotation"]){
        rotate(-angle);
        args["settings_angle"] = angle;
    }
    translate(60 - canvas_width, 60 - canvas_height);

    // Draw buttons
    if (args["show_start_btn"]){

        image(start_btn, canvas_width / 2, canvas_height / 2, 420, 124);
        CHandler.add_clickable_region("start_button", (() => {
          if (!(active_screen == 0)){
              return false
          }
          return abs(mouseX - canvas_width / 2) < 210 && abs(mouseY - canvas_height / 2) < 62;
        }), ((args_start_btn) => {
              if (!args_start_btn["clickable"]){return args_start_btn; }

              // Button can only be pressed once - disable its rendering
              // args["show_start_btn"] = false;
              // args_start_btn["clickable"] = false;

              // Start animation
              CHandler.add_callable("start_button_flies_away", start_btn_animation, 120, {"t": 0, "w": 0});

              return args_start_btn;
        }), {"clickable": true});
    }
    
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

    args["t"] = t;
    args["w"] = w;
    return args;
}

class CallHandler{
  constructor(){
    this.callables = [];
    this.internal_states = [];

    this.click_callables = [];
    this.click_internal_states = [];
  }

  reset_callbacks(){
    this.callables = [];
    this.internal_states = [];

    this.click_callables = [];
    this.click_internal_states = [];
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
      append(new_click_internal_states, this.click_callables[i]);
    }

    this.click_callables = new_click_callables;
    this.click_internal_states = new_click_internal_states;
  }

  add_callable(name, callable, repetitions, args={}){
    args["call_handler"] = this;
    args["name"] = name;

    append(this.callables, [callable, repetitions, name]);
    append(this.internal_states, args);
  }

  // Executes callables from list, updates internal states and number of reps left
  execute(){
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

  // Execute a given callbacks if user clickes inside a given region
  execute_click(){
    for (let i = 0; i < this.click_callables.length; i++){
      let is_inside_callable = this.click_callables[i][0];
      if (!is_inside_callable())
        continue;

      let call = this.click_callables[i][1];

      this.click_internal_states[i] = call(this.click_internal_states[i]);
    }
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
  if (!(active_screen == 0 || active_screen == 1 || active_screen == 2))
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

class TileManager{
  constructor(){
      this.tiles = []
  }

  add_tile(corridor, size){
    try{
        append(this.tiles, new Tile(size.size_x, size.size_y, tile_speed, corridor));
    } catch(ex){
      console.log(ex);
    }
    
  }

  move(dt){
      let tmp_tiles = []
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
  constructor(size_x=tile_size_x, size_y, speed_y=tile_speed, corridor){
    this.x = 100 + corridor * 200 + (corridor - 2);
    this.y = -size_y;
    this.v_y = speed_y;
    this.size_x = size_x;
    this.size_y = size_y;
  }

  is_out(){
    return this.y > canvas_height;
  }

  move(dt){
    this.y = this.y + this.v_y * dt / 1000.;
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

  clone(){
    return new TileSizes(this.size_x, this.size_y);
  }

}

// Utils