#target photoshop

var constants = {
    browser: { path: "files/safari.psd"},
    size: {}
};

//Getting the folder path of the script
var scriptFilePath= $.fileName.substring(0, $.fileName.lastIndexOf("/")) + "/";

// Function to get the element height
function height(element) { return element.bounds[3] - element.bounds[1]; }
// Function to get the element width
function width(element) { return element.bounds[2] - element.bounds[0]; }

function raterizeLayerStyle(){
    var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
    var desc5 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref4 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );

    ref4.putEnumerated( idLyr, idOrdn, idTrgt );
    desc5.putReference( idnull, ref4 );

    var idWhat = charIDToTypeID( "What" );
    var idrasterizeItem = stringIDToTypeID( "rasterizeItem" );
    var idlayerStyle = stringIDToTypeID( "layerStyle" );

    desc5.putEnumerated( idWhat, idrasterizeItem, idlayerStyle );
    executeAction( idrasterizeLayer, desc5, DialogModes.NO );
}

function resizeLayer(Width , Height){
    var startRulerUnits = preferences.rulerUnits;
    preferences.rulerUnits = Units.PIXELS;
    var LB = activeDocument.activeLayer.bounds;

    var lWidth = 100/(LB[2].value - LB[0].value);
    var lHeight =100/(LB[3].value - LB[1].value);

    var NewWidth = lWidth * Width;
    var NewHeight = lHeight * Height;
    activeDocument.activeLayer.resize(Number(NewWidth),Number(NewHeight),AnchorPosition.MIDDLECENTER); 
    app.preferences.rulerUnits = startRulerUnits;
}

function browserWindow(){
    // Defining the application documents
    preferences.rulerUnits = Units.PIXELS;
    var sourceDoc = app.activeDocument;
    var targetDoc = app.documents.add(sourceDoc.width, sourceDoc.height, 72, "browserWindow", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var browserDoc = app.open(File(scriptFilePath + constants.browser.path));
    
    // Merging all the layers in the source document.
    // Copying the merged layer to the newly created document.
    app.activeDocument = sourceDoc;
    app.activeDocument.artLayers.add();
    app.activeDocument.mergeVisibleLayers();
    var sourceImage = app.activeDocument.layers[0];
    sourceImage.name = "sourceImage";
    sourceImage = sourceImage.duplicate(targetDoc);
    
    // Merging and renaming all the layers in the target document.
    // This is used just for beauty, and can be removed.
    app.activeDocument = targetDoc;
    app.activeDocument.mergeVisibleLayers();
    sourceImage = app.activeDocument.layers[0];
    sourceImage.name = "sourceImage";

    // Copying the layer group from the browser document to the new target document.
    app.activeDocument = browserDoc;
    var browserWindow = app.activeDocument.layerSets.getByName("browserWindow");
    app.activeDocument.activeLayer = browserWindow;
    var browserWindow = browserWindow.duplicate(targetDoc);

    // Selecting and defining all the copied layers in the target document.
    app.activeDocument = targetDoc;
    browserWindow = app.activeDocument.layerSets.getByName("browserWindow");
    var browserTopLeft = browserWindow.layers.getByName("topLeft");
    var browserTopCenter = browserWindow.layers.getByName("topCenter");
    var browserTopRight = browserWindow.layers.getByName("topRight");
    var browserBottomLeft = browserWindow.layers.getByName("bottomLeft");
    var browserBottomCenter = browserWindow.layers.getByName("bottomCenter");
    var browserBottomRight = browserWindow.layers.getByName("bottomRight");
    var browserLeftSide = browserWindow.layers.getByName("leftSide");
    var browserRightSide = browserWindow.layers.getByName("rightSide");

    // Unfortunately, rasterizing all the layers in browserWindow group.
    // This is used, because vector layers could not be properly positioned.
    // I hope to find some workaround in the near future. I really hope.
    for (var i = 0; i < browserWindow.layers.length; i++) {
        targetDoc.activeLayer = browserWindow.layers[i];
        raterizeLayerStyle();
    }

    // Changing the document canvas size according to the layer sizes
    targetDoc.resizeCanvas(targetDoc.width, targetDoc.height + height(browserTopLeft), AnchorPosition.BOTTOMCENTER);
    targetDoc.resizeCanvas(targetDoc.width, targetDoc.height + height(browserBottomLeft), AnchorPosition.TOPCENTER);
    targetDoc.resizeCanvas(targetDoc.width + width(browserRightSide), targetDoc.height, AnchorPosition.MIDDLELEFT);
    targetDoc.resizeCanvas(targetDoc.width + width(browserLeftSide), targetDoc.height, AnchorPosition.MIDDLERIGHT);
    
    // Scaling the elements
    // Top and bottom middle sections
    targetDoc.activeLayer = browserTopCenter;
    resizeLayer(targetDoc.width - width(browserTopLeft) - width(browserTopRight), height(browserTopCenter));
    targetDoc.activeLayer = browserBottomCenter; 
    resizeLayer(targetDoc.width - width(browserBottomLeft) - width(browserBottomRight), height(browserBottomCenter));
    // Left and right sides
    targetDoc.activeLayer = browserLeftSide;
    resizeLayer(width(browserLeftSide), targetDoc.height - height(browserTopLeft) - height(browserBottomLeft));
    targetDoc.activeLayer = browserRightSide;
    resizeLayer(width(browserRightSide), targetDoc.height - height(browserTopRight) - height(browserBottomRight));
    
    // Moving all the layers to the right positions
    // Top Sections
    browserTopLeft.translate(- browserTopLeft.bounds[0], - browserTopLeft.bounds[1]);
    browserTopCenter.translate(- browserTopCenter.bounds[0] + width(browserTopLeft), - browserTopCenter.bounds[1]);
    browserTopRight.translate( targetDoc.width - width(browserTopRight) - browserTopRight.bounds[0], - browserTopRight.bounds[1]);
    // Bottom Sections
    browserBottomLeft.translate(- browserBottomLeft.bounds[0], targetDoc.height - browserBottomLeft.bounds[1] - height(browserBottomLeft));
    browserBottomCenter.translate(- browserBottomCenter.bounds[0] + width(browserBottomLeft), targetDoc.height - browserBottomCenter.bounds[1] - height(browserBottomCenter));
    browserBottomRight.translate( targetDoc.width - width(browserBottomRight) - browserBottomRight.bounds[0], targetDoc.height - browserBottomRight.bounds[1] - height(browserBottomRight));
    //Side Sections
    browserLeftSide.translate(- browserLeftSide.bounds[0], - browserLeftSide.bounds[1] + height(browserTopLeft));
    browserRightSide.translate(targetDoc.width - width(browserRightSide) - browserRightSide.bounds[0], - browserRightSide.bounds[1] + height(browserTopRight));
    
    targetDoc.resizeCanvas(targetDoc.width + 50, targetDoc.height + 50);

    browserDoc.close();
    app.activeDocument.activeLayer = browserWindow;
}

app.bringToFront();
browserWindow();

