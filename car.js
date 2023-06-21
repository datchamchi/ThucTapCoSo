class Car{
    constructor(x,y,width,height,controlType,maxSpeed=10){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0; // tốc độ ban đầu
        this.acceleration=2;  // hệ số gia tốc
        this.maxSpeed=maxSpeed;  // tốc độ tối đa
        this.friction=0.05;  // hệ số ma sát
        this.angle=0; // vị trí ban đầu ( liên quan đến góc )
        this.damaged=false; // kiểm tra xem xe có va chạm hay không

        this.useBrain=controlType=="AI";  // xe được phép sử dụng mạng nơ-ron

        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this); // xe sử dụng bộ cảm biến
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4]  // khởi tạo mạng nơ-ron
            );
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon(); // chứa tọa độ vị trí 4 góc của car 
            this.damaged=this.#assessDamage(roadBorders,traffic);   
        }

        if(this.sensor){

            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(   // mảng offsets chứa dữ liệu offset của từng sensor
                s=>s==null?0:1-s.offset    
                
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];  // xe đi thẳng nếu output[0] =1 
                this.controls.left=outputs[1];   // xe rẽ trái nếu output[1] = 1 
                this.controls.right=outputs[2];  // xe rẽ phải nếu output[4] = 1 
                this.controls.reverse=outputs[3]; // xe lùi nếu output[3] = 1 
            }
        }
    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];  // mảng chứa tọa độ 4 vị trí của xe
        const rad=Math.hypot(this.width,this.height)/2;   // 1/2 cạnh huyền để tính góc alpha
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });   // tọa độ điểm trên cùng bên trái
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });     // tọa độ điểm trên cùng bên phải
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });   // tọa độ điểm dưới góc phải 
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });  // tọa độ điểm dưới góc trái
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color,drawSensor=false){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}