import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, './public/audio/');
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, './public/images/');
        } else {
            cb(null, './public/defaultFolder/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });

export default upload;