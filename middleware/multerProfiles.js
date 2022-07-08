const multer = require('multer');

let noUserImage = "noUserImage.jpg"

const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
        /* if(!file) {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + noUserImage);
        } else {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
        } */
    }
});
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'){
            cb(null, true);
        }else {
            cb(null, false);
        }
}


const upload = multer({storage: storageProfiles, fileFilter: filefilter});

module.exports = {upload};

/* FIN */