import PipeTemplate from './template.js';

export class PipeA extends PipeTemplate {

    constructor(pipeConfig) {
        super(pipeConfig);
    }

    process(unprocessed) {
        console.log('A');
        return unprocessed;
    }
};

export class PipeB extends PipeTemplate {

    constructor(pipeConfig) {
        super(pipeConfig);
    }

    process(unprocessed) {
        console.log('B');
        return unprocessed;
    }
};

export class PipeC extends PipeTemplate {

    constructor(pipeConfig) {
        super(pipeConfig);
    }

    process(unprocessed) {
        console.log('C');
        return unprocessed;
    }
};