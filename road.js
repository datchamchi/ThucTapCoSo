class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top}; // tọa độ bên trên góc trái
        const topRight={x:this.right,y:this.top}; // tạo độ bên trên góc phải
        const bottomLeft={x:this.left,y:this.bottom};  // tọa độ bên dưới góc trái
        const bottomRight={x:this.right,y:this.bottom};  // tọa độ bên dưới góc phải
        this.borders=[    // xác định biên để dùng cho việc xác định va chạm
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    getLaneCenter(laneIndex){  // đặt xe ở vị trí chính giữa
        const laneWidth=this.width/this.laneCount;  // xác định lane ở giữa  
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;  // trả về vị trí chính giữa
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );

            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}