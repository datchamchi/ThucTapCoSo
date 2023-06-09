
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200; // chiều rộng của giao diện

const carCtx = carCanvas.getContext("2d"); // sử dụng context 2d trong Canvas API với car


const road=new Road(carCanvas.width/2,carCanvas.width*0.9);  // khởi tạo làn đường cho xe chạy

const N=1;   // số lượng nhân bản
const cars=generateCars(N); // hàm này mục đích để nhân bản 

let bestCar=cars[0]; // chọn 1 ô tô 
if(localStorage.getItem("bestBrain")){  // localStrorage lưu lại phương án tốt nhất khi học 
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

const traffic=[  // tạo giao thông trên đường
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-900,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1200,30,50,"DUMMY",2),
   

];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}
function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;


    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");   
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();


    requestAnimationFrame(animate);
}


   
    


  

