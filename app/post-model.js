var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    signature: { type: String },
    time: { type: String, required: true, index: { unique: true }},
});

/*PostSchema.pre('save', function(next) {
    
    var post = this;
    next();
    return;
    // only hash the password if it has been modified (or is new)
    if (!post.isModified('password')) return next();
     
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
     
        // hash the password using our new salt
        bcrypt.hash(post.password, salt, function(err, hash) {
            if (err) return next(err);
     
            // override the cleartext password with the hashed one
            post.password = hash;
            next();
        });
    });
});*/

/*PostSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(
        candidatePassword, 
        this.password, 
        function(err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
        }
    );
};*/

module.exports = mongoose.model('Post', PostSchema);