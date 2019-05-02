blockDiagramUtils = require('../block_diagram.js');

function init5StagePipelineRegedOrBypassedPipelineDiagram(canvas) {
    canvas.graph.clear();
    canvas.graphScale.x = 0.75;
    canvas.graphScale.y = 0.75;
    canvas.paper.scale(canvas.graphScale.x, canvas.graphScale.y);
    var fetchBlock = new joint.shapes.standard.Rectangle();
    fetchBlock.position(16, 130);
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
    fetchBlock.addTo(canvas.graph);
    console.log(fetchBlock);
    console.log(fetchBlock.attributes.size.width);
    fetchBlock.on('change:position', function() {
        console.log('FetchBlock position: ' + fetchBlock.position());
    });
    // fetch block Regfile
    var fetchRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        fetchBlock.position().x + (fetchBlock.attributes.size.width - 20), 
        fetchBlock.position().y, 25, fetchBlock.attributes.size.height);
    fetchRegFileBlockTemplate.regfile.attr('label/text', '');
    fetchRegFileBlockTemplate.regfile.addTo(canvas.graph);
    fetchRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // decode block
    var decodeBlock = fetchBlock.clone();
    decodeBlock.translate(fetchBlock.attributes.size.width + 28, 0);
    decodeBlock.attr('label/text', 'Decode\nUnit');
    decodeBlock.attr('body/fill', '#77b1bd');
    decodeBlock.addTo(canvas.graph);
    decodeBlock.on('change:position', function() {
        console.log('DecodeBlock position: ' + decodeBlock.position());
    });
    // decode regfile
    var decodeRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        decodeBlock.position().x + (decodeBlock.attributes.size.width - 14), 
        decodeBlock.position().y, 35, fetchBlock.attributes.size.height);
    decodeRegFileBlockTemplate.regfile.attr('label/text', 'Reg\nFile');
    decodeRegFileBlockTemplate.regfile.addTo(canvas.graph);
    decodeRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    
    // execute block
    var executeBlock = decodeRegFileBlockTemplate.regfile.clone();
    executeBlock.resize(fetchBlock.attributes.size.width, fetchBlock.attributes.size.height);
    executeBlock.translate(decodeRegFileBlockTemplate.regfile.attributes.size.width + 20, 0);
    executeBlock.attr('label/text', 'Execute\nUnit');
    executeBlock.attr('label/fill', 'white');
    executeBlock.attr('body/fill', '#597cab');
    executeBlock.addTo(canvas.graph);
    executeBlock.on('change:position', function() {
        console.log('ExectuteBlock position: ' + executeBlock.position());
    });
    // execute block Regfile
    var executeRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        executeBlock.position().x + (executeBlock.attributes.size.width - 14), 
        executeBlock.position().y, 25, fetchBlock.attributes.size.height);
    executeRegFileBlockTemplate.regfile.attr('label/text', '');
    executeRegFileBlockTemplate.regfile.addTo(canvas.graph);
    executeRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // memory unit
    var memoryUnitBlock = executeBlock.clone();
    memoryUnitBlock.translate(executeBlock.attributes.size.width + 55, 0);
    memoryUnitBlock.attr('label/text', 'Memory\nUnit');
    memoryUnitBlock.attr('body/fill', '#5762ab');
    memoryUnitBlock.addTo(canvas.graph);
    memoryUnitBlock.on('change:position', function() {
        console.log('MemoryUnitBlock position: ' + memoryUnitBlock.position());
    });
    // memory unit block Regfile
    var memoryRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        memoryUnitBlock.position().x + (memoryUnitBlock.attributes.size.width - 13), 
        memoryUnitBlock.position().y, 25, fetchBlock.attributes.size.height);
    memoryRegFileBlockTemplate.regfile.attr('label/text', '');
    memoryRegFileBlockTemplate.regfile.addTo(canvas.graph);
    memoryRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // write back
    var writeBackBlock = memoryUnitBlock.clone();
    writeBackBlock.translate(memoryUnitBlock.attributes.size.width + 35, 0);
    writeBackBlock.attr('label/text', 'Writeback\nUnit');
    writeBackBlock.attr('body/fill', '#4f4d85');
    writeBackBlock.addTo(canvas.graph);
    writeBackBlock.on('change:position', function() {
        console.log('WriteBackBlock position: ' + writeBackBlock.position());
    });
    // write back unit block Regfile
    var writeBackRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        writeBackBlock.position().x + (writeBackBlock.attributes.size.width - 8), 
        writeBackBlock.position().y, 25, fetchBlock.attributes.size.height);
    writeBackRegFileBlockTemplate.regfile.attr('label/text', '');
    writeBackRegFileBlockTemplate.regfile.addTo(canvas.graph);
    writeBackRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // control unit
    var controlUnitBlock = new joint.shapes.standard.Circle();
    controlUnitBlock.resize(70, 70);
    controlUnitBlock.position(decodeBlock.position().x + 2, 
                               decodeBlock.position().y - decodeBlock.attributes.size.height - 20);
    controlUnitBlock.attr('label/text', 'Control\nUnit');
    controlUnitBlock.attr('body/fill', '#77b1bd');
    controlUnitBlock.attr('label/fill', 'white');
    controlUnitBlock.addTo(canvas.graph);
    controlUnitBlock.on('change:position', function() {
        console.log('ControlUnitBlock position: ' + controlUnitBlock.position());
    });
     // control unit Regfile
    var controlRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        decodeRegFileBlockTemplate.regfile.position().x + 20, 
        controlUnitBlock.position().y + 23, 25, 35);
    controlRegFileBlockTemplate.regfile.attr('label/text', '');
    controlRegFileBlockTemplate.regfile.addTo(canvas.graph);
    controlRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // Linking
    var fetchToDecodeLink = new joint.shapes.standard.Link();
    fetchToDecodeLink.source(fetchRegFileBlockTemplate.regfile);
    fetchToDecodeLink.target(decodeBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -2
            }
        }
    });
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
    fetchToDecodeLink.addTo(canvas.graph);
    
    var execToMemRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        executeRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y + 23, 25, 
        controlRegFileBlockTemplate.regfile.attributes.size.height);
    execToMemRegFileBlockTemplate.regfile.attr('label/text', '');
    execToMemRegFileBlockTemplate.regfile.addTo(canvas.graph);
    execToMemRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    // memory to exec register
    var memToWriteBackRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        memoryRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y + 23, 25, 
        controlRegFileBlockTemplate.regfile.attributes.size.height);
    memToWriteBackRegFileBlockTemplate.regfile.attr('label/text', '');
    memToWriteBackRegFileBlockTemplate.regfile.addTo(canvas.graph);
    memToWriteBackRegFileBlockTemplate.clockSymbol.addTo(canvas.graph);
    var regfileToExecuteLink = fetchToDecodeLink.clone();
    regfileToExecuteLink.source(decodeRegFileBlockTemplate.regfile);
    regfileToExecuteLink.target(executeBlock);
    regfileToExecuteLink.attr('line/stroke', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.attr('line/targetMarker/fill', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.toBack();
    regfileToExecuteLink.addTo(canvas.graph);
    
    var executeToMemoryLink = regfileToExecuteLink.clone();
    executeToMemoryLink.source(executeRegFileBlockTemplate.regfile);
    executeToMemoryLink.target(memoryUnitBlock);
    executeToMemoryLink.attr('line/stroke', executeBlock.attr('body/fill'));
    executeToMemoryLink.attr('line/targetMarker/fill', executeBlock.attr('body/fill'));
    executeToMemoryLink.addTo(canvas.graph);
    
    var memoryToWriteBackLink = executeToMemoryLink.clone();
    memoryToWriteBackLink.source(memoryRegFileBlockTemplate.regfile);
    memoryToWriteBackLink.target(writeBackBlock);
    memoryToWriteBackLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.addTo(canvas.graph);
    
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
    writeBackToDecodeLink.addTo(canvas.graph);
    
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
    controlToDecodeLink.addTo(canvas.graph);
    
    var controlToUpperDecodePipelineRegLink = fetchToDecodeLink.clone();
    controlToUpperDecodePipelineRegLink.source(controlUnitBlock);
    controlToUpperDecodePipelineRegLink.target(controlRegFileBlockTemplate.regfile);
    controlToUpperDecodePipelineRegLink.addTo(canvas.graph);
    
    var controlToExectuteLink = fetchToDecodeLink.clone();
    controlToExectuteLink.source(controlRegFileBlockTemplate.regfile);
    controlToExectuteLink.target(executeBlock);
    controlToExectuteLink.router('manhattan', {
        startDirections: ['right']
    });
    controlToExectuteLink.connector('rounded', {
        radius: 5
    });
    controlToExectuteLink.addTo(canvas.graph);
    
    var controlToExecPipelineRegLink = controlToExectuteLink.clone();
    controlToExecPipelineRegLink.target(execToMemRegFileBlockTemplate.regfile);
    controlToExecPipelineRegLink.addTo(canvas.graph);
    
    var executeToFetchBypassLink = executeToMemoryLink.clone();
    executeToFetchBypassLink.source(executeRegFileBlockTemplate.regfile);
    executeToFetchBypassLink.target(fetchBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: 10
            }
        }
    });
    executeToFetchBypassLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['bottom'],
        padding: {
            vertical: 25,
            left: 12
        }
    });
    executeToFetchBypassLink.connector('rounded', {
        radius: 5
    });
    executeToFetchBypassLink.addTo(canvas.graph);
    
    var execPipelineRegToMemLink = controlToExectuteLink.clone();
    execPipelineRegToMemLink.source(execToMemRegFileBlockTemplate.regfile);
    execPipelineRegToMemLink.target(memoryUnitBlock);
    execPipelineRegToMemLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    execPipelineRegToMemLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    execPipelineRegToMemLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['top'] 
    });
    execPipelineRegToMemLink.addTo(canvas.graph);
    
    var execPipelineRegToFetchLink = execPipelineRegToMemLink.clone();
    execPipelineRegToFetchLink.target(fetchBlock);
    execPipelineRegToFetchLink.router('manhattan', {
        startDirections: ['right'],
        padding: 12
    });
    execPipelineRegToFetchLink.addTo(canvas.graph);
    
    var execPipelineRegToMemPipelineRegLink = execPipelineRegToFetchLink.clone();
    execPipelineRegToMemPipelineRegLink.source(execToMemRegFileBlockTemplate.regfile);
    execPipelineRegToMemPipelineRegLink.target(memToWriteBackRegFileBlockTemplate.regfile);
    execPipelineRegToMemPipelineRegLink.addTo(canvas.graph);
    
    var memPipelineRegToWriteBackLink = execPipelineRegToMemPipelineRegLink.clone();
    memPipelineRegToWriteBackLink.source(memToWriteBackRegFileBlockTemplate.regfile);
    memPipelineRegToWriteBackLink.target(writeBackBlock);
    memPipelineRegToWriteBackLink.router('manhattan', {
        startDirections: ['right']
    });
    memPipelineRegToWriteBackLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    memPipelineRegToWriteBackLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    memPipelineRegToWriteBackLink.addTo(canvas.graph);
    
    // memory subsystem link
    var memorySubsystemInterfaceBlock = fetchBlock.clone();
    memorySubsystemInterfaceBlock.translate(0, fetchBlock.attributes.size.height + 80);
    memorySubsystemInterfaceBlock.attr('label/text', 'Memory Subsystem');
    var memIfWidth = writeBackBlock.position().x + 
        (writeBackBlock.attributes.size.width) - fetchBlock.position().x;
    memorySubsystemInterfaceBlock.resize(memIfWidth, 60);
    memorySubsystemInterfaceBlock.attr('body/fill', '#006666');
    memorySubsystemInterfaceBlock.addTo(canvas.graph);
    memorySubsystemInterfaceBlock.on('change:position', function() {
        console.log('InsMemoryBlock position: ' + memorySubsystemInterfaceBlock.position());
    });
    
    var fetchToMemSubsystemLink = controlToDecodeLink.clone();
    fetchToMemSubsystemLink.source(fetchBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToMemSubsystemLink.target(memorySubsystemInterfaceBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToMemSubsystemLink.attr('line/stroke', fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.attr('line/targetMarker/fill',fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.attr('line/sourceMarker/fill', fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.connector('rounded', {
        radius: 5
    });
    fetchToMemSubsystemLink.router('manhattan', {
        startDirections: ['bottom'],
        endDirections: ['top']
    });
    fetchToMemSubsystemLink.addTo(canvas.graph);
    
    
    var memUnitToMemSubsystemLink = fetchToMemSubsystemLink.clone();
    memUnitToMemSubsystemLink.source(memoryUnitBlock);
    memUnitToMemSubsystemLink.target(memorySubsystemInterfaceBlock);
    memUnitToMemSubsystemLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/sourceMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.connector('rounded', {
        radius: 5
    });
    memUnitToMemSubsystemLink.addTo(canvas.graph);
}

exports.show = init5StagePipelineRegedOrBypassedPipelineDiagram;