// Checks to see if a file exists
function exists(file) {
    try {
        if(file.exists()) {
            return true;
        }
    } catch(e) {
        console.log(e);
    }

    return false;
}

// Checks if a file is a pdf by reading it and checking magic word
function isPdf(file) {
    try {
        // read first 4 bytes and check if its equal to %PDF

        var blob = file.read();

        if(!blob) return false;

        // sometimes its a blob, sometimes its text already.
        if(!blob.slice) blob = blob.text;

        if(!blob) return false;

        console.log("first few characters of pdf file: " + blob.slice(0, 5));

        if(blob.indexOf("%PDF") === 0) return true;

    } catch(e) {
        console.log(e);
    }

    return false;
}

// Downloads a pdf
function download(url, cookies, done) {
    var base = Ti.Utils.md5HexDigest(url) + '.pdf';
    var file = Ti.Filesystem.getFile(
        Ti.Filesystem.applicationDataDirectory,
        base
    );

    if(exists(file) && isPdf(file)) {
        console.log("File already exists and is pdf, returning");
        return done(null, file, base, url);
    }

    // Download pdf file
    var client = Ti.Network.createHTTPClient();
    client.onload = function(e) {
        try {
            // reopen the file, because otherwise the app will segfault, no really.
            var base = Ti.Utils.md5HexDigest(url) + '.pdf';
            var file = Ti.Filesystem.getFile(
                Ti.Filesystem.applicationDataDirectory,
                base
            );
            if(e.source.status != 200)
                throw new Error("http status " + e.source.status);
            file.write(e.source.responseData);
            return done(null, file, base, url);
        } catch(e) {
            return done(e);
        }
    };

    client.onerror = function(e) {
        console.log("http error " + e.source.status);
        return done(e);
    };

    client.setRequestHeader("Cookie", cookies);

    client.open("GET", url);
    client.send();
    return client;
}

// copies srcFile to a temp dir / filename.pdf
function copyToTemp(srcFile, base, url) {
    // create temp directory (with md5 hash as dirname) and put file in there.
    // This is so that the name of the file (on the server) can be the same
    // as the name of the file on the device tha we're about to write so the
    // filename shows up properly in whatever reader the user is using.
    // Otherwise it'd be some hex string (ie, the md5 hash as filename

    var tempdir = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, base);
    tempdir.createDirectory();

    var filename = url.split('/');
    filename = filename[ filename.length - 1 ];

    var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, base, filename);

    tempFile.write(srcFile.read());

    return tempFile;
}

// launch intent to read pdf
function launch(file) {
    console.log("launching pdf path: " + file.getNativePath());
    var intent = Ti.Android.createIntent({
        action: Ti.Android.ACTION_VIEW,
        data: file.getNativePath(),
        type: "application/pdf"
    });
    Ti.Android.currentActivity.startActivity(intent);
}

// do whole thing -- download url w/ cookies and launch pdf
function pdf(url, cookies, done) {
    if(!Ti.Filesystem.isExternalStoragePresent()) {
        // TODO: display error
        return done(new Error("external"));
    }

    download(url, cookies, function(err, file, base, url) {
        if(err) return done(err);

        var tempFile = copyToTemp(file, base, url);
        launch(tempFile);
        done();
    });
}

module.exports = pdf;