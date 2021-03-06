var currentReading;
var activeTimer;
var active;
var startTime;

//DOM selectors
button1 = document.querySelector('.button1');
button2 = document.querySelector('.button2');

const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const milliseconds = document.querySelector('.milliseconds');

let min;
let sec;
let mil;

//distances are taken from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const distance = urlParams.get('total')
const lapDist = urlParams.get('lap')

if(urlParams.get('min')!=null||urlParams.get('sec')!=null)
{
    // minutes.innerText = urlParams.get('min').sPad();
    // seconds.innerText = urlParams.get('sec').sPad();
}

document.querySelector('.estimator-text').innerText = `Current ${distance}m estimate: `
let lapLimit = Math.floor(distance/lapDist)
if((distance/lapDist)%1 == 0){
    lapLimit -= 1;
}


generateSplitSheet(lapLimit, lapDist)

let lapCount = 0;

let lapTimeSeconds = 0;

let lastLapTimeSeconds = 0;

var starting = 0;

let estimate = 0;



//timing displays



button1.addEventListener('click', () =>{
    
    if(!(active)){
        active = true;
        startTime = new Date();
        //styling and button transistions
        button1.innerHTML = 'Stop';
        button1.style.backgroundColor = 'rgb(238, 54, 54)';
        button2.innerHTML = 'Lap';

        activeTimer = setInterval(startTimer, 50);

    }
    else{
        active = false;
        //styling and button transistions
        button1.innerHTML = 'Start';
        button1.style.backgroundColor = 'rgb(132, 207, 19)';
        button2.innerHTML = 'Reset';

        button2.style.visibility = 'visible';

        if(lapLimit == lapCount){
            button1.style.visibility = 'hidden';

        }

        clearInterval(activeTimer);
        starting = time;


    }



});
button2.addEventListener('click', () =>{

    //reset button functionality
    if(!(active)){
        //reset starting value
        starting = 0;
        lastLapTimeSeconds = 0;

        //reset actual stopwatch values
        minutes.innerText = '00'
        seconds.innerText = '00'
        milliseconds.innerText = '00'

        //reset lap times in table
        document.querySelectorAll('.table-time').forEach(element => {element.innerText = '--:--.--'});
        document.querySelectorAll('.table-lap-time').forEach(element => {element.innerText = '--:--.--'});

        //reset estimate
        document.querySelector('.estimator-time').innerText = '--:--'


        /////todo: reset all states and values back to normal
        lapCount = 0;
        button1.style.visibility = 'visible'
    }
    //lap button functionality
    else{
        lapTimeSeconds = time
        lapCount++
        /////todo: fill in current lap time
        document.querySelector(`.lap${lapCount} .table-lap-time`).innerText = `${(lapTimeSeconds-lastLapTimeSeconds).min().pad()}:${(lapTimeSeconds-lastLapTimeSeconds).sec().pad()}.${(lapTimeSeconds-lastLapTimeSeconds).mil().pad()}`
        document.querySelector(`.lap${lapCount} .table-time`).innerText = `${lapTimeSeconds.min().pad()}:${lapTimeSeconds.sec().pad()}.${lapTimeSeconds.mil().pad()}`
        //todo: do the math to calculate finish time off pace
        estimate = (lapTimeSeconds/lapCount)*(distance/lapDist)
        document.querySelector('.estimator-time').innerText = `${estimate.min().pad()}:${estimate.sec().pad()}`

        //hide the button if the lap limit is reached
        if(lapCount == lapLimit){
            button2.style.visibility = 'hidden';
        }
        lastLapTimeSeconds = lapTimeSeconds;

    }
});





function startTimer(){

    var currentTime = new Date();
    time = ((currentTime - startTime))/1000+starting;
    //get the time
    min = time.min();
    sec = time.sec();
    mil = time.mil();
    //replace the html with the time
    minutes.innerText = min.pad();
    seconds.innerText = sec.pad();
    milliseconds.innerText = mil.pad();
}
function generateSplitSheet(n,lapDist){
    let lapSheet = document.querySelector('.laps-table')

    for (let index = 1; index <= n; index++) {
        lapSheet.innerHTML+= 
        `
            <tr class = 'lap${index}'>
                <td class = 'table-lap-number'>Lap ${index}</td>
                <td class = 'table-distance'>${index*lapDist}m</td>
                <td class = 'table-lap-time'>--:--.--</td>
                <td class = 'table-time'>--:--.--</td>
            </tr>
        `
        
    }
}

//pads zeroes
Number.prototype.pad = function() {
    var s = String(this);
    if(s.length == 1) {s = '0' + s}
    return s;
}
String.prototype.sPad = function() {
    var s = this;
    if(s.length == 1) {s = '0' + s}
    return s;
}

//when given the total seconds these will output min, sec, and mil
Number.prototype.min = function() {
    return Math.floor(this/60);
}
Number.prototype.sec = function() {
    return Math.floor((this/60- Math.floor(this/60))*60 );
}
Number.prototype.mil = function() {
    return Math.floor((this%1)*100);
}


