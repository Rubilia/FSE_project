let obj_background_od;
let obj_settings;
let obj_game_buttons_lv1;
let obj_game_buttons_lv2;
let obj_game_buttons_lv3;
let obj_full_star_lv1;
let obj_full_star_lv2;
let obj_full_star_lv3;
let obj_star;
let obj_lock_buttons;
let obj_back_btts;
let obj_dotted_lines1;
let obj_current_act = 0;
let obj_in_begin = false;
let obj_funct_user_draw = [];  
let obj_stars = [];
let obj_first_star = false;
let obj_second_star = false;
let obj_third_star_lv1= false;
let obj_third_star_lv2= false;
let obj_third_star_lv3= false;


function setup() {
  createCanvas(1000, 1300);
}

function preload(){
  obj_background_od = loadImage('assests/background_od.jpg');
  obj_game_buttons_lv1 = loadImage("assests/lv1_no_star.png");
  obj_game_buttons_lv2 = loadImage("assests/lv2_no_star.png");
  obj_game_buttons_lv3 = loadImage("assests/lv3_no_star.png");
  obj_full_star_lv1 = loadImage("assests/lv1_full_star.png");
  obj_full_star_lv2 = loadImage("assests/lv2_full_star.png");
  obj_full_star_lv3 = loadImage("assests/lv3_full_star.png");
  obj_star = loadImage("assests/star.png");
  obj_lock_buttons = loadImage("assests/lock btt.png");
  obj_settings = loadImage("assests/settings_tiles_icon.png");
  obj_back_btts = loadImage("assests/back_btts.png");
  obj_dotted_lines1 = loadImage("assests/dotted_lines.png");
}

function main1(){
  if(obj_third_star_lv1 == false){
    image(obj_game_buttons_lv1, 150, 150, 90, 90);  
  }
  if(obj_third_star_lv1 == true){
    image(obj_full_star_lv1, 150, 150, 90, 90);  
  }

  if(obj_third_star_lv2 == false){
    image(obj_game_buttons_lv2, 285, 150, 80, 80);  
  }
  if(obj_third_star_lv2 == true){
    image(obj_full_star_lv2, 285, 150, 80, 80);  
  }

  if(obj_third_star_lv3 == false){
    image(obj_game_buttons_lv3, 415, 150, 85, 85);  
  }
  if(obj_third_star_lv3 == true){
    image(full_star_lv3, 415, 150, 85, 85);  
  }
  image(obj_lock_buttons, 550, 150, 90, 90);
  image(obj_settings, 900, 10, 90, 90);
}



function go_into_game(){
  image(obj_back_btts, 10, 10, 90, 90);
  image(obj_settings, 900, 10, 90, 90);
  image(obj_dotted_lines1, 200, 300, 650, 650);
  image(obj_star, 520, 280, 50, 50);
  image(obj_star, 520, 600, 50, 50);
  image(obj_star, 520, 920, 50, 50);

  noStroke(); 
  fill(0);
  textSize(35);
  text('From the top of the "S" ', 170, 130);
  text('Follow the dotted lines to reach the blue circle', 170, 180);
  fill(0, 255, 255);//end point
  circle(200,850,70);
  
  // begin point
  //rect(830,385, 10, 10);
  if(mouseX > 830 && mouseX < 840){
    if(mouseY > 385 && mouseY < 395){
      return obj_in_begin = true;
    }
  }

  let x = mouseX;
  let y = mouseY;

  if(obj_in_begin == true){
      fill(0,255,0);
      circle (x, y, 60);
    
    for(let i = 0; i < obj_funct_user_draw.length; i++) {//
      let c = obj_funct_user_draw[i];
      fill(0,255,0);
      circle(c.x, c.y, 60);//

    }

     if(mouseX > 520 && mouseX < 570){
      if(mouseY > 280 && mouseY < 330){
        obj_first_star = true;
      }
    }

    if(mouseX > 520 && mouseX < 570){
      if(mouseY > 600 && mouseY < 650){
        obj_second_star = true;
      }
    }

    if(mouseX > 520 && mouseX < 570){
      if(mouseY > 920 && mouseY < 970){

        return obj_third_star_lv1 = true;
      }
    }
 

  }

  if(obj_third_star_lv1 == true){
    if(mouseX > 200 && mouseX < 240){
      if(mouseY > 850 && mouseY < 900){
        obj_current_act = 0;
      }
    }
  }

}
  

  

function mouseClicked(){
  if(obj_current_act == 0){
    if(mouseX > 150 && mouseX < 240){
      if(mouseY > 150 && mouseY < 240){
        obj_current_act = 10;         
      }
    }  
  }
  if(obj_current_act == 10){  
    //backbtt
   if(obj_third_star_lv1 == false){
   if(mouseX > 10 && mouseX < 100){
    if(mouseY > 10 && mouseY < 100){
      obj_current_act = 0;
     }
   }
   }

   if(obj_third_star_lv1 == true){
    if(mouseX > 10 && mouseX < 100){
      if(mouseY > 10 && mouseY < 100){
        obj_current_act = 0;
      }
     }
    }

  }
}


function mouseDragged() {
  if(obj_current_act == 10){
      if(obj_in_begin == true){
        obj_funct_user_draw.push(new p5.Vector(mouseX, mouseY));
        //console.log(mouseX + " "+ mouseY)
        }
  }
}


function draw(){
  background(obj_background_od);
  switch(obj_current_act){
      case 0:
        main1();
        break;
      case 10:
        go_into_game();
        break;
  }
  }
