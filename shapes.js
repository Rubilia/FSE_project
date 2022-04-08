let CHandler;
const canvas_width = 1000;
const canvas_height = 1300;

let shapes_font;
let shapes_score = 0;

function setup() {
    preload_resources_shapes();
    let canv = createCanvas(canvas_width, canvas_height);
    canv.class('shapes_back');
    CHandler = new CallHandler();
    CHandler.add_callable('main_menu_shapes', draw_shapes_menu, -1, {"first":true});
}


function preload_resources_shapes(){
    shapes_font = loadFont('assets/pdark.ttf');
}

function draw() {
    // Execute all pending callbacks
    CHandler.execute();
}

// Handles all mouse clicks through CallHandler
function mouseClicked() {
    CHandler.execute_click();
}

function shapes_game_screen(args){
    clear();
    if (args["first"]){
        args["first"] = false;
        args["shape"] = new Polygon(7, canvas_width / 2, canvas_width / 2, 100, PI / 12, "rgba(122, 250, 160, 0.8)", "rgba(4, 151, 48, 0.8)");
    }
    
    args["shape"].draw();
    args["shape"].rotate(deltaTime / 160 * PI / 20);
    let a = CHandler.callables;
    return args;
}

function draw_shapes_menu(args){
    textFont(shapes_font, 180);
    fill(color('#aaa9ad'));
    text('SHAPES!', canvas_width / 2 - 400, 300);
    if (args["first"]){
        args["first"] = false;
        let btns = {};
        btns["start_btn"] = createButton('Start');
        btns["start_btn"].position(canvas_width / 2 - 150, canvas_height * .6);
        btns["start_btn"].class('start_btn_shapes');
        btns["start_btn"].mouseClicked(() => {
            btns["start_btn"].mouseClicked(() => {});
            setTimeout(() => {
                btns["start_btn"].hide();
                CHandler.remove_callback('main_menu_shapes');
                CHandler.add_callable("draw_game_screen_shapes", shapes_game_screen, -1, {"first": true});
            }, 800);
        })
        args["buttons"] = btns;
    }

    return args;
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
    }

    refresh_coordinates(){
        let points = [];
        let x, y;
        for(let i = 0; i < this.n; i++){
            x = this.c_x + this.r * cos(this.w + 2 * PI * i / this.n);
            y = this.c_y + this.r * sin(this.w + 2 * PI * i / this.n);
            append(points, [x, y]);
        }
        this.coordinates = points;
    }

    draw(){
        fill(this.fill_color);
        stroke(this.border_color);
        strokeWeight(4);
        beginShape();
        for(let i = 0; i < this.n; i++){
            vertex(this.coordinates[i][0], this.coordinates[i][1]);
        }
        endShape(CLOSE);
    }

    move(x_c, y_c){
      this.x_c = x_c;
      this.y_c = y_c;
      this.refresh_coordinates();
    }

    rotate(dw){
        this.w += dw;
        this.refresh_coordinates();
    }
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
      append(new_click_internal_states, this.click_callables[i]);
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
      if (!is_inside_callable())
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