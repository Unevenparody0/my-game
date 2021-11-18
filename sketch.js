var bgimg, p1img, player, invground, m1img, m2img, m3img, m4img, monsterGroup, spike, spikesimg, medimg, medGroup;
var heart = 5, heartimg, h = [], p, spikesimg, runleft, runright, right, rightimg, left, leftimg;
var jump, jumpimg, bulletimg, bulletGroup, flyGroup, score, gameState, startimg, endimg, ht, heartGroup;
var bg25 , bg50 , bg75 , imgp;



function preload(){
  bgimg = loadImage("images/bg3.jpg");
  p1img = loadAnimation("images/p1.png");
  m1img = loadImage("images/mnster1.png");
  m2img = loadImage("images/monster2.png");
  m3img = loadImage("images/monster3.png");
  m4img = loadImage("images/monster4.png");
  spikesimg = loadImage("images/use2.png");
  medimg = loadImage("images/medicalkit.png");
  heartimg = loadImage("images/heart.png");

  runright = loadAnimation("images/run1.png", "images/run2.png", "images/run3.png", "images/run4.png", "images/run5.png",
  "images/run6.png", "images/run7.png", "images/run8.png", "images/run9.png",)

  runleft = loadAnimation("images/runleft1.png", "images/runleft2.png", "images/runleft3.png", "images/runleft4.png",
  "images/runleft5.png", "images/runleft6.png", "images/runleft7.png", "images/runleft8.png", "images/runleft9.png",)

  rightimg = loadImage("images/right.png");
  leftimg = loadImage("images/left.png");
  jumpimg = loadImage("images/jump.png");
  bulletimg = loadImage("images/bullet.png");
 shootSound = loadSound("shoot.mp3");
 startimg = loadImage("images/bg2.jpg");
 endimg = loadImage("images/bg4.jpg");
 bg25 = loadImage("images/bg6.jpg");
 bg75 = loadImage("images/bg4.png");
 bg50 = loadImage("images/bg1.png");
 imgp = loadImage("images/run1.png");
}

function setup() {
  createCanvas(displayWidth-100, displayHeight-30);
  player = createSprite(200, displayHeight-230, 20, 20);
  //player.addAnimation("w", p1img);
  player.addImage("q", imgp);
  player.scale = 1;

  invground = createSprite(displayWidth/2, displayHeight-160, displayWidth, 20);
  invground.visible = false;

  monsterGroup = new Group();
  medGroup = new Group();
  heart = 5;

  spike = createSprite(30, displayHeight/2-100, 20, 20);
  spike.addImage(spikesimg);
  

  right = createSprite(displayWidth/4-150, displayHeight-150, 20, 20);
  right.addImage(rightimg);
  right.scale = 1;

  left = createSprite(displayWidth/4-300, displayHeight-150, 20, 20);
  left.addImage(leftimg);
  left.scale = 1;

  jump = createSprite(displayWidth/4-225, displayHeight-250, 20, 20);
  jump.addImage(jumpimg);
  jump.scale = 1;
  bulletGroup = new Group();
  flyGroup = new Group();
  score = 0;
  gameState = "start";
  
  heartGroup = new Group();
  spawnHearts();
}

function draw(){
 
  if(gameState==="start"){
    background(startimg);
    if(keyDown("space")){
      gameState = "play";
    }
  }
  else if(gameState === "play" ){
    if(score<25){ 
      background(bgimg)
    }
    spike.velocityX = 0.08;

    if(keyDown("up")&&player.y>=displayHeight-270){
      player.velocityY = -18;
    }
    if(mousePressedOver(jump)&&player.y>=displayHeight-270){
      player.velocityY = -16;
    }
    
    if(keyDown("right")){
      player.x = player.x + 10;
     
      player.addAnimation("q", runright);
    }
    if(keyWentUp("right")){
      player.visible = true;
    }
    if(mousePressedOver(right)){
      player.x = player.x + 10;
      player.visible = true;
      animation(runright, player.x, player.y, 20, 20);
    }
    
    if(keyDown("left")){
      player.x = player.x - 10;
      player.visible = false;
      animation(runright, player.x, player.y, 20, 20);
    }
    // if(keyWentUp("left")){
    //   player.visible = true;
    // }
    if(mousePressedOver(left)){
      player.x = player.x - 10;
      //player.visible = false;
      animation(runright, player.x, player.y, 20, 20);
    }

    player.velocityY = player.velocityY + 0.7;
    player.collide(invground);

    spawnMonsters();
    medicalkit();

    if(medGroup.isTouching(player)&&heart<5){
      heart = heart + 1;
      medGroup.destroyEach();
      spawnHearts();
    }
    if(monsterGroup.isTouching(player)){
      heart = heart - 1;
      
      checkMonster(monsterGroup);
      spawnHearts();
    }
    if(flyGroup.isTouching(player)){
      heart = heart - 1;
     
      checkMonster(flyGroup);
      spawnHearts();
    }
  
  
    if(keyWentDown("space")){
      bullet();
      shootSound.play();
    }
    if(bulletGroup.isTouching(monsterGroup)){
      checkMonster(monsterGroup);
      score = score + 5;
    }
    if(bulletGroup.isTouching(flyGroup)){
      checkMonster(flyGroup);
      score += 10;
    }
    if(player.isTouching(spike)){
      score = score - 5;
      heart = heart - 1;
      player.x = player.x + 100;
      spawnHearts();
    }
    if(heart<=0){
      gameState = "end";
    }
    if(score >= 100 ){

      gameState = "won"; 

    }

    if(score >= 25 && score<50 ){
      background (bg25);
    }
    if(score >= 50 && score<75 ){
      background (bg50);
    }
    if(score >= 75  ){
      background (bg75);
    }
    textSize(35);
    textFont("Fantasy");
    fill("black");
    text("Score: "+score, displayWidth-300, 100);
    
  }
else if(gameState==="end"){
  background(endimg);
  textSize(80);
  textFont("Comic sans ms");
  fill("cyan");
  text("You died", displayWidth/2-200, 100);
  text("Press R to restart", displayWidth/2-350, 200);
  monsterGroup.destroyEach();
  if(keyDown("R")){
    gameState = "play";
    score = 0;
    heart = 5;
    spike.x = 30;
    player.y = displayHeight-230;
    player.x = displayWidth/2;
    spawnHearts();

  

  }
}
else if(gameState === "won"){

  textSize(80);
  textFont("Comic sans ms");
  fill("cyan");
  text("Congratulations You Have Won", displayWidth/2-600, 100);
  text("Press R to restart", displayWidth/2-350, 200);
  monsterGroup.destroyEach();
  flyGroup.destroyEach();
  player.velocityX = 0 ;
  player.velocityY = 0 ;
  player.stop()

  if(keyDown("R")){
    gameState = "play";
    score = 0;
    heart = 5;
    spike.x = 30;
    player.y = displayHeight-230;
    player.x = displayWidth/2;
    spawnHearts();
}
}

drawSprites();

}   
function spawnMonsters(){
var r = Math.round(random(40, 80));
if(frameCount%r===0){
  var t = createSprite(displayWidth, displayHeight-230, 20, 20);
  t.setCollider("rectangle", 0, 0, 30, 40);
  t.velocityX = -(8+score/50);
  t.scale = 2.6;
  var rand = Math.round(random(1, 3));
  switch(rand){
    case 1: t.addImage(m2img);
    break;
    case 2: t.addImage(m3img);
    break;
    case 3: t.addImage(m4img);
    break;
  }
  t.lifetime = 1000;
  monsterGroup.add(t);
}
if(frameCount%140===0){
  var k = createSprite(displayWidth, Math.round(random(displayHeight-320, displayHeight/2)), 20, 20);
  k.setCollider("rectangle", 0, 0, 30, 30);
  k.addImage(m1img);
  k.velocityX = -8;
  k.scale = 2.6;
  k.lifetime = 1000;
  console.log(k.lifetime);
  flyGroup.add(k);
}
}
function medicalkit(){
if((frameCount%300===0)&&heart<5){
  var med = createSprite(player.x, Math.round(random(displayHeight - 330, displayHeight - 480)), 20, 20);
  med.addImage(medimg);
  medGroup.add(med);
  med.scale = 2;
}
}  


                                                                                  
function bullet(){
var b = createSprite(player.x+45, displayHeight-250, 20, 20);
b.addImage(bulletimg);
b.scale = 0.2;
b.velocityX = 14;
b.lifetime = displayWidth/14;
b.y = player.y - 25;
bulletGroup.add(b);
}
function keyReleased(){
if(keyCode===26){
  player.changeAnimation("w", p1img);
}
}
function checkMonster(bal){
for(var i = 0;i<bal.size();i=i+1){
  if (bulletGroup.isTouching(bal[i])||player.isTouching(bal[i])){
    bal[i].destroy();
    bulletGroup.destroyEach();
  }
}
}

function spawnHearts(){
heartGroup.destroyEach();
for(var i = 1;i<=heart;i++){
  ht = createSprite(displayWidth/3+50 * i, 100, 20, 20);
  ht.addImage(heartimg);
  ht.scale = 0.4;
  heartGroup.add(ht);
}
}