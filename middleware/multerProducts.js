const multer = require('multer');
const fs = require('fs');
const path = require('path');

let fl = fs.readdirSync('uploads/products');
let numFl = fl.length;

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        let numI = ++numFl
        let st = numI.toString();
        //console.log(st);
        cb(null, Date.now() + st + path.extname(file.originalname));
        /* if(!file) {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + noUserImage);
        } else {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
        } */
        //console.log(file);
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

const upload = multer({storage: storageProducts, fileFilter: filefilter});

module.exports = {upload};

/* FIN */