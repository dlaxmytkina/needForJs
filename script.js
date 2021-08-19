$(document).ready(function(){
    const score = $(".score"),
    start = $(".start"),
    gameArea = $(".gamearea"),
    selectedCar = $('.choiceDiv img'),
    keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false
    },
    setting = {
        start: false,
        score: 0,
        speed: 4,
        traffic: 2
    }; 
    $('.buttons_after_dtp').hide();
   
score.append(`<span>${localStorage.getItem('score')}</span>`);
    var car = "";
    gameArea.hide();

    selectedCar.click(function(){
        selectedCar.css("transform","scale(1)");
        $(this).css("transform","scale(1.3)");    
         car = $(`<img src="${$(this).attr('src')}" class="car"></img>`);
        
})
function getQuantityElements (h){
    return gameArea.height()/h;
}

    start.click(function(){
        if(car===""){
            selectedCar.css({
                'animation-name': 'error',

                'animation-duration': '1s',
                'animation-fill-mode':'forwards'
            })
            
        } else {
            score.css({
                'position': 'absolute',
                'transition':'2s',
                'left': '20px',
                'top': '20px',
                'font-size':'50px',
                'background-color': 'rgba(24, 24, 24, 0.836)'
                
            })
            for(i=0; i<getQuantityElements(120); i++){
                const line = $(`<div class="line" style="top: ${i*120}px"></div>`);
                gameArea.append(line);
            }
            for(let i = 0; i<getQuantityElements(160*setting.traffic); i++){
               const enemy = $(`<img src="./images/blueCar.png" class="enemy"></img>`);
               gameArea.append(enemy);
               enemy.css({"top":`${-160*(i+1)*setting.traffic}px`,
               "left":`${Math.random()*(gameArea.width()-car.width())}px`});
            }
            start.hide();
        $("p, .choiceDiv").hide();
        setting.start = true;
        gameArea.show();
        gameArea.append(car);
        console.log(pos(car).bottom);
        setting.x = car.position().left;
        setting.y = car.offset().top;
        requestAnimationFrame(playGame);
        }
        
    })
    
    function pos(elem){
        let top = elem.offset().top;
        let bottom = top + elem.height();
        let left = elem.offset().left ;
        let right = left + elem.width();
        return {
            top: top, 
            bottom: bottom, 
            left : left, 
            right: right
        };
    }
    
    $(document).keydown(function(e){ startRun(e); })
    $(document).keyup(function(e){ stopRun(e); })
   
    $('.restart').click(function(){
        $('.buttons_after_dtp').hide();
        setting.start=true;
        requestAnimationFrame(playGame);
        let enemy  = $(".enemy");
        for( i = 0; i<enemy.length; i++){
            enemy.eq(i).css({"top":`${-160*(i+1)*setting.traffic}px`,
            "left":`${Math.random()*(gameArea.width()-car.width())}px`});
         };
         car.removeAttr("style");
         setting.x = car.position().left;
        setting.y = car.offset().top;
        setting.score = 0;


    })

    $('.exit').click(function(){
        location.reload();
    })

    function playGame(){
       
        if (setting.start){

             moveRoad();
             moveEnemy();
            if(keys.ArrowLeft && setting.x>0){
                setting.x-= setting.speed;
            } 
            if(keys.ArrowRight && setting.x< gameArea.width()-car.width()){
                setting.x+= setting.speed;
            } 
            if(keys.ArrowDown && setting.y < gameArea.height()-car.height()-5){
                setting.y+= setting.speed;
            } 
            if(keys.ArrowUp && setting.y>0){
                setting.y-= setting.speed;
                
                setting.score+=setting.speed- setting.traffic+1;
            }
            car.css({
                "left":`${setting.x}px`,
                "top": `${setting.y}px`});
                score.children().last().html(setting.score);
                 requestAnimationFrame(playGame);
        }
        
    }

    function moveRoad(){
        let lines  = $(".line");
        lines.each(function(){
            $(this).css("top",`+=${setting.speed}px`);
            if($(this).offset().top > gameArea.height()){
                $(this).css("top","-120px");
            };
        })
    }

 
function moveEnemy(){
    let enemy  = $(".enemy");
    enemy.each(function(){
        if(pos(car).top <= pos($(this)).bottom && pos(car).right >= pos($(this)).left && pos(car).left <= pos($(this)).right && pos(car).bottom >= pos($(this)).top  ){
            console.log("DTP");
            setting.start = false;
            $('.buttons_after_dtp').show();
            if( setting.score >localStorage.getItem('score')){
                localStorage.setItem('score', setting.score)
            }
            
        }
        $(this).css("top",`+=${setting.speed/2}px`);
        if($(this).offset().top > gameArea.height()){
            $(this).css({"top":`${-160*setting.traffic}px`,
            "left":`${Math.random()*(gameArea.width()-car.width())}px`})
        };
    })
}

    function startRun(e){
        e.preventDefault();
        keys[e.key] = true;
        
    }

    function stopRun(e){
         e.preventDefault();
         keys[e.key] = false;
    }

    
})