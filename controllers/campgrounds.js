const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}


module.exports.newForm = (req, res) =>{
    res.render('campgrounds/new');
}


module.exports.newCreate = async (req, res, next) =>{
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Made a new Camp!');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.show = async (req, res) =>{
    const campground = await Campground.findById(req.params.id)
        .populate({
            path:'reviews',
            populate: {
                path: 'author'
            }
        }).
        populate('author');

    if(!campground){
        req.flash('error', 'no camp found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}


module.exports.editForm = async (req, res) =>{
    const{id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'no camp found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}



module.exports.editCommit = async (req, res) =>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await camp.updateOne({$pull: {images:{filename:{$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Updated a Camp!');
    res.redirect(`/campgrounds/${camp._id}`);
}


module.exports.delete = async (req, res) =>{
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted a Camp');
    res.redirect('/campgrounds');
}