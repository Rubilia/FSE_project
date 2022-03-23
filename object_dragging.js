let background_od;
let currentactivity;
let buttons = ['assests/lock btt.png','assests/Untitled.png'];
let settings;
let game_buttons;
let lock_buttons;
function setup() {
  createCanvas(1000, 1300);
  background_od = loadImage('assests/background_od.jpg');
}


function draw(){
  background(background_od);
  switch(currentactivity){
    case 0:
      main_menu();
      break;
    case 1:
      go_into_game();
      break;
  }
   
}

function main_menu(){
    settings = createImg('assests/settings_tiles_icon.png');
    settings.position(900, 10);
    settings.size(90, 90);
    // settings.mousePressed(draw_settings_menu);

    game_buttons = createImg(buttons[1]);
    game_buttons.position(150, 150);
    game_buttons.size(90, 95);
    game_buttons.mousePressed(go_into_game);
    //
    var x = 300;
    var y = 150; 
    var num_lock_btt; 
    //
    // do an if statement when player completes a stage, change num_lockbutt + 1 and intial x + 150
    
    for(num_lock_btt = 2; num_lock_btt <= 25;++ num_lock_btt){
      if(num_lock_btt % 5 == 0)
      {
        y += 150;
        x = 150;
      }
      else
      {
          lock_buttons = createImg(buttons[0]);
          lock_buttons.position(x, y);
          lock_buttons.size(90, 90);
          x += 150;
         
      }
  }

}

function go_into_game(){
  background("220");
  currentactivity = 1;
  game_buttons.hide();

}