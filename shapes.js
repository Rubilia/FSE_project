let CHandler;
const canvas_width = 1000;
const canvas_height = 1300;

let shapes_font;
let shapes_score = 0;
let quit_btn;

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