document.addEventListener('DOMContentLoaded',() =>{
    //Write everything inside this
    const Cards = document.querySelectorAll('.face'); //this is an object
    const refreshbtn = document.getElementById('refresh');
    const gridItem = document.querySelectorAll('.grid-item');
    const flipCnt = document.getElementById('flips');
    const time = document.querySelector('#time b');
    const maxLimit = document.getElementById('modal');
    const limitWord = maxLimit.querySelector('b');
    const okaybtn = document.getElementById('okay');
    let FlippedCards = [];
    let GameStarted = false;
    //to prevent user to click third card while 
    //the two unmatched cards getting flipped again
    let isBoardLocked = false; 
    let flipCount = 0 , timer, maxTime = 40, timeLeft = maxTime;

    //------------Randomly Distributing face cards------------
    function randomizeCards(){

        let faceCards = Array.from(Cards);
        
        for(let i = 1 ; i <= 8 ; i++){
            const url = `images/love${i}.png`;
            let img1 = document.createElement('img');
            img1.classList.add('VisibleFace')
            img1.setAttribute('src',url);
            let img2 = img1.cloneNode(true);
        
            let len = faceCards.length;
            let Card2index = -1;
            let Card1index = Math.floor(Math.random()*len);
            while(Card2index === -1 || (Card1index === Card2index)){
                Card2index = Math.floor(Math.random()*len);
            } 
            faceCards[Card1index].appendChild(img1);
            faceCards[Card2index].appendChild(img2);
        
            if(Card1index > Card2index){
                faceCards.splice(Card1index,1);
                faceCards.splice(Card2index,1);
            }
            else{
                faceCards.splice(Card2index,1);       
                faceCards.splice(Card1index,1);
            }
        }
    }
    // -------------------------------------------------------

    function ReloadGame(){
        gridItem.forEach(element => {
            element.querySelector('.face').classList.add('hide');
            element.querySelector('.face').innerHTML = "";
            element.querySelector('.blank').classList.remove('hide');
            FlippedCards = [];
            flipCount = 0;
        });
        flipCnt.innerHTML = `<p>Flips: ${flipCount}</p>`
        time.innerText = maxTime;
        clearInterval(timer);
        GameStarted = false;
        timeLeft = maxTime;
        randomizeCards();
    }

    function StartTimer(){
        if(timeLeft == 0){
            clearInterval(timer);
            maxLimit.classList.remove('hide');
            limitWord.innerText = 'time';
            return;
        }
        timeLeft--;
        time.innerText = timeLeft;
    }

    randomizeCards();

    //------------Refresh btn Function------------
    refreshbtn.addEventListener('click',()=>{
        ReloadGame();
    });
    //--------------------------------------------

    okaybtn.addEventListener('click',() => {
        ReloadGame();
        maxLimit.classList.add('hide');
    });

    //------Attaching listener to each grid item for flipping-------
    gridItem.forEach(item => {
        item.addEventListener('click',() =>{
            if(!GameStarted){
                GameStarted = true;
                timer = setInterval(StartTimer,1000);
            }
            if(isBoardLocked) return;
            if(!item.querySelector('.face').classList.contains('hide')) return;
            if(flipCount >= 30){
                maxLimit.classList.remove('hide');
                limitWord.innerText = 'flips';
            }
            else{
    
                //Incrementing Flip Count
                flipCount++;
                flipCnt.innerHTML = `<p>Flips: ${flipCount}</p>`
                item.classList.add('flipped');
                console.log(item.classList.contains('flipped'));
                setTimeout(() => {
                    item.classList.remove('flipped');
                    console.log(item.classList.contains('flipped'));
                },100);
    
                if(item.querySelector('.face').classList.contains('hide')){
                    item.querySelector('.face').classList.remove('hide')
                    item.querySelector('.blank').classList.add('hide');
                }
    
                FlippedCards.push(item);
                if(FlippedCards.length == 2){
                    if(FlippedCards[0].querySelector('.face').innerHTML === FlippedCards[1].querySelector('.face').innerHTML){
                        console.log('matched');
                        FlippedCards = [];
                    }
                    else{
                        isBoardLocked = true;
                        setTimeout(()=>{
                            FlippedCards[0].classList.add('shake');
                            FlippedCards[1].classList.add('shake');
                        },400);
    
                        setTimeout(() => {
                            FlippedCards[0].querySelector('.face').classList.add('hide');
                            FlippedCards[0].querySelector('.blank').classList.remove('hide');
                            FlippedCards[1].querySelector('.face').classList.add('hide');
                            FlippedCards[1].querySelector('.blank').classList.remove('hide');
    
                            //remove shake 
                            FlippedCards[0].classList.remove('shake');
                            FlippedCards[1].classList.remove('shake');
                            FlippedCards = [];
                            isBoardLocked = false;
                        },1000);
                    }
                }
            }
        })
    });
});