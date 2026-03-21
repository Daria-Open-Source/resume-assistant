export default class PipeTemplate {

    // has a next pointer
    // has a process function
    
    nextPipe = null;    // references the next pipe

    constructor() {}    // shouldn't do anything on construction, maybe a pipeName field? 

    async process() {}    // child classes override this

    async forward(dataIn) { // all process functions will implement this

        let dataOut = null; 

        try {
            dataOut = await this.process(dataIn);
        } catch(error) {
            throw new Error('Pipeline error');
        }

        if (!dataOut) return;           // case where data is null (bad)
        if (!this.nextPipe) return dataOut;  // case where nextPipe is undefined (either dev mistake or this is the last pipe in the flow);

        else return this.nextPipe.forward(dataOut);
    }

    setNextPipe(pipeReference) {
        this.nextPipe = pipeReference;
    }
};