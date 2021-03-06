// Auto Save PSD.jsx 1.4.
// by Joonas Pääkkö
// https://github.com/joonaspaakko

/*

    <javascriptresource>
    <name>$$$/JavaScripts/AutoSavePSD/Menu=Auto Save PSD</name>
    <category>Auto Save</category>
    <enableinfo>true</enableinfo>
    <eventid>64feff0a-8271-436f-8c59-d2105497d902</eventid>
    </javascriptresource>

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {

    // Get the currently active document.
    var doc         = app.activeDocument;

    // Find out of the file has an extension
    var noExtension = doc.name.indexOf('.') == -1;

    // No file extension = File has not been saved yet
    if ( noExtension ) {

        // An action is triggered to prompt save as dialog.
        // You'd think that this would be easy to do, but I
        // couldn't figure out a better way for doing this.
        app.doAction('save','Auto Save PSD');

    }
    // Extension exists = File has been saved at least once
    else {

        // Save the original file.
        doc.save();

    }

    AutoSavePSD( doc );

} // try end

catch( e ) {
    // remove comments below to see error for debugging
    // alert( e );
}
function AutoSavePSD( doc, docName ) {

    var max_Increamental = 5;

    // Extenstion
    var psd                   = '.psd';

    // Document name
    var docName               = doc.name;

    // Document path
    var docPath               = doc.path;

    // Gets rid of the extension
    var docName               = docName.substring( 0, docName.indexOf('.') ).replace(/  /g, '_').replace(/ /g, '_');

    // Construct the Auto Save folder path
    var autoSavePath          = docPath + '/' + docName + ' (AutoSave)';

    // If Auto Save folder doesn't exist, make one.
    var autoSaveFolder        = new Folder( autoSavePath );
    if( !autoSaveFolder.exists ) { autoSaveFolder.create(); }
    var time = 0;
    var lastfile;
    var filelist = autoSaveFolder.getFiles( docName + '*' + psd );
    var suffix = 1
    if (filelist.length >0){
      for (f in filelist) {
        var checkFile = filelist[f];
        if ( checkFile.modified>time)
        {
          time = checkFile.modified;
          lastfile = checkFile.name.replace(/ /g, '_');
        }
      }
      var lastfilename = lastfile.replace(docName+"_", '').replace('.psd', '');
      var suffix = parseInt(lastfilename)+1;
    }
    // Get list of all the current auto saved files
    // Lists only those files .psd that share the same file
    var currentAS             = autoSaveFolder.getFiles( docName + '*' + psd );

    // Options for the soon to be Auto Saved PSD file
    var psd_Opt               = new PhotoshopSaveOptions();
    psd_Opt.layers            = true; // Preserve layers.
    psd_Opt.embedColorProfile = true; // Preserve color profile.
    psd_Opt.annotations       = true; // Preserve annonations.
    psd_Opt.alphaChannels     = true; // Preserve alpha channels.
    psd_Opt.spotColors        = true; // Preserve spot colors.

    // Save active document in the Auto Save folder
    doc.saveAs( File( autoSavePath + '/' + docName + '_' + suffix + psd ), psd_Opt, true );
    if (suffix > max_Increamental) {
      var FileToDelete = File (autoSavePath + '/' + docName + '_' + (suffix-max_Increamental) + psd);
      FileToDelete.remove();
    }

    app.beep();

} // AutoSavePSD() end
