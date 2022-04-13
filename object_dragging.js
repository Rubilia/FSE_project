// buttons 
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
//

// map
let obj_dotted_lines1;
let obj_lv2;
let obj_lv3;
//

//action var 
let obj_current_act = 0;
let obj_in_begin = false;
let obj_in_beginlv2 = false;
let obj_in_beginlv3 = false;
//

//draw array
let obj_funct_user_draw= []; 
let obj_funct_user_drawlv2 = []; 
let obj_funct_user_drawlv3 = [];
//

//stars
let obj_first_star = false;
let obj_second_star = false;
let obj_third_star_lv1= false;
let obj_first_starlv2 = false;
let obj_second_starlv2 = false;
let obj_third_star_lv2= false;
let obj_first_starlv3 = false;
let obj_second_starlv3 = false;
let obj_third_star_lv3= false;
//




function setup() {
  createCanvas(1000, 1300);
}

function draw(){
  background(obj_background_od);
  switch(obj_current_act){
      case 0:
        main1();
        break;
      case 10:
        lv1();
        break;
      case 20:
        lv2();
        break;
      case 30:
        lv3();
        break;
  }
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
  obj_lv2 = loadImage("assests/lv2.png");
  obj_lv3 = loadImage("assests/lv3.png");
}

function main1(){
  if(obj_third_star_lv1 == false){
    image(obj_game_buttons_lv1, 150, 150, 90, 90);  
  }
  if((obj_third_star_lv1 == true) && (obj_second_star == true) &&(obj_first_star == true)){
    image(obj_full_star_lv1, 150, 150, 90, 90);  
  }

  if(obj_third_star_lv2 == false){
    image(obj_game_buttons_lv2, 285, 150, 80, 80);  
  }
  if((obj_third_star_lv2 == true) && (obj_second_starlv2 == true) &&(obj_first_starlv2 == true)){
    image(obj_full_star_lv2, 285, 150, 80, 80);  
  }

  if(obj_third_star_lv3 == false){
    image(obj_game_buttons_lv3, 415, 150, 85, 85);  
  }
  if((obj_third_star_lv3 == true) && (obj_second_starlv3 == true) &&(obj_first_starlv3 == true)){
    image(obj_full_star_lv3, 415, 150, 85, 85);  
  }

  image(obj_lock_buttons, 550, 150, 90, 90);
  image(obj_settings, 900, 10, 90, 90);
}



function lv1(){
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
        return obj_first_star = true;
      }
    }

    if(mouseX > 520 && mouseX < 570){
      if(mouseY > 600 && mouseY < 650){
        return obj_second_star = true;
      }
    }

    if(mouseX > 520 && mouseX < 570){
      if(mouseY > 920 && mouseY < 970){

        return obj_third_star_lv1 = true;
      }
    }
 

  }

  if((obj_third_star_lv1 == true) && (obj_second_star == true) &&(obj_first_star == true)){
    if(mouseX > 200 && mouseX < 240){
      if(mouseY > 850 && mouseY < 900){
        obj_current_act = 0;
      }
    }
  }

}
  
function lv2(){
  image(obj_back_btts, 10, 10, 90, 90);
  image(obj_settings, 900, 10, 90, 90);
  image(obj_lv2, 200, 300, 650, 650);

  image(obj_star, 500, 360, 50, 50);
  image(obj_star, 640, 480, 50, 50);
  image(obj_star, 815, 615, 50, 50);
  noStroke();
  fill(0,0,139);
  rect(365, 306, 10, 10);
  fill(0, 255, 255);//end point
  circle(212, 604, 70);


  if(mouseX > 365 && mouseX < 376){
    if(mouseY > 306 && mouseY < 316){
      return obj_in_beginlv2 = true;
    }
  }

  let x = mouseX;
  let y = mouseY;

  if(obj_in_beginlv2 == true){
    fill(0,255,0);
    circle (x, y, 60);
  
    for(let i = 0; i < obj_funct_user_drawlv2.length; i++) {//
      let c = obj_funct_user_drawlv2[i];
      fill(0,255,0);
      circle(c.x, c.y, 60);//
    }

    if(mouseX > 500 && mouseX < 550){
      if(mouseY > 360 && mouseY < 410){
         return obj_first_starlv2 = true;
      }
    }

    if(mouseX > 640 && mouseX < 690){
      if(mouseY > 480 && mouseY < 530){
        return obj_second_starlv2 = true;
      }
    }

    if(mouseX > 815 && mouseX < 865){
      if(mouseY > 615 && mouseY < 665){

        return obj_third_star_lv2 = true;
      }
    }
  }

  if((obj_third_star_lv2 == true) && (obj_second_starlv2 == true) &&(obj_first_starlv2 == true)){
    if(mouseX > 212 && mouseX < 250){
      if(mouseY > 604 && mouseY < 650){
        obj_current_act = 0;
      }
    }
  }
}

function lv3(){
  image(obj_back_btts, 10, 10, 90, 90);
  image(obj_settings, 900, 10, 90, 90);
  image(obj_lv3, 200, 300, 650, 800);
  image(obj_star, 480, 340, 50, 50);
  image(obj_star, 525, 760, 50, 50);
  image(obj_star, 750, 930, 50, 50);
  noStroke();
  fill(0,0,139); //begin
  rect(210, 305, 10, 10);
  fill(0, 255, 255);//end point
  circle(280 , 1095 , 70);


  if(mouseX > 210 && mouseX < 220){
    if(mouseY > 305 && mouseY < 315){
      return obj_in_beginlv3 = true;
    }
  }

  let x = mouseX;
  let y = mouseY;

  if(obj_in_beginlv3 == true){
    fill(0,255,0);
    circle (x, y, 60);

    for(let i = 0; i < obj_funct_user_drawlv3.length; i++) {//
      let c = obj_funct_user_drawlv3[i];
      fill(0,255,0);
      circle(c.x, c.y, 60);//
    }

    if(mouseX > 480 && mouseX < 530){
      if(mouseY > 340 && mouseY < 390){
        return obj_first_starlv3 = true;
      }
    }

    if(mouseX > 525 && mouseX < 575){
      if(mouseY > 760 && mouseY < 810){
        return obj_second_starlv3 = true;
      }
    }

    if(mouseX > 750 && mouseX < 800){
      if(mouseY > 930 && mouseY < 980){

        return obj_third_star_lv3 = true;
      }
    }
  }

  if((obj_third_star_lv3 == true) && (obj_second_starlv3 == true) &&(obj_first_starlv3 == true)){
    if(mouseX > 250  && mouseX < 330){
      if(mouseY > 1050  && mouseY < 1150){
        obj_current_act = 0;
      }
    }
  }
}

function mouseClicked(){
  if(obj_current_act == 0){
    if(mouseX > 150 && mouseX < 240){ //go into lv 1
      if(mouseY > 150 && mouseY < 240){
        obj_current_act = 10;         
      }
    }  

    if(mouseX > 285 && mouseX < 365){ //go into lv 2
      if(mouseY > 150 && mouseY < 240){
        obj_current_act = 20;         
      }
    }

    if(mouseX > 415 && mouseX < 500){ //go into lv 3
      if(mouseY > 150 && mouseY < 240){
        obj_current_act = 30;         
      }
    } 
  }


  if(obj_current_act == 10){  //lv1
    //backbtt
   if(mouseX > 10 && mouseX < 100){
    if(mouseY > 10 && mouseY < 100){
      obj_current_act = 0;
     }
   }
  }


  if(obj_current_act == 20){  //lv2
    //backbtt
   if(mouseX > 10 && mouseX < 100){
    if(mouseY > 10 && mouseY < 100){
      obj_current_act = 0;
     }
   }

  } 

  if(obj_current_act == 30){  //lv3
    //backbtt
   if(mouseX > 10 && mouseX < 100){
    if(mouseY > 10 && mouseY < 100){
      obj_current_act = 0;
     }
   }

  } 

}


function mouseDragged() {
  if(obj_current_act == 10){ //drawing
      if(obj_in_begin == true){
        obj_funct_user_draw.push(new p5.Vector(mouseX, mouseY));
        //console.log(mouseX + " "+ mouseY)
        }
  }

  if(obj_current_act == 20){
    if(obj_in_beginlv2 == true){
      obj_funct_user_drawlv2.push(new p5.Vector(mouseX, mouseY));
      //console.log(mouseX + " "+ mouseY) 
    }
  }

  if(obj_current_act == 30){
    if(obj_in_beginlv3 == true){
      obj_funct_user_drawlv3.push(new p5.Vector(mouseX, mouseY));
      //console.log(mouseX + " "+ mouseY)
    }
  }
}