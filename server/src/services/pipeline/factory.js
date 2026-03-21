import * as pipes from './pipes.js'
import PipeTemplate from './template.js';

export default class PipeFactory {

    // takes a config file and builds a pipeline out of it
    
    // does nothing on start, is a static class
    constructor () {}

    // function returns a pipe reference from a json
    static buildPipe(config) {
        switch (config.pipeName) {
            case 'PipeA': 
                return new pipes.PipeA();
            case 'PipeB':
                return new pipes.PipeB();
            case 'PipeC':
                return new pipes.PipeC();
        }
    }

    static buildPipeline(config) {

        let pipeline = [];
        let pipeInstance = null;
        for (const c of config) {
            
            pipeInstance = this.buildPipe(c);
            pipeline.push(pipeInstance);
        }
        
        // last element is null to signal end of pipeline, results in returning data
        pipeline.push(null);

        // for loop sets the nextPipe member for each pipe
        // intentionally leaves last pipe's nextPipe member Null
        for (let i = 0; i < pipeline.length - 1; i++) {
            console.log("Current pipe:", pipeline[i]);
            console.log("Prototype:", Object.getPrototypeOf(pipeline[i]));

            pipeline[i].setNextPipe(pipeline[i + 1]);
        }

        // reference to the beginning of the pipeline is actually a linked list
        return pipeline[0];
    }

};