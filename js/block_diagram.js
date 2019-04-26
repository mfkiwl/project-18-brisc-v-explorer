var paper = undefined;
var graph = undefined;
var graphScale = {
    x: 1,
    y: 1
};
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;

function initCanvas() {
    graph = new joint.dia.Graph;
    
    paper = new joint.dia.Paper({
        el: document.getElementById('diagram-div'),
        model: graph,
        width: 500,
        height: 400,
        gridSize: 1
    });
    
    paper.on('cell:pointerdown', function(cellView, evt, x, y) {
        console.log(`Mouse click on (${x}, ${y}): detected element \"${getBlockName(cellView)}\"`);
    });
    paper.on('cell:pointerdblclick', function(cellView, evt, x, y) {
        console.log(`Double click on (${x}, ${y}): detected element \"${getBlockName(cellView)}\"`);
    });
    
    $('#diagram-div')
    .attr('tabindex', 0)
    .on('mouseover', function() {
        this.focus();
    })
    .on('keydown', function(e) {
        console.log(`Keypress ${e.which} detected on canvas`);
        if (e.which === 189 && graphScale.x > MIN_SCALE) {
            graphScale.x -= 0.1;
            graphScale.y -= 0.1;
            paper.scale(graphScale.x, graphScale.y);
        } else if (e.which === 187 && graphScale.x < MAX_SCALE) {
            graphScale.x += 0.1;
            graphScale.y += 0.1;
            paper.scale(graphScale.x, graphScale.y);
        }
    });
}

function getBlockName(cellView) {
    if (cellView !==  undefined) {
         return cellView.model.prop('attrs/label/text').replace(/\n/g, ' ');
    } 
}

function getRegfileTemplate(x, y, width, height) {
    var regfileBlock = new joint.shapes.standard.Rectangle();
    regfileBlock.attr({
         body: {
            rx: 6,
            ry: 6,
            fill: '#bababa'
        },
        label: {
            fill: 'black'
        }
    });
    regfileBlock.position(x, y);
    regfileBlock.resize(width, height);
    regfileBlock.attr('body/fill', '#bababa');
    regfileBlock.attr('label/fill', 'black');
    var clockPathSymbol = new joint.shapes.standard.Path();
    clockPathSymbol.attr({
        body: {
            refD: 'M8 48 L56 48 L32 12 Z',
            fill: '#bababa'
        }
    });
    clockPathSymbol.resize(12, 8);
    var regfileHalfX = regfileBlock.position().x + (regfileBlock.attributes.size.width / 2) - (clockPathSymbol.attributes.size.width / 2);
    var regfileBottomY = regfileBlock.position().y + regfileBlock.attributes.size.height - clockPathSymbol.attributes.size.height;
    clockPathSymbol.position(regfileHalfX, regfileBottomY);
    return {
        regfile: regfileBlock,
        clockSymbol: clockPathSymbol
    };
}

function initSingleCycleDiagram() {
    graph.clear();
    graphScale.x = 1;
    graphScale.y = 1;
    paper.scale(graphScale.x, graphScale.y);
    var fetchBlock = new joint.shapes.standard.Rectangle();
    fetchBlock.position(20, 106);
    fetchBlock.resize(70, 80);
    fetchBlock.attr({
        body: {
            rx: 6,
            ry: 6,
            fill: '#71b3aa'
        },
        label: {
            fill: 'white',
            text: 'Fetch\nUnit'
        }
    });
    fetchBlock.addTo(graph);
    console.log(fetchBlock);
    console.log(fetchBlock.attributes.size.width);
    fetchBlock.on('change:position', function() {
        console.log('FetchBlock position: ' + fetchBlock.position());
    });

    // decode block
    var decodeBlock = fetchBlock.clone();
    decodeBlock.translate(fetchBlock.attributes.size.width + 20, 0);
    decodeBlock.attr('label/text', 'Decode\nUnit');
    decodeBlock.attr('body/fill', '#77b1bd');
    decodeBlock.addTo(graph);
    decodeBlock.on('change:position', function() {
        console.log('DecodeBlock position: ' + decodeBlock.position());
    });
    // regfile
    //regfileBlock.translate(decodeBlock.attributes.size.width - 10, 0);
    var regTemplate = getRegfileTemplate(
        decodeBlock.position().x + (decodeBlock.attributes.size.width - 10), 
        decodeBlock.position().y, 35, 80);
    regTemplate.regfile.attr('label/text', 'Reg\nFile');
    regTemplate.regfile.addTo(graph);
    regTemplate.clockSymbol.addTo(graph);
    
    // instruction memory
    var insMemoryBlock = fetchBlock.clone();
    insMemoryBlock.translate(-14, fetchBlock.attributes.size.height + 35);
    insMemoryBlock.attr('label/text', 'Instruction\nMemory\n16kB');
    insMemoryBlock.resize(100, 60);
    insMemoryBlock.attr('body/fill', '#993131');
    insMemoryBlock.addTo(graph);
    insMemoryBlock.on('change:position', function() {
        console.log('InsMemoryBlock position: ' + insMemoryBlock.position());
    });
    // execute block
    var executeBlock = regTemplate.regfile.clone();
    executeBlock.resize(fetchBlock.attributes.size.width, fetchBlock.attributes.size.height);
    executeBlock.translate(regTemplate.regfile.attributes.size.width + 20, 0);
    executeBlock.attr('label/text', 'Execute\nUnit');
    executeBlock.attr('label/fill', 'white');
    executeBlock.attr('body/fill', '#597cab');
    executeBlock.addTo(graph);
    executeBlock.on('change:position', function() {
        console.log('ExectuteBlock position: ' + executeBlock.position());
    });
    // memory unit
    var memoryUnitBlock = executeBlock.clone();
    memoryUnitBlock.translate(executeBlock.attributes.size.width + 20, 0);
    memoryUnitBlock.attr('label/text', 'Memory\nUnit');
    memoryUnitBlock.attr('body/fill', '#5762ab');
    memoryUnitBlock.addTo(graph);
    memoryUnitBlock.on('change:position', function() {
        console.log('MemoryUnitBlock position: ' + memoryUnitBlock.position());
    });
    // data memory
    var dataMemoryBlock = memoryUnitBlock.clone();
    dataMemoryBlock.translate(-14, memoryUnitBlock.attributes.size.height + 35);
    dataMemoryBlock.attr('label/text', 'Data\nMemory\n16kB');
    dataMemoryBlock.attr('body/fill', '#993131');
    dataMemoryBlock.resize(100, 60);
    dataMemoryBlock.addTo(graph);
    dataMemoryBlock.on('change:position', function() {
        console.log('DataMemoryBlock position: ' + dataMemoryBlock.position());
    });
    // write back
    var writeBackBlock = memoryUnitBlock.clone();
    writeBackBlock.translate(memoryUnitBlock.attributes.size.width + 20, 0);
    writeBackBlock.attr('label/text', 'Writeback\nUnit');
    writeBackBlock.attr('body/fill', '#4f4d85');
    writeBackBlock.addTo(graph);
    writeBackBlock.on('change:position', function() {
        console.log('WriteBackBlock position: ' + writeBackBlock.position());
    });
    // control unit
    var controlUnitBlock = decodeBlock.clone();
    controlUnitBlock.resize(80, 35);
    controlUnitBlock.translate(-4, -decodeBlock.attributes.size.height + 10);
    controlUnitBlock.attr('label/text', 'Control\nUnit');
    controlUnitBlock.attr('body/fill', '#77b1bd');
    controlUnitBlock.addTo(graph);
    controlUnitBlock.on('change:position', function() {
        console.log('ControlUnitBlock position: ' + controlUnitBlock.position());
    });
    
    // Linking
    var fetchToDecodeLink = new joint.shapes.standard.Link();
    fetchToDecodeLink.source(fetchBlock);
    fetchToDecodeLink.target(decodeBlock);
    fetchToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: fetchBlock.attr('body/fill'),
            targetMarker: {
                type: 'path',
                fill: fetchBlock.attr('body/fill')
            }
        }
    });
    fetchToDecodeLink.addTo(graph);
    
    var regfileToExecuteLink = fetchToDecodeLink.clone();
    regfileToExecuteLink.source(regTemplate.regfile);
    regfileToExecuteLink.target(executeBlock);
    regfileToExecuteLink.attr('line/stroke', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.attr('line/targetMarker/fill', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.toBack();
    regfileToExecuteLink.addTo(graph);
    
    var executeToMemoryLink = regfileToExecuteLink.clone();
    executeToMemoryLink.source(executeBlock);
    executeToMemoryLink.target(memoryUnitBlock);
    executeToMemoryLink.attr('line/stroke', executeBlock.attr('body/fill'));
    executeToMemoryLink.attr('line/targetMarker/fill', executeBlock.attr('body/fill'));
    executeToMemoryLink.addTo(graph);
    
    var memoryToWriteBackLink = executeToMemoryLink.clone();
    memoryToWriteBackLink.source(memoryUnitBlock);
    memoryToWriteBackLink.target(writeBackBlock);
    memoryToWriteBackLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.addTo(graph);
    
    var writeBackToDecodeLink = memoryToWriteBackLink.clone();
    writeBackToDecodeLink.source(writeBackBlock);
    writeBackToDecodeLink.target(decodeBlock);
    writeBackToDecodeLink.router('manhattan');
    writeBackToDecodeLink.connector('rounded', {
        radius: 5
    });
    writeBackToDecodeLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.addTo(graph);
    
    // control unit links
    var controlToFetchLink = fetchToDecodeLink.clone();
    controlToFetchLink.source(controlUnitBlock);
    controlToFetchLink.target(fetchBlock);
    controlToFetchLink.router('manhattan');
    controlToFetchLink.connector('rounded', {
        radius: 5
    });
    controlToFetchLink.addTo(graph);
    var controlToDecodeLink = fetchToDecodeLink.clone();
    controlToDecodeLink.source(controlUnitBlock);
    controlToDecodeLink.target(decodeBlock);
    controlToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: controlUnitBlock.attr('body/fill'),
            sourceMarker: {
                type: 'path',
                fill: controlUnitBlock.attr('body/fill'),
                d: controlToDecodeLink.attr('line/targetMarker/d')
            }
        }
    });
    console.log(controlToDecodeLink);
    controlToDecodeLink.addTo(graph);
    var controlToExectuteLink = controlToFetchLink.clone();
    controlToExectuteLink.target(executeBlock);
    controlToExectuteLink.addTo(graph);
    var controlToMemoryLink = controlToExectuteLink.clone();
    controlToMemoryLink.target(memoryUnitBlock);
    controlToMemoryLink.addTo(graph);
    var controlToWriteBack = controlToMemoryLink.clone();
    controlToWriteBack.target(writeBackBlock);
    controlToWriteBack.addTo(graph);
    // memory links
    var memoryUnitToDataMemoryLink = controlToDecodeLink.clone();
    memoryUnitToDataMemoryLink.router('manhattan');
    memoryUnitToDataMemoryLink.source(memoryUnitBlock);
    memoryUnitToDataMemoryLink.target(dataMemoryBlock);
    memoryUnitToDataMemoryLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.attr('line/sourceMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.addTo(graph);
    
    var fetchToInsMemoryLink = controlToDecodeLink.clone();
    console.log(fetchToInsMemoryLink);
    fetchToInsMemoryLink.source(fetchBlock);
    fetchToInsMemoryLink.target(insMemoryBlock);
    fetchToInsMemoryLink.attr('line/stroke', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.attr('line/targetMarker/fill', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.attr('line/sourceMarker/fill', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.addTo(graph);
    console.log(fetchToInsMemoryLink);
    
    // decode to regfile link
    var decodeHalfX = decodeBlock.position().x + (decodeBlock.attributes.size.width / 2);
    var decodeYOff = decodeBlock.position().y + decodeBlock.attributes.size.height;
    
    
    // decode to regfile link
    // TODO: draw arrow from decode to regfile
    
   //var graphScale = 1;
    //paper.scale(0.5, 0.5);
}

function init5StageStalledOrBypassedPipelineDiagram() {
    graph.clear();
    graphScale.x = 0.8;
    graphScale.y = 0.8;
    paper.scale(graphScale.x, graphScale.y);
    var fetchBlock = new joint.shapes.standard.Rectangle();
    fetchBlock.position(16, 106);
    fetchBlock.resize(80, 100);
    fetchBlock.attr({
        body: {
            rx: 6,
            ry: 6,
            fill: '#71b3aa'
        },
        label: {
            fill: 'white',
            text: 'Fetch\nUnit'
        }
    });
    fetchBlock.addTo(graph);
    console.log(fetchBlock);
    console.log(fetchBlock.attributes.size.width);
    fetchBlock.on('change:position', function() {
        console.log('FetchBlock position: ' + fetchBlock.position());
    });
    // fetch block Regfile
    var fetchRegFileBlockTemplate = getRegfileTemplate(
        fetchBlock.position().x + (fetchBlock.attributes.size.width - 20), 
        fetchBlock.position().y, 25, fetchBlock.attributes.size.height);
    fetchRegFileBlockTemplate.regfile.attr('label/text', '');
    fetchRegFileBlockTemplate.regfile.addTo(graph);
    fetchRegFileBlockTemplate.clockSymbol.addTo(graph);
    // decode block
    var decodeBlock = fetchBlock.clone();
    decodeBlock.translate(fetchBlock.attributes.size.width + 20, 0);
    decodeBlock.attr('label/text', 'Decode\nUnit');
    decodeBlock.attr('body/fill', '#77b1bd');
    decodeBlock.addTo(graph);
    decodeBlock.on('change:position', function() {
        console.log('DecodeBlock position: ' + decodeBlock.position());
    });
    // decode regfile
    //regfileBlock.translate(decodeBlock.attributes.size.width - 10, 0);
    var regTemplate = getRegfileTemplate(
        decodeBlock.position().x + (decodeBlock.attributes.size.width - 18), 
        decodeBlock.position().y, 35, fetchBlock.attributes.size.height);
    regTemplate.regfile.attr('label/text', 'Reg\nFile');
    regTemplate.regfile.addTo(graph);
    regTemplate.clockSymbol.addTo(graph);
    
    // instruction memory
    var insMemoryBlock = fetchBlock.clone();
    insMemoryBlock.translate(-11, fetchBlock.attributes.size.height + 60);
    insMemoryBlock.attr('label/text', 'Instruction\nMemory\n16kB');
    insMemoryBlock.resize(100, 60);
    insMemoryBlock.attr('body/fill', '#993131');
    insMemoryBlock.addTo(graph);
    insMemoryBlock.on('change:position', function() {
        console.log('InsMemoryBlock position: ' + insMemoryBlock.position());
    });
    // execute block
    var executeBlock = regTemplate.regfile.clone();
    executeBlock.resize(fetchBlock.attributes.size.width, fetchBlock.attributes.size.height);
    executeBlock.translate(regTemplate.regfile.attributes.size.width + 20, 0);
    executeBlock.attr('label/text', 'Execute\nUnit');
    executeBlock.attr('label/fill', 'white');
    executeBlock.attr('body/fill', '#597cab');
    executeBlock.addTo(graph);
    executeBlock.on('change:position', function() {
        console.log('ExectuteBlock position: ' + executeBlock.position());
    });
    // execute block Regfile
    var executeRegFileBlockTemplate = getRegfileTemplate(
        executeBlock.position().x + (executeBlock.attributes.size.width - 14), 
        executeBlock.position().y, 25, fetchBlock.attributes.size.height);
    executeRegFileBlockTemplate.regfile.attr('label/text', '');
    executeRegFileBlockTemplate.regfile.addTo(graph);
    executeRegFileBlockTemplate.clockSymbol.addTo(graph);
    // memory unit
    var memoryUnitBlock = executeBlock.clone();
    memoryUnitBlock.translate(executeBlock.attributes.size.width + 50, 0);
    memoryUnitBlock.attr('label/text', 'Memory\nUnit');
    memoryUnitBlock.attr('body/fill', '#5762ab');
    memoryUnitBlock.addTo(graph);
    memoryUnitBlock.on('change:position', function() {
        console.log('MemoryUnitBlock position: ' + memoryUnitBlock.position());
    });
    // memory unit block Regfile
    var memoryRegFileBlockTemplate = getRegfileTemplate(
        memoryUnitBlock.position().x + (memoryUnitBlock.attributes.size.width - 13), 
        memoryUnitBlock.position().y, 25, fetchBlock.attributes.size.height);
    memoryRegFileBlockTemplate.regfile.attr('label/text', '');
    memoryRegFileBlockTemplate.regfile.addTo(graph);
    memoryRegFileBlockTemplate.clockSymbol.addTo(graph);
    // data memory
    var dataMemoryBlock = memoryUnitBlock.clone();
    dataMemoryBlock.translate(-10, memoryUnitBlock.attributes.size.height + 60);
    dataMemoryBlock.attr('label/text', 'Data\nMemory\n16kB');
    dataMemoryBlock.attr('body/fill', '#993131');
    dataMemoryBlock.resize(100, 60);
    dataMemoryBlock.addTo(graph);
    dataMemoryBlock.on('change:position', function() {
        console.log('DataMemoryBlock position: ' + dataMemoryBlock.position());
    });
    // write back
    var writeBackBlock = memoryUnitBlock.clone();
    writeBackBlock.translate(memoryUnitBlock.attributes.size.width + 30, 0);
    writeBackBlock.attr('label/text', 'Writeback\nUnit');
    writeBackBlock.attr('body/fill', '#4f4d85');
    writeBackBlock.addTo(graph);
    writeBackBlock.on('change:position', function() {
        console.log('WriteBackBlock position: ' + writeBackBlock.position());
    });
    // write back unit block Regfile
    var writeBackRegFileBlockTemplate = getRegfileTemplate(
        writeBackBlock.position().x + (writeBackBlock.attributes.size.width - 8), 
        writeBackBlock.position().y, 25, fetchBlock.attributes.size.height);
    writeBackRegFileBlockTemplate.regfile.attr('label/text', '');
    writeBackRegFileBlockTemplate.regfile.addTo(graph);
    writeBackRegFileBlockTemplate.clockSymbol.addTo(graph);
    // control unit
    var controlUnitBlock = decodeBlock.clone();
    controlUnitBlock.resize(80, 35);
    controlUnitBlock.translate(2, -decodeBlock.attributes.size.height + 10);
    controlUnitBlock.attr('label/text', 'Control\nUnit');
    controlUnitBlock.attr('body/fill', '#77b1bd');
    controlUnitBlock.addTo(graph);
    controlUnitBlock.on('change:position', function() {
        console.log('ControlUnitBlock position: ' + controlUnitBlock.position());
    });
     // control unit Regfile
    var controlRegFileBlockTemplate = getRegfileTemplate(
        controlUnitBlock.position().x + (controlUnitBlock.attributes.size.width - 14), 
        controlUnitBlock.position().y, 25, controlUnitBlock.attributes.size.height);
    controlRegFileBlockTemplate.regfile.attr('label/text', '');
    controlRegFileBlockTemplate.regfile.addTo(graph);
    controlRegFileBlockTemplate.clockSymbol.addTo(graph);
    // Linking
    var fetchToDecodeLink = new joint.shapes.standard.Link();
    fetchToDecodeLink.source(fetchRegFileBlockTemplate.regfile);
    fetchToDecodeLink.target(decodeBlock);
    fetchToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: fetchBlock.attr('body/fill'),
            targetMarker: {
                type: 'path',
                fill: fetchBlock.attr('body/fill')
            }
        }
    });
    fetchToDecodeLink.addTo(graph);
    
    // bypass registers?
    //exec to memory
    var execToMemRegFileBlockTemplate = getRegfileTemplate(
        executeRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y, 25, 
        controlUnitBlock.attributes.size.height);
    execToMemRegFileBlockTemplate.regfile.attr('label/text', '');
    execToMemRegFileBlockTemplate.regfile.addTo(graph);
    execToMemRegFileBlockTemplate.clockSymbol.addTo(graph);
    // memory to exec register
    var memToWriteBackRegFileBlockTemplate = getRegfileTemplate(
        memoryRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y, 25, 
        controlUnitBlock.attributes.size.height);
    memToWriteBackRegFileBlockTemplate.regfile.attr('label/text', '');
    memToWriteBackRegFileBlockTemplate.regfile.addTo(graph);
    memToWriteBackRegFileBlockTemplate.clockSymbol.addTo(graph);
    var regfileToExecuteLink = fetchToDecodeLink.clone();
    regfileToExecuteLink.source(regTemplate.regfile);
    regfileToExecuteLink.target(executeBlock);
    regfileToExecuteLink.attr('line/stroke', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.attr('line/targetMarker/fill', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.toBack();
    regfileToExecuteLink.addTo(graph);
    
    var executeToMemoryLink = regfileToExecuteLink.clone();
    executeToMemoryLink.source(executeRegFileBlockTemplate.regfile);
    executeToMemoryLink.target(memoryUnitBlock);
    executeToMemoryLink.attr('line/stroke', executeBlock.attr('body/fill'));
    executeToMemoryLink.attr('line/targetMarker/fill', executeBlock.attr('body/fill'));
    executeToMemoryLink.addTo(graph);
    
    var memoryToWriteBackLink = executeToMemoryLink.clone();
    memoryToWriteBackLink.source(memoryRegFileBlockTemplate.regfile);
    memoryToWriteBackLink.target(writeBackBlock);
    memoryToWriteBackLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.addTo(graph);
    
    var writeBackToDecodeLink = memoryToWriteBackLink.clone();
    writeBackToDecodeLink.source(writeBackRegFileBlockTemplate.regfile);
    writeBackToDecodeLink.target(decodeBlock);
    writeBackToDecodeLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['bottom'],
        padding: {
            vertical: 15,
            horizontal: 20
        }
    });
    writeBackToDecodeLink.connector('rounded', {
        radius: 5
    });
    writeBackToDecodeLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.addTo(graph);
    
    // control unit links
    
    var controlToDecodeLink = fetchToDecodeLink.clone();
    controlToDecodeLink.source(controlUnitBlock);
    controlToDecodeLink.target(decodeBlock);
    controlToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: controlUnitBlock.attr('body/fill'),
            sourceMarker: {
                type: 'path',
                fill: controlUnitBlock.attr('body/fill'),
                d: controlToDecodeLink.attr('line/targetMarker/d')
            }
        }
    });
    console.log(controlToDecodeLink);
    controlToDecodeLink.addTo(graph);
    
    var controlToExectuteLink = fetchToDecodeLink.clone();
    controlToExectuteLink.source(controlRegFileBlockTemplate.regfile);
    controlToExectuteLink.target(executeBlock);
    controlToExectuteLink.router('manhattan', {
        startDirections: ['right']
    });
    controlToExectuteLink.connector('rounded', {
        radius: 5
    });
    controlToExectuteLink.addTo(graph);
    
    var controlToExecStallLink = controlToExectuteLink.clone();
    controlToExecStallLink.target(execToMemRegFileBlockTemplate.regfile);
    controlToExecStallLink.addTo(graph);
    
    var executeToFetchBypassLink = executeToMemoryLink.clone();
    executeToFetchBypassLink.source(executeRegFileBlockTemplate.regfile);
    executeToFetchBypassLink.target(fetchBlock);
    executeToFetchBypassLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['bottom'],
        padding: {
            vertical: 25,
            left: 12
        }
    });
    executeToFetchBypassLink.addTo(graph);
    
    var execStallToMemLink = controlToExectuteLink.clone();
    execStallToMemLink.source(execToMemRegFileBlockTemplate.regfile);
    execStallToMemLink.target(memoryUnitBlock);
    execStallToMemLink.addTo(graph);
    
    var execStallToFetchLink = execStallToMemLink.clone();
    execStallToFetchLink.target(fetchBlock);
    execStallToFetchLink.router('manhattan', {
        startDirections: ['right'],
        padding: 12
    });
    execStallToFetchLink.addTo(graph);
    
    var execStallToMemStallLink = execStallToFetchLink.clone();
    execStallToMemStallLink.source(execToMemRegFileBlockTemplate.regfile);
    execStallToMemStallLink.target(memToWriteBackRegFileBlockTemplate.regfile);
    execStallToMemStallLink.addTo(graph);
    
    var memStallToWriteBackLink = execStallToMemStallLink.clone();
    memStallToWriteBackLink.source(memToWriteBackRegFileBlockTemplate.regfile);
    memStallToWriteBackLink.target(writeBackBlock);
    memStallToWriteBackLink.router('manhattan', {
        startDirections: ['right']
    });
    memStallToWriteBackLink.addTo(graph);
    
    var memoryUnitToDataMemoryLink = controlToDecodeLink.clone();
    memoryUnitToDataMemoryLink.source(memoryUnitBlock);
    memoryUnitToDataMemoryLink.target(dataMemoryBlock);
    memoryUnitToDataMemoryLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.attr('line/sourceMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryUnitToDataMemoryLink.addTo(graph);
    
    var fetchToInsMemoryLink = controlToDecodeLink.clone();
    fetchToInsMemoryLink.source(fetchBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToInsMemoryLink.target(insMemoryBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToInsMemoryLink.attr('line/stroke', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.attr('line/targetMarker/fill', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.attr('line/sourceMarker/fill', fetchBlock.attr('body/fill'));
    fetchToInsMemoryLink.addTo(graph);
    
    //  bypass / stall links
}

exports.initCanvas = initCanvas;
exports.initSingleCycle = initSingleCycleDiagram;
exports.init5StageStalledOrBypassedPipeline = init5StageStalledOrBypassedPipelineDiagram;