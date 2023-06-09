class NeuralNetwork{
    constructor(neuronCounts){   
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){    // số tầng layer : với 3 lớp thì có 2 tầng
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]  
            ));
        }
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(     
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}

class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);  // mảng gồm giá trị input của nơ-ron từng layer
        this.outputs=new Array(outputCount);  // mảng chứa giá trị output
        this.biases=new Array(outputCount);  // mảng chứa giá trị bias

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);  // mảng 2 chiều chứa trọng số w
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;  // dể tránh tình trạng xe rẽ phải 
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }
    // feedForward : mạng truyền thẳng 
    // givenInputs: nhận dữ liệu đầu vào là tầng input
    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];  // chuyển dữ liệu từ givenInput sang lớp input 
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];   // (w * x)
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;   // sử dụng hàm khởi tạo( ở đây là bước nhị phân)  sum - bias >=0 ?1 :0
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}