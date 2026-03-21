import PipeFactory from './factory.js';

const config = [
    {
        'pipeName': 'PipeA'
    }, 
    {
        'pipeName': 'PipeB'
    },
    {
        'pipeName': 'PipeC'
    }
];


const pipeline = PipeFactory.buildPipeline(config);

const data = 'hello world';
pipeline.forward(data);